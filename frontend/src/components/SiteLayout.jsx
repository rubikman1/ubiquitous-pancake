import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home", testId: "nav-home" },
  { to: "/about", label: "About", testId: "nav-about" },
  { to: "/impact", label: "Impact", testId: "nav-impact" },
  { to: "/get-involved", label: "Get Involved", testId: "nav-get-involved" },
];

function BrandMark() {
  return (
    <Link to="/" data-testid="brand-home-link" className="flex items-center gap-2.5 group">
      {/* <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
        <img src="" alt="Beyond The Blades logo" className="h-10 w-10 rounded-2xl object-cover" />
         <span className="font-display font-bold text-lg">B</span>
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-sky-300 border-2 border-white" />
      </div> */}
      <div className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
        <img
          src={process.env.PUBLIC_URL + "/logo3.png"}
          alt="Beyond The Blades logo"
          className="h-full w-full object-cover"
         />
</div> 
      <div className="leading-tight">
        <div className="font-display font-bold text-slate-900 text-base tracking-tight">
          Beyond The Blades
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-blue-600 font-semibold">
          ASD Foundation
        </div>
      </div>
    </Link>
  );
}

export default function SiteLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Header */}
      <header
        data-testid="site-header"
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandMark />
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={item.testId}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/get-involved#donate" className="hidden sm:block">
              <Button
                data-testid="header-donate-btn"
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
              >
                <Heart className="h-4 w-4 mr-1.5" />
                Donate
              </Button>
            </Link>
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 rounded-full hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div
            data-testid="mobile-nav"
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  data-testid={`mobile-${item.testId}`}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/get-involved#donate" className="mt-2">
                <Button
                  data-testid="mobile-donate-btn"
                  className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Heart className="h-4 w-4 mr-1.5" />
                  Donate
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer with Donate + Copyright */}
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer data-testid="site-footer" className="mt-16 border-t border-slate-200 bg-gradient-to-b from-white to-blue-50/40">
      {/* Donate CTA strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-sky-500 text-white p-8 sm:p-14 card-soft">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="relative grid md:grid-cols-[1.4fr,1fr] gap-8 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-blue-100 font-semibold">
                Every dollar moves someone forward
              </p>
              <h3 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Help us bring more kids into more activities they can truly call their own.
              </h3>
              <p className="mt-4 text-blue-50/90 text-base sm:text-lg max-w-xl leading-relaxed">
                Your donation funds equipment, venue fees, and trained volunteers so every participant feels safe, seen, and celebrated.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link to="/get-involved#donate">
                <Button
                  data-testid="footer-donate-btn"
                  size="lg"
                  className="rounded-full bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-base font-semibold shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-0.5"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center">
              <span className="font-display font-bold text-sm">B</span>
            </div> */}
            <div className="relative h-8 w-8 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <img
                src={process.env.PUBLIC_URL + "/logo3.png"}
                alt="Beyond The Blades logo"
                className="h-full w-full object-cover"
              />
        </div>
            <div>
              <div className="font-display font-semibold text-slate-900 text-sm">
                Beyond The Blades (ASD Foundation)
              </div>
              <p data-testid="footer-copyright" className="text-xs text-slate-500">
                © 2026 Beyond The Blades | Non-Profit Organization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <a
              href="mailto:beyondbladesasdfoundation@gmail.com"
              data-testid="footer-email-link"
              className="hover:text-blue-700 transition-colors"
            >
              beyondbladesasdfoundation@gmail.com
            </a>
            <Link to="/about" className="hover:text-blue-700 transition-colors">
              About
            </Link>
            <Link to="/impact" className="hover:text-blue-700 transition-colors">
              Impact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
