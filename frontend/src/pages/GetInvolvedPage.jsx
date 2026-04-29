import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Heart, HandHeart, Loader2, Sparkles, Snowflake, Circle, Mountain, Mail } from "lucide-react";

const preset = [
  { id: "booster", amount: 5, label: "Booster" },
  { id: "supporter", amount: 10, label: "Supporter" },
  { id: "promoter", amount: 25, label: "Promoter" },
  { id: "advocate", amount: 50, label: "Advocate" },
];

const ACTIVITIES = [
  { id: "hockey", label: "Ice Hockey", icon: Snowflake, desc: "Saturdays  · Community and Indoor Rink · September-Feburary" },
  { id: "badminton", label: "Badminton", icon: Circle, desc: "Saturdays  · Indoor Courts · Year-Round" },
  { id: "hiking", label: "Hiking", icon: Mountain, desc: "Monthly  · Enjoyable and Scenic Trails · March-August" },
  { id: "other", label: "Something else", icon: Sparkles, desc: "Tell us what you'd love to try — we'll see what we can do." },
];

const INTERESTS = ["Coaching / Sports", "Event Setup", "Buddy Volunteer", "Fundraising", "Photography", "Admin / Comms"];

export default function GetInvolvedPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }, [location.hash]);

  return (
    <div data-testid="get-involved-page">
      {/* Hero */}
      <section className="bg-blue-radial border-b border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl anim-fade-up">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-600">Get involved</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
              Three simple ways to help us keep the lights on.
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Donate, sign up for a session, or volunteer your time. Everything makes a difference, no contribution goes unnoticed.
            </p>
          </div>
        </div>
      </section>

      {/* Donate */}
      <DonateSection />

      {/* Activities signup */}
      <ActivitiesSection />

      {/* Volunteer */}
      <VolunteerSection />

      {/* Contact / more info */}
      <ContactSection />
    </div>
  );
}

