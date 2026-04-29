import { Quote, TrendingUp, Users, Smile, Calendar } from "lucide-react";

const IMG = {
  hiking: "https://images.unsplash.com/photo-1762376303818-04b067ce452d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBoaWtpbmclMjBzdW5ueSUyMG91dGRvb3JzfGVufDB8fHx8MTc3NzAzMjAzMHww&ixlib=rb-4.1.0&q=85",
};

const stats = [
  { icon: Users, value: "75+", label: "Young people served", tone: "blue" },
  { icon: Calendar, value: "30+", label: "Sessions run this year", tone: "sky" },
  { icon: Smile, value: "95%", label: "Families report joy & belonging", tone: "indigo" },
  { icon: TrendingUp, value: "1.75x", label: "Weekly program growth YoY", tone: "blue" },
];

const toneMap = {
  blue: "from-blue-500 to-blue-400",
  sky: "from-sky-500 to-sky-400",
  indigo: "from-indigo-500 to-blue-400",
};

const stories = [
  {
    name: "Jane Doe, age 11",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    name: "John Doe",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    name: "Bob Sam",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
];

export default function ImpactPage() {
  return (
    <div data-testid="impact-page">
      {/* Hero */}
      <section className="bg-blue-radial border-b border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl anim-fade-up">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-600">Our impact</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
              One step no matter how big or small is progress.
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Here's what happens when a community decides that every person, no matter how similar or different gets care.
            </p>
          </div>
        </div>
      </section>

      {/* Stats — Bento-style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-testid={`impact-stat-${i}`}
              className="rounded-3xl bg-white border border-slate-100 p-8 card-soft hover:-translate-y-1 transition-transform"
            >
              <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${toneMap[s.tone]} text-white flex items-center justify-center`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-6 font-display text-5xl font-bold tracking-tight text-slate-900">{s.value}</div>
              <div className="mt-2 text-sm text-slate-600 leading-relaxed">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quotes — the big one */}
      <section className="bg-gradient-to-b from-blue-50/60 to-white border-y border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 grid lg:grid-cols-[1.1fr,1fr] gap-12 items-center">
          <div data-testid="impact-quote-grandin" className="relative">
            <Quote className="h-14 w-14 text-blue-200" />
            <blockquote className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
              "Different, not less."
            </blockquote>
            <cite className="mt-6 block not-italic text-base text-slate-500">
              — Dr. Temple Grandin
            </cite>
            <div className="mt-10 rounded-3xl bg-white border border-slate-100 p-7 card-soft max-w-xl">
              <Quote className="h-6 w-6 text-blue-400" />
              <p className="mt-3 font-display text-xl leading-snug text-slate-900">
                "Autism is a different way of being human."
              </p>
              <p className="mt-3 text-sm text-slate-500">— Barry Prizant, Ph.D.</p>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden card-soft aspect-[4/5]">
              <img src="/group.png" alt="A supportive hike on a scenic trail" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 bg-white rounded-2xl p-5 border border-slate-100 card-soft">
              <p className="text-sm text-slate-500">From our Winter Badminton session</p>
              <p className="mt-1 font-display text-lg font-semibold text-slate-900">
                30 participants · 10 volunteers · one very proud group photo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-600">Stories from the sessions</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Every hour we spend together is someone's quiet milestone.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <div
              key={i}
              data-testid={`story-card-${i}`}
              className="rounded-3xl bg-white border border-slate-100 p-7 card-soft hover:-translate-y-1 transition-transform"
            >
              <Quote className="h-6 w-6 text-blue-400" />
              <p className="mt-4 text-slate-700 leading-relaxed">"{s.text}"</p>
              <p className="mt-6 text-sm font-semibold text-slate-900">{s.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
