import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Snowflake, Mountain, Circle, ArrowRight, Sparkles, Users, HandHeart } from "lucide-react";

const IMG = {
  hero: "https://images.unsplash.com/photo-1706844587140-9c58f98b030c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwxfHxraWRzJTIwcGxheWluZyUyMGhvY2tleXxlbnwwfHx8fDE3NzcwMzIwMzB8MA&ixlib=rb-4.1.0&q=85",
  badminton: "https://images.pexels.com/photos/12969082/pexels-photo-12969082.jpeg",
  hiking: "https://images.unsplash.com/photo-1762376303818-04b067ce452d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBoaWtpbmclMjBzdW5ueSUyMG91dGRvb3JzfGVufDB8fHx8MTc3NzAzMjAzMHww&ixlib=rb-4.1.0&q=85",
};

const activities = [
  { icon: Snowflake, title: "Ice Hockey", desc: "Weekly skate sessions with adaptive coaching and buddy pairings.", color: "from-blue-500 to-sky-400" },
  { icon: Circle, title: "Badminton", desc: "Low-sensory indoor courts — gentle rallies, zero judgment.", color: "from-sky-500 to-indigo-400" },
  { icon: Mountain, title: "Hiking", desc: "Scenic trails led by trained guides and sensory-aware volunteers.", color: "from-indigo-500 to-blue-400" },
];

export default function HomePage() {
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden bg-blue-radial">
        <div className="absolute inset-0 bg-soft-grid opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
          <div className="grid lg:grid-cols-[1.15fr,1fr] gap-12 lg:gap-16 items-center">
            <div className="anim-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-blue-100 rounded-full px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-semibold tracking-[0.14em] uppercase text-blue-700">
                  Autism Care · Sport · Belonging
                </span>
              </div>
              <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
                Sport that meets <span className="text-blue-600">every</span> child
                <br className="hidden sm:block" /> exactly where they are.
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                Beyond The Blades (ASD Foundation) brings young people on the autism spectrum together through hockey, badminton, hiking, and a growing list of inclusive activities — at sensory-aware venues, with volunteers trained to celebrate every step forward.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/get-involved#donate">
                  <Button
                    data-testid="hero-donate-btn"
                    size="lg"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                  >
                    <Heart className="h-5 w-5 mr-2" /> Donate
                  </Button>
                </Link>
                <Link to="/get-involved">
                  <Button
                    data-testid="hero-get-involved-btn"
                    size="lg"
                    variant="outline"
                    className="rounded-full border-blue-200 bg-white hover:bg-blue-50 text-blue-700 px-8 py-6 text-base font-semibold"
                  >
                    Get Involved <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
                <Stat num="200+" label="Participants" />
                <div className="h-8 w-px bg-slate-200" />
                <Stat num="40+" label="Volunteers" />
                <div className="h-8 w-px bg-slate-200" />
                <Stat num="3" label="Venues" />
              </div>
            </div>

            {/* Image collage */}
            <div className="relative anim-fade-up delay-200">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden card-soft">
                <img
                  src="/activity3.png"
                  alt="Young players learning hockey together"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/0 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-6 w-44 rounded-3xl overflow-hidden border-4 border-white card-soft hidden sm:block">
                <img src="/activity1.png" alt="Badminton practice" className="h-36 w-full object-cover" />
              </div>
              <div className="absolute -top-6 -right-4 w-40 rounded-3xl overflow-hidden border-4 border-white card-soft hidden sm:block">
                <img src="/activity2.png" alt="Guided hike" className="h-32 w-full object-cover" />
              </div>
              <div className="absolute -bottom-4 right-4 bg-white rounded-2xl px-4 py-3 card-soft border border-slate-100 hidden md:flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <HandHeart className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-500">This month</div>
                  <div className="text-sm font-semibold text-slate-900">3 events have been hosted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-600">What we do</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Activities built for belonging — and always growing.
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed text-lg max-w-2xl">
            Here are a few of the activities we run. New programs are added as our non-profit grows — if you have an idea, tell us.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((a, i) => (
            <div
              key={a.title}
              data-testid={`activity-card-${i}`}
              className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-8 card-soft transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${a.color} text-white flex items-center justify-center shadow-md`}>
                <a.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-slate-900">{a.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{a.desc}</p>
              <Link
                to="/get-involved"
                className="mt-6 inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm group-hover:gap-2.5 transition-all"
              >
                Join a session <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
          <div
            data-testid="activity-card-more"
            className="relative overflow-hidden rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-md border border-blue-100">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-slate-900">…and more</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                We're always adding new activities based on what our community asks for. Suggest one — we love a good idea.
              </p>
            </div>
            <Link
              to="/get-involved#info"
              className="mt-6 inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:gap-2.5 transition-all"
            >
              Suggest an activity <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION band */}
      <section className="bg-gradient-to-b from-blue-50/60 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5">
                <Users className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-semibold tracking-[0.14em] uppercase text-blue-700">Our mission</span>
              </div>
              <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                Beyond the score. Beyond the stigma. <span className="text-blue-600">Beyond The Blades.</span>
              </h2>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Sport is our strongest avenue to create confidence, build friendships, and establish routines. Our activities are designed alongside autistic people, their family members, and more, ensuring each class is both predictable and enjoyable.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/about">
                  <Button data-testid="home-about-btn" variant="outline" className="rounded-full border-slate-200 px-6">
                    Learn about us
                  </Button>
                </Link>
                <Link to="/impact">
                  <Button data-testid="home-impact-btn" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6">
                    See our impact
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MissionCard title="Inclusive by design" desc="Sensory-aware venues, visual schedules, and more." />
              <MissionCard title="Coaches who listen" desc="Making events enjoyable and fun." accent />
              <MissionCard title="Family-first" desc="Siblings and parents always welcome to play or watch." accent />
              <MissionCard title="No cost barriers" desc="Need-based fee waivers, nobody is turned away." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ num, label }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-slate-900">{num}</div>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function MissionCard({ title, desc, accent }) {
  return (
    <div
      className={`rounded-3xl p-6 border ${
        accent
          ? "bg-gradient-to-br from-blue-600 to-sky-500 text-white border-transparent"
          : "bg-white border-slate-100 text-slate-900"
      } card-soft`}
    >
      <div className="font-display text-lg font-semibold">{title}</div>
      <p className={`mt-2 text-sm leading-relaxed ${accent ? "text-blue-50/90" : "text-slate-600"}`}>
        {desc}
      </p>
    </div>
  );
}