function DonateSection() {
  const [selected, setSelected] = useState("champion");
  const [custom, setCustom] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const useCustom = custom && Number(custom) > 0;

  const handleDonate = async () => {
    setLoading(true);
    try {
      const payload = {
        origin_url: window.location.origin,
        donor_name: donorName || undefined,
        donor_email: donorEmail || undefined,
      };
      if (useCustom) {
        payload.custom_amount = Number(custom);
      } else {
        payload.package_id = selected;
      }
      const { data } = await api.post("/donations/checkout", payload);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.detail || "Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="donate" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
      <div className="grid lg:grid-cols-[1fr,1.2fr] gap-10 items-start">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5">
            <Heart className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-semibold tracking-[0.14em] uppercase text-blue-700">Donate</span>
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
            Fund a goal, a hike, a Saturday morning of belonging.
          </h2>
          <p className="mt-5 text-slate-600 leading-relaxed text-lg">
            100% of donations go directly toward equipment, venue fees, and training volunteers. Pick a preset amount or enter your own.
          </p>
          
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-7 sm:p-9 card-soft">
          <h3 className="font-display text-2xl font-semibold text-slate-900">Make a one-time donation</h3>
          <p className="text-sm text-slate-500 mt-1">Secure checkout via Stripe.</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {preset.map((p) => {
              const active = !useCustom && selected === p.id;
              return (
                <button
                  key={p.id}
                  data-testid={`donate-preset-${p.id}`}
                  onClick={() => {
                    setSelected(p.id);
                    setCustom("");
                  }}
                  className={`rounded-2xl border px-3 py-4 text-left transition-all ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "border-slate-200 bg-white hover:border-blue-300 text-slate-900"
                  }`}
                >
                  <div className={`text-[11px] uppercase tracking-widest ${active ? "text-blue-100" : "text-slate-500"}`}>
                    {p.label}
                  </div>
                  <div className="font-display text-2xl font-bold mt-1">${p.amount}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <Label htmlFor="custom-amount" className="text-xs uppercase tracking-widest text-slate-500">
              Or enter a custom amount
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <Input
                id="custom-amount"
                data-testid="donate-custom-amount"
                type="number"
                min="1"
                placeholder="Other amount"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="pl-8 rounded-xl h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="donor-name" className="text-xs uppercase tracking-widest text-slate-500">Your name (optional)</Label>
              <Input
                id="donor-name"
                data-testid="donate-name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="mt-2 rounded-xl h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                placeholder="Alex Morgan"
              />
            </div>
            <div>
              <Label htmlFor="donor-email" className="text-xs uppercase tracking-widest text-slate-500">Email (optional)</Label>
              <Input
                id="donor-email"
                data-testid="donate-email"
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="mt-2 rounded-xl h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <Button
            data-testid="donate-submit-btn"
            onClick={handleDonate}
            disabled={loading}
            size="lg"
            className="mt-7 w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Redirecting to Stripe…</>
            ) : (
              <><Heart className="h-5 w-5 mr-2" /> Continue to secure checkout</>
            )}
          </Button>
          <p className="mt-4 text-xs text-slate-500 text-center">
            You'll be redirected to Stripe's secure payment page.
          </p>
        </div>
      </div>
    </section>
  );
}

function ActivitiesSection() {
  const [activity, setActivity] = useState("hockey");
  const [form, setForm] = useState({ name: "", email: "", participant_age: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please provide your name and email.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/activity-signups", { ...form, activity });
      toast.success("Thanks! We'll be in touch with session details.");
      setForm({ name: "", email: "", participant_age: "", notes: "" });
    } catch (err) {
        console.log("FULL ERROR:", err.response?.data);

        const detail = err?.response?.data?.detail;

        const message = Array.isArray(detail)
          ? detail[0]?.msg
          :detail?.msg || detail || err.message;

        toast.error(typeof message === "string" ? message : "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="activities" className="bg-gradient-to-b from-white to-blue-50/50 border-y border-blue-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 grid lg:grid-cols-[1fr,1.1fr] gap-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-semibold tracking-[0.14em] uppercase text-blue-700">Activities</span>
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
            Sign up for an activity — free or sliding-scale.
          </h2>
          <p className="mt-5 text-slate-600 leading-relaxed text-lg">
            Pick from what we run today, or tell us about something you'd love to see added. We'll follow up with venue info, what to bring, and sensory notes.
          </p>
          <div className="mt-8 space-y-3">
            {ACTIVITIES.map((a) => {
              const active = activity === a.id;
              return (
                <button
                  key={a.id}
                  data-testid={`activity-option-${a.id}`}
                  onClick={() => setActivity(a.id)}
                  className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    active ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${active ? "bg-white/20" : "bg-blue-50 text-blue-600"}`}>
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-display font-semibold">{a.label}</div>
                    <div className={`text-sm ${active ? "text-blue-50/90" : "text-slate-500"}`}>{a.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={submit}
          data-testid="activity-signup-form"
          className="rounded-3xl bg-white border border-slate-100 p-7 sm:p-9 card-soft"
        >
          <h3 className="font-display text-2xl font-semibold text-slate-900">Sign up for {ACTIVITIES.find((a) => a.id === activity)?.label}</h3>
          <p className="text-sm text-slate-500 mt-1">We'll confirm by email within 2 business days.</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-1">
              <Label htmlFor="as-name">Participant / Parent name</Label>
              <Input id="as-name" data-testid="activity-name" value={form.name} onChange={update("name")} className="mt-2 rounded-xl h-12 bg-slate-50 border-slate-200" required />
            </div>
            <div>
              <Label htmlFor="as-email">Email</Label>
              <Input id="as-email" data-testid="activity-email" type="email" value={form.email} onChange={update("email")} className="mt-2 rounded-xl h-12 bg-slate-50 border-slate-200" required />
            </div>
            <div>
              <Label htmlFor="as-age">Participant age (optional)</Label>
              <Input id="as-age" data-testid="activity-age" value={form.participant_age} onChange={update("participant_age")} className="mt-2 rounded-xl h-12 bg-slate-50 border-slate-200" placeholder="e.g. 9" />
            </div>
            <div>
              <Label>Activity</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger data-testid="activity-select" className="mt-2 h-12 rounded-xl bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITIES.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="as-notes">Anything we should know? (optional)</Label>
              <Textarea id="as-notes" data-testid="activity-notes" value={form.notes} onChange={update("notes")} rows={4} className="mt-2 rounded-xl bg-slate-50 border-slate-200" placeholder="Sensory preferences, accessibility needs, or questions…" />
            </div>
          </div>
          <Button data-testid="activity-submit-btn" type="submit" disabled={loading} size="lg" className="mt-7 w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold">
            {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting…</> : "Sign up"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function VolunteerSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleInterest = (i) => {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please provide your name and email.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/volunteers", { ...form, interests });
      toast.success("Welcome to the team! We'll reach out with onboarding details.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setInterests([]);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="volunteer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
      <div className="grid lg:grid-cols-[1fr,1.2fr] gap-10 items-start">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5">
            <HandHeart className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-semibold tracking-[0.14em] uppercase text-blue-700">Volunteer</span>
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
            Two hours a week can change a life, including yours.
          </h2>
          <p className="mt-5 text-slate-600 leading-relaxed text-lg">
            We make sure every volunteer is kind and helpful towards children. No sports experience needed — patience and a big smile go a long way.
          </p>
          <div className="mt-6 rounded-2xl bg-blue-50/60 border border-blue-100 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">What happens next?</p>
            <p className="mt-1 text-slate-600">We'll email you within a few days with a short form, some volunteering rules, and a big welcome.</p>
          </div>
        </div>

        <form
          onSubmit={submit}
          data-testid="volunteer-form"
          className="rounded-3xl bg-white border border-slate-100 p-7 sm:p-9 card-soft"
        >
          <h3 className="font-display text-2xl font-semibold text-slate-900">Become a volunteer</h3>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="v-name">Full name</Label>
              <Input id="v-name" data-testid="volunteer-name" value={form.name} onChange={update("name")} className="mt-2 rounded-xl h-12 bg-slate-50 border-slate-200" required />
            </div>
            <div>
              <Label htmlFor="v-email">Email</Label>
              <Input id="v-email" data-testid="volunteer-email" type="email" value={form.email} onChange={update("email")} className="mt-2 rounded-xl h-12 bg-slate-50 border-slate-200" required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="v-phone">Phone (optional)</Label>
              <Input id="v-phone" data-testid="volunteer-phone" value={form.phone} onChange={update("phone")} className="mt-2 rounded-xl h-12 bg-slate-50 border-slate-200" />
            </div>
          </div>
          <div className="mt-5">
            <Label>Areas of interest</Label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {INTERESTS.map((i) => {
                const checked = interests.includes(i);
                return (
                  <label
                    key={i}
                    data-testid={`volunteer-interest-${i.toLowerCase().replace(/\s+/g, "-").replace(/[/]/g, "-")}`}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                      checked ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleInterest(i)} />
                    <span className="text-sm font-medium text-slate-800">{i}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="mt-5">
            <Label htmlFor="v-message">Tell us about yourself (optional)</Label>
            <Textarea id="v-message" data-testid="volunteer-message" rows={4} value={form.message} onChange={update("message")} className="mt-2 rounded-xl bg-slate-50 border-slate-200" placeholder="Experience, availability, or anything you'd like us to know…" />
          </div>
          <Button data-testid="volunteer-submit-btn" type="submit" disabled={loading} size="lg" className="mt-7 w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold">
            {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting…</> : "Volunteer with us"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="info" className="bg-gradient-to-b from-blue-50/50 to-white border-t border-blue-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 grid md:grid-cols-3 gap-6">
        <InfoCard
          title="Questions?"
          desc="Drop us a line anytime — we respond to every email within 3 business days."
          cta={{ label: "beyondbladesasdfoundation@gmail.com", href: "mailto:beyondbladesasdfoundation@gmail.com", testId: "contact-email-btn" }}
        />
        <InfoCard
          title="Partner with us"
          desc="Venues, schools, and community groups — we'd love to collaborate."
          cta={{ label: "Start a conversation", href: "mailto:beyondbladesasdfoundation@gmail.com?subject=Partnership", testId: "partner-btn" }}
        />
        <InfoCard
          title="Spread the word"
          desc="Share Beyond The Blades with one family who needs to find us."
          cta={{ label: "Share this page", onClick: () => navigator.clipboard?.writeText(window.location.origin), testId: "share-btn" }}
        />
      </div>
    </section>
  );
}

function InfoCard({ title, desc, cta }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-7 card-soft">
      <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
        <Mail className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
      {cta?.href ? (
        <a data-testid={cta.testId} href={cta.href} className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">
          {cta.label} →
        </a>
      ) : (
        <button
          data-testid={cta.testId}
          onClick={() => {
            cta.onClick?.();
            toast.success("Link copied to clipboard!");
          }}
          className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          {cta.label} →
        </button>
      )}
    </div>
  );
}
