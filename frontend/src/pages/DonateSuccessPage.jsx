import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CheckCircle2, Loader2, XCircle, Heart } from "lucide-react";

export default function DonateSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState({ status: "checking", data: null, error: null });

  useEffect(() => {
    if (!sessionId) {
      setState({ status: "missing", data: null, error: null });
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;

    const poll = async () => {
      attempts += 1;
      try {
        const { data } = await api.get(`/donations/status/${sessionId}`);
        if (cancelled) return;
        if (data.payment_status === "paid") {
          setState({ status: "paid", data, error: null });
          return;
        }
        if (data.status === "expired") {
          setState({ status: "expired", data, error: null });
          return;
        }
        if (attempts >= maxAttempts) {
          setState({ status: "pending", data, error: "Still processing. Please check your email." });
          return;
        }
        setTimeout(poll, 2000);
      } catch (e) {
        if (cancelled) return;
        setState({ status: "error", data: null, error: e?.response?.data?.detail || "Could not check status" });
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div data-testid="donate-success-page" className="bg-blue-radial min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="rounded-3xl bg-white border border-slate-100 p-10 card-soft text-center">
          {state.status === "checking" && (
            <>
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-600" />
              <h1 className="mt-6 font-display text-3xl font-semibold text-slate-900">Checking your payment…</h1>
              <p className="mt-3 text-slate-600">Hang tight, this only takes a moment.</p>
            </>
          )}
          {state.status === "paid" && (
            <>
              <div className="h-16 w-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h1 className="mt-6 font-display text-3xl sm:text-4xl font-bold text-slate-900">Thank you! 💙</h1>
              <p className="mt-3 text-slate-600 text-lg">
                Your donation of ${Number(state.data?.amount || 0).toFixed(2)} {String(state.data?.currency || "usd").toUpperCase()} will directly fund our next sessions.
              </p>
              <p className="mt-2 text-sm text-slate-500">A receipt has been emailed by Stripe.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/">
                  <Button data-testid="back-home-btn" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6">Back to home</Button>
                </Link>
                <Link to="/get-involved#volunteer">
                  <Button data-testid="volunteer-next-btn" variant="outline" className="rounded-full border-blue-200 px-6">
                    <Heart className="h-4 w-4 mr-1.5" /> Volunteer too
                  </Button>
                </Link>
              </div>
            </>
          )}
          {(state.status === "expired" || state.status === "error" || state.status === "missing") && (
            <>
              <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <XCircle className="h-9 w-9" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-semibold text-slate-900">Something went wrong</h1>
              <p className="mt-3 text-slate-600">{state.error || "Your session expired or was not found."}</p>
              <Link to="/get-involved#donate">
                <Button data-testid="try-again-btn" className="mt-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6">Try again</Button>
              </Link>
            </>
          )}
          {state.status === "pending" && (
            <>
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-600" />
              <h1 className="mt-6 font-display text-3xl font-semibold text-slate-900">Still processing…</h1>
              <p className="mt-3 text-slate-600">{state.error}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
