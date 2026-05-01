import { Heart, ShieldCheck, Sparkles, Users } from "lucide-react";

const IMG = {
  volunteers: "https://images.unsplash.com/photo-1774557937549-8844e48e8b22?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwyfHx2b2x1bnRlZXJzJTIwY29tbXVuaXR5JTIwc3BvcnRzfGVufDB8fHx8MTc3NzAzMjAzMHww&ixlib=rb-4.1.0&q=85",
  hiking: "https://images.unsplash.com/photo-1762376303818-04b067ce452d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBoaWtpbmclMjBzdW5ueSUyMG91dGRvb3JzfGVufDB8fHx8MTc3NzAzMjAzMHww&ixlib=rb-4.1.0&q=85",
};

const values = [
  { icon: Heart, title: "Dignity first", desc: "Every participant is the expert on themselves. We listen, adapt, and respect." },
  { icon: ShieldCheck, title: "Safe by design", desc: "Trained coaches, safeguarding policies, quiet rooms, and consistent routines." },
  { icon: Users, title: "Community-led", desc: "Co-created with autistic young people, families, and community partners." },
  { icon: Sparkles, title: "Play, always", desc: "Progress looks like joy — we prioritise fun over performance." },
];

export default function AboutPage() {
  return (
    <div data-testid="about-page">
      {/* Hero */}
      <section className="bg-blue-radial border-b border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-[1.1fr,1fr] gap-12 items-center">
          <div className="anim-fade-up">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-600">Who we are</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
              A foundation built by the community, for the community.
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              Beyond The Blades (ASD Foundation) started on a community rink — a handful of kids that needed care, a borrowed bag of skates, and a belief that sport belongs to everyone. Today we run weekly events across a growing range of activities, with a group of helpful and kind volunteers.
            </p>
          </div>
          <div className="relative anim-fade-up delay-200">
            <div className="rounded-[2rem] overflow-hidden card-soft aspect-[5/4]">
              <img src={process.env.PUBLIC_URL + "/volunteer.png"} alt="Community volunteers supporting participants" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 grid lg:grid-cols-[1fr,1.2fr] gap-12 items-start">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-600">What we do</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Inclusive sport programs designed around real lives.
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            We organise weekly sessions across a range of activities — including hockey, badminton, hiking, and more as our community grows. Each session is small, predictable, and led by kind and caring volunteers. We pair participants with trained buddy-volunteers, provide visual schedules, and keep participation free or sliding-scale so no family is out of the loop.
          </p>
          <div className="mt-8 rounded-3xl border border-blue-100 bg-blue-50/60 p-6">
            <p className="font-display text-xl font-semibold text-slate-900">Our promise</p>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Show up as you are. We'll meet you there — with patience, with structure, and with a whole lot of excitement.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v) => (
            <div
              key={v.title}
              data-testid={`value-${v.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-3xl bg-white border border-slate-100 p-7 card-soft hover:-translate-y-1 transition-transform"
            >
              <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-gradient-to-b from-white to-blue-50/50 border-y border-blue-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-600 text-center">Our story</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 text-center">
            It began with one skate, one Saturday, one smile.
          </h2>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-slate-600">
            <p>
              A group of peers noticed that many traditional sports leagues weren't built for their autistic child. Bright lights, loud whistles, unpredictable drills — small details that made participation impossible. So they started small: one hour, one rink, one buddy per child.
            </p>
            <p>
              Word spread. Families drove from further. More people volunteered. A badminton area opened their doors. A univeristy opened up venue spaces. From that first Saturday, Beyond The Blades grew into a foundation dedicated to one idea — that sport can be a door, not a wall.
            </p>
            <p className="font-display text-xl text-slate-900 font-medium">
              We're still that same community. Just a little bigger, a lot louder, and endlessly proud.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
