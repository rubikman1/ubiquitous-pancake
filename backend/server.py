from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Stripe setup
STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "")

# Fixed donation packages (server-side only, prevents price manipulation)
DONATION_PACKAGES: Dict[str, float] = {
    "supporter": 25.00,
    "advocate": 50.00,
    "champion": 100.00,
    "hero": 250.00,
}

app = FastAPI()
api_router = APIRouter(prefix="/api")

# enforce unique emails
@app.on_event("startup")
async def startup():
    await db.volunteers.create_index("email", unique=True)


# ---------- Models ----------
def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


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
    package_id: Optional[str] = None  # one of DONATION_PACKAGES keys
    custom_amount: Optional[float] = None  # if set, overrides package
    donor_name: Optional[str] = Field(None, max_length=120)
    donor_email: Optional[EmailStr] = None
    origin_url: str


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Beyond The Blades API", "status": "ok"}


# Volunteer signup
@api_router.post("/volunteers", response_model=Volunteer)
async def create_volunteer(payload: VolunteerCreate): 
    from pymongo.errors import DuplicateKeyError
    from fastapi import HTTPException
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "interests": payload.interests,
        "message": payload.message,
        "created_at": iso_now(),
    }

    try:
        await db.volunteers.insert_one(doc.copy())
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="You already signed up with this email."
        )
    return Volunteer(**doc)


@api_router.get("/volunteers", response_model=List[Volunteer])
async def list_volunteers():
    rows = await db.volunteers.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Volunteer(**r) for r in rows]


# Activity signup
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


# Contact
@api_router.post("/contact")
async def create_contact(payload: ContactCreate):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "message": payload.message,
        "created_at": iso_now(),
    }
    await db.contact_messages.insert_one(doc.copy())
    return {"id": doc["id"], "ok": True}


# ---------- Donations (Stripe) ----------
import stripe

stripe.api_key = os.environ.get("STRIPE_API_KEY")


@api_router.post("/donations/checkout")
async def create_donation_checkout(payload: DonationCheckoutRequest):
    if payload.package_id:
        if payload.package_id not in DONATION_PACKAGES:
            raise HTTPException(status_code=400, detail="Invalid package_id")
        amount = int(DONATION_PACKAGES[payload.package_id] * 100)
    elif payload.custom_amount:
        amount = int(payload.custom_amount * 100)
    else:
        raise HTTPException(status_code=400, detail="Provide amount")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": "Donation",
                    },
                    "unit_amount": amount,
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{payload.origin_url}/success",
            cancel_url=f"{payload.origin_url}/cancel",
        )

        return {"url": session.url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/donations/packages")
async def list_packages():
    return {
        "packages": [
            {"id": k, "amount": v, "currency": "usd"}
            for k, v in DONATION_PACKAGES.items()
        ]
    }


@api_router.post("/donations/checkout")
async def create_donation_checkout(payload: DonationCheckoutRequest, request: Request):
    # Determine amount server-side
    amount: Optional[float] = None
    if payload.package_id:
        if payload.package_id not in DONATION_PACKAGES:
            raise HTTPException(status_code=400, detail="Invalid package_id")
        amount = float(DONATION_PACKAGES[payload.package_id])
    elif payload.custom_amount is not None:
        if payload.custom_amount < 1 or payload.custom_amount > 100000:
            raise HTTPException(status_code=400, detail="Amount must be between $1 and $100,000")
        amount = float(round(payload.custom_amount, 2))
    else:
        raise HTTPException(status_code=400, detail="Provide package_id or custom_amount")

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/donate/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/get-involved"

    metadata = {
        "source": "btb_donation",
        "package_id": payload.package_id or "custom",
        "donor_name": payload.donor_name or "",
        "donor_email": payload.donor_email or "",
    }

    stripe_checkout = _get_stripe(request)
    session_req = CheckoutSessionRequest(
        amount=amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(session_req)

    # Record transaction
    tx_doc = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "amount": amount,
        "currency": "usd",
        "metadata": metadata,
        "donor_name": payload.donor_name,
        "donor_email": payload.donor_email,
        "payment_status": "initiated",
        "status": "open",
        "created_at": iso_now(),
        "updated_at": iso_now(),
    }
    await db.payment_transactions.insert_one(tx_doc.copy())

    return {"url": session.url, "session_id": session.session_id}


@api_router.get("/donations/status/{session_id}")
async def get_donation_status(session_id: str, request: Request):
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # If already finalized, return as-is (prevent double processing)
    if tx.get("payment_status") == "paid":
        return {
            "status": tx.get("status"),
            "payment_status": tx.get("payment_status"),
            "amount": tx.get("amount"),
            "currency": tx.get("currency"),
        }

    stripe_checkout = _get_stripe(request)
    try:
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
    except Exception as e:
        # Fallback: if Stripe can't find/verify yet, return the stored DB state so the
        # frontend can keep polling instead of hard-failing.
        logging.warning("Stripe status check fallback for %s: %s", session_id, e)
        return {
            "status": tx.get("status", "open"),
            "payment_status": tx.get("payment_status", "initiated"),
            "amount": tx.get("amount"),
            "currency": tx.get("currency"),
        }

    update = {
        "status": status.status,
        "payment_status": status.payment_status,
        "updated_at": iso_now(),
    }
    await db.payment_transactions.update_one({"session_id": session_id}, {"$set": update})

    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount": tx.get("amount"),
        "currency": tx.get("currency"),
    }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    stripe_checkout = _get_stripe(request)
    try:
        event = await stripe_checkout.handle_webhook(body, signature)
    except Exception as e:
        logging.exception("Webhook handle failed")
        raise HTTPException(status_code=400, detail=str(e))

    if event.session_id:
        await db.payment_transactions.update_one(
            {"session_id": event.session_id},
            {
                "$set": {
                    "payment_status": event.payment_status,
                    "status": "complete" if event.payment_status == "paid" else "open",
                    "updated_at": iso_now(),
                    "last_event": event.event_type,
                }
            },
        )
    return {"received": True}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:3001"
    ).split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
