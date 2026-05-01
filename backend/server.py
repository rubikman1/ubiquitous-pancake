from fastapi import FastAPI, APIRouter, HTTPException, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
from pathlib import Path
from datetime import datetime, timezone
import os
import uuid
import logging
import stripe

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY") or os.environ.get("STRIPE_API_KEY")

if not stripe.api_key:
    print("WARNING: Missing STRIPE_SECRET_KEY in .env")

DONATION_PACKAGES: Dict[str, float] = {
    "supporter": 25.00,
    "advocate": 50.00,
    "champion": 100.00,
    "hero": 250.00,
}

app = FastAPI()
api_router = APIRouter(prefix="/api")


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@app.on_event("startup")
async def startup():
    await db.volunteers.create_index("email", unique=True)

@app.get("/")
async def root_health():
    return {"status": "ok"}


class VolunteerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=40)
    interests: List[str] = Field(default_factory=list)
    message: Optional[str] = Field(None, max_length=2000)


class Volunteer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    interests: List[str] = []
    message: Optional[str] = None
    created_at: str


class ActivitySignupCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    activity: str = Field(..., min_length=1, max_length=60)
    participant_age: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = Field(None, max_length=2000)


class ActivitySignup(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    activity: str
    participant_age: Optional[str] = None
    notes: Optional[str] = None
    created_at: str


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=4000)


class DonationCheckoutRequest(BaseModel):
    package_id: Optional[str] = None
    custom_amount: Optional[float] = None
    donor_name: Optional[str] = Field(None, max_length=120)
    donor_email: Optional[EmailStr] = None
    origin_url: str


@api_router.get("/")
async def root():
    return {"message": "Beyond The Blades API", "status": "ok"}


@api_router.post("/volunteers", response_model=Volunteer)
async def create_volunteer(payload: VolunteerCreate):
    from pymongo.errors import DuplicateKeyError

    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email.lower().strip(),
        "phone": payload.phone,
        "interests": payload.interests,
        "message": payload.message,
        "created_at": iso_now(),
    }

    try:
        await db.volunteers.insert_one(doc.copy())
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="You already signed up with this email.")

    return Volunteer(**doc)


@api_router.get("/volunteers", response_model=List[Volunteer])
async def list_volunteers():
    rows = await db.volunteers.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Volunteer(**r) for r in rows]


@api_router.post("/activity-signups", response_model=ActivitySignup)
async def create_activity_signup(payload: ActivitySignupCreate):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email.lower().strip(),
        "activity": payload.activity,
        "participant_age": payload.participant_age,
        "notes": payload.notes,
        "created_at": iso_now(),
    }

    await db.activity_signups.insert_one(doc.copy())
    return ActivitySignup(**doc)


@api_router.get("/activity-signups", response_model=List[ActivitySignup])
async def list_activity_signups():
    rows = await db.activity_signups.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [ActivitySignup(**r) for r in rows]


@api_router.post("/contact")
async def create_contact(payload: ContactCreate):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email.lower().strip(),
        "message": payload.message,
        "created_at": iso_now(),
    }

    await db.contact_messages.insert_one(doc.copy())
    return {"id": doc["id"], "ok": True}


@api_router.get("/donations/packages")
async def list_packages():
    return {
        "packages": [
            {"id": k, "amount": v, "currency": "cad"}
            for k, v in DONATION_PACKAGES.items()
        ]
    }


@api_router.post("/donations/checkout")
async def create_donation_checkout(payload: DonationCheckoutRequest):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe secret key is missing")

    if payload.package_id:
        if payload.package_id not in DONATION_PACKAGES:
            raise HTTPException(status_code=400, detail="Invalid package_id")
        amount = DONATION_PACKAGES[payload.package_id]
    elif payload.custom_amount is not None:
        if payload.custom_amount < 1 or payload.custom_amount > 100000:
            raise HTTPException(status_code=400, detail="Amount must be between $1 and $100,000")
        amount = round(float(payload.custom_amount), 2)
    else:
        raise HTTPException(status_code=400, detail="Provide package_id or custom_amount")

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/donate/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/get-involved"

    metadata = {
        "source": "btb_donation",
        "package_id": payload.package_id or "custom",
        "donor_name": payload.donor_name or "",
        "donor_email": str(payload.donor_email or ""),
    }

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "cad",
                        "product_data": {
                            "name": "Donation to Beyond The Blades",
                        },
                        "unit_amount": int(amount * 100),
                    },
                    "quantity": 1,
                }
            ],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
            customer_email=str(payload.donor_email) if payload.donor_email else None,
        )

        tx_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session.id,
            "amount": amount,
            "currency": "cad",
            "metadata": metadata,
            "donor_name": payload.donor_name,
            "donor_email": str(payload.donor_email or ""),
            "payment_status": "initiated",
            "status": "open",
            "created_at": iso_now(),
            "updated_at": iso_now(),
        }

        await db.payment_transactions.insert_one(tx_doc.copy())

        return {"url": session.url, "session_id": session.id}

    except Exception as e:
        logging.exception("Stripe checkout failed")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/donations/status/{session_id}")
async def get_donation_status(session_id: str):
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})

    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    try:
        session = stripe.checkout.Session.retrieve(session_id)

        update = {
            "status": session.status,
            "payment_status": session.payment_status,
            "updated_at": iso_now(),
        }

        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": update}
        )

        return {
            "status": session.status,
            "payment_status": session.payment_status,
            "amount": tx.get("amount"),
            "currency": tx.get("currency"),
        }

    except Exception:
        return {
            "status": tx.get("status", "open"),
            "payment_status": tx.get("payment_status", "initiated"),
            "amount": tx.get("amount"),
            "currency": tx.get("currency"),
        }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")

    if not webhook_secret:
        raise HTTPException(status_code=500, detail="Stripe webhook secret is missing")

    body = await request.body()
    signature = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(
            payload=body,
            sig_header=signature,
            secret=webhook_secret,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        await db.payment_transactions.update_one(
            {"session_id": session["id"]},
            {
                "$set": {
                    "payment_status": session.get("payment_status", "paid"),
                    "status": session.get("status", "complete"),
                    "updated_at": iso_now(),
                    "last_event": event["type"],
                }
            },
        )

    return {"received": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:3001,https://beyondbladesasd.org"
    ).split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()