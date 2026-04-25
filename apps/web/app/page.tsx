import Link from 'next/link';
import { CURRICULUM } from '@forge/shared';

export default function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="py-10 md:py-16">
        <p className="text-blue-600 text-sm font-medium mb-4 tracking-wide uppercase">
          A training environment, not a tutorial site.
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black">
          Train like an engineer.<br />
          <span className="text-blue-600">Ship like one.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          A 5-stage curriculum that takes beginners from CS fundamentals to Software Engineer L1 —
          through deep explanations, dry-runs, company-tagged problems, and industry-grade projects.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Start free
          </Link>
          <Link
            href="/courses"
            className="px-5 py-3 rounded-lg border border-gray-300 text-black hover:border-blue-400 hover:text-blue-600"
          >
            See curriculum
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Stat label="Stages" value="5" />
          <Stat label="Modules" value={`${CURRICULUM.reduce((a, c) => a + c.modules.length, 0)}`} />
          <Stat label="Lessons" value={`${CURRICULUM.reduce((a, c) => a + c.modules.reduce((b, m) => b + m.lessons.length, 0), 0)}`} />
          <Stat label="Target" value="SWE L1" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-black mb-6">The 5 stages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM.map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="group border border-gray-300 rounded-xl p-5 hover:border-blue-500 bg-white transition-colors"
            >
              <div className="text-xs text-blue-600 font-medium">STAGE {c.stage}</div>
              <div className="text-lg font-semibold text-black mt-1 group-hover:text-blue-600">{c.title}</div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{c.description}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                {c.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-600">{t}</span>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-4">
                {c.modules.length} modules · {c.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons · ~{c.estimatedHours}h
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-300 pt-12">
        <h2 className="text-2xl font-semibold text-black mb-6">What makes this different</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Feature title="8-section learning model"
                   body="Every topic has Simple Explanation → Visual → Deep Breakdown → Dry Run → Common Mistakes → Interview Qs → Practice → Think Like an Engineer. A lesson isn't real until all 8 exist." />
          <Feature title="In-browser runner"
                   body="Write JS/TS, see output instantly. Call-stack + queue visualization is built in — understand what's actually happening under the hood." />
          <Feature title="Industry-grade projects"
                   body="Build an auth system, a chat app, a social feed backend. Not tutorials — specs with acceptance criteria, like real tickets." />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
      <div className="text-2xl font-bold text-black">{value}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-gray-300 p-5 bg-gray-50">
      <div className="font-semibold text-black">{title}</div>
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
