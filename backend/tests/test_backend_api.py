"""Backend API tests for Beyond The Blades foundation.

Covers: root, donation packages/checkout/status, volunteers, activity-signups,
contact, validation, MongoDB _id leakage checks.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://btb-foundation.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ---------- Root ----------
class TestRoot:
    def test_root(self, s):
        r = s.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data and "status" in data
        assert data["status"] == "ok"


# ---------- Donation packages ----------
class TestPackages:
    def test_list_packages(self, s):
        r = s.get(f"{API}/donations/packages")
        assert r.status_code == 200
        data = r.json()
        assert "packages" in data
        pkgs = {p["id"]: p for p in data["packages"]}
        assert set(pkgs.keys()) == {"supporter", "advocate", "champion", "hero"}
        assert pkgs["supporter"]["amount"] == 25.0
        assert pkgs["advocate"]["amount"] == 50.0
        assert pkgs["champion"]["amount"] == 100.0
        assert pkgs["hero"]["amount"] == 250.0
        for p in data["packages"]:
            assert p["currency"] == "usd"


# ---------- Donation checkout ----------
class TestCheckout:
    session_id_champion = None
    session_id_custom = None

    def test_checkout_package_champion(self, s):
        r = s.post(f"{API}/donations/checkout", json={
            "package_id": "champion",
            "origin_url": BASE_URL,
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and "session_id" in data
        assert data["url"].startswith("http")
        TestCheckout.session_id_champion = data["session_id"]

    def test_checkout_custom_amount(self, s):
        r = s.post(f"{API}/donations/checkout", json={
            "custom_amount": 42.50,
            "origin_url": BASE_URL,
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and "session_id" in data
        TestCheckout.session_id_custom = data["session_id"]

    def test_checkout_invalid_package(self, s):
        r = s.post(f"{API}/donations/checkout", json={
            "package_id": "doesnotexist",
            "origin_url": BASE_URL,
        })
        assert r.status_code == 400

    def test_checkout_missing_both(self, s):
        r = s.post(f"{API}/donations/checkout", json={
            "origin_url": BASE_URL,
        })
        assert r.status_code == 400

    def test_checkout_amount_too_low(self, s):
        r = s.post(f"{API}/donations/checkout", json={
            "custom_amount": 0.5,
            "origin_url": BASE_URL,
        })
        assert r.status_code == 400

    def test_checkout_amount_too_high(self, s):
        r = s.post(f"{API}/donations/checkout", json={
            "custom_amount": 200000,
            "origin_url": BASE_URL,
        })
        assert r.status_code == 400

    def test_status_champion(self, s):
        sid = TestCheckout.session_id_champion
        if not sid:
            pytest.skip("No champion session")
        r = s.get(f"{API}/donations/status/{sid}")
        assert r.status_code == 200, r.text
        data = r.json()
        assert "status" in data and "payment_status" in data
        assert data["amount"] == 100.0
        assert data["currency"] == "usd"

    def test_status_not_found(self, s):
        r = s.get(f"{API}/donations/status/nonexistent_session_xyz_123")
        assert r.status_code == 404


# ---------- Volunteers ----------
class TestVolunteers:
    created_id = None

    def test_create_volunteer(self, s):
        payload = {
            "name": "TEST_Vol Jane",
            "email": "TEST_jane@example.com",
            "phone": "5551234567",
            "interests": ["hockey", "hiking"],
            "message": "Excited to help!",
        }
        r = s.post(f"{API}/volunteers", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["interests"] == ["hockey", "hiking"]
        assert "id" in data and "created_at" in data
        assert "_id" not in data
        TestVolunteers.created_id = data["id"]

    def test_list_volunteers(self, s):
        r = s.get(f"{API}/volunteers")
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        assert len(rows) >= 1
        for row in rows:
            assert "_id" not in row
            assert "id" in row and "name" in row and "email" in row
        # newest first
        if len(rows) >= 2:
            assert rows[0]["created_at"] >= rows[1]["created_at"]
        assert any(r_["id"] == TestVolunteers.created_id for r_ in rows)

    def test_create_volunteer_missing_name(self, s):
        r = s.post(f"{API}/volunteers", json={"email": "a@b.com"})
        assert r.status_code == 422

    def test_create_volunteer_invalid_email(self, s):
        r = s.post(f"{API}/volunteers", json={"name": "X", "email": "not-an-email"})
        assert r.status_code == 422


# ---------- Activity signups ----------
class TestActivitySignups:
    created_id = None

    def test_create_activity_signup(self, s):
        payload = {
            "name": "TEST_Kid Parent",
            "email": "TEST_parent@example.com",
            "activity": "badminton",
            "participant_age": "12",
            "notes": "First timer",
        }
        r = s.post(f"{API}/activity-signups", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["activity"] == "badminton"
        assert "id" in data and "created_at" in data
        assert "_id" not in data
        TestActivitySignups.created_id = data["id"]

    def test_list_activity_signups(self, s):
        r = s.get(f"{API}/activity-signups")
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        assert len(rows) >= 1
        for row in rows:
            assert "_id" not in row
        assert any(r_["id"] == TestActivitySignups.created_id for r_ in rows)

    def test_create_activity_missing_fields(self, s):
        r = s.post(f"{API}/activity-signups", json={"name": "X"})
        assert r.status_code == 422


# ---------- Contact ----------
class TestContact:
    def test_create_contact(self, s):
        r = s.post(f"{API}/contact", json={
            "name": "TEST_Contact",
            "email": "TEST_c@example.com",
            "message": "Hi there",
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("ok") is True
        assert "id" in data
