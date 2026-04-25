'use client';

import Link from 'next/link';
import { CURRICULUM } from '@forge/shared';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden glass-card p-10 md:p-16"
      >
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Fully authored learning
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
            Train like an engineer.
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent-500 bg-clip-text text-transparent drop-shadow-sm">
              Ship like one.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl leading-relaxed text-text-secondary max-w-2xl font-light">
            A complete 5-stage curriculum with engineered lessons, dry-runs, common mistakes, interview practice, and real problem sets — built for modern learners who want a polished, practical experience.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all"
              >
                Start your journey
              </motion.button>
            </Link>
            <Link href="/courses" className="group rounded-full border border-border-glass bg-surface/50 px-8 py-4 text-sm font-bold text-text-primary transition-all hover:bg-surface hover:shadow-lg hover:border-primary/40 backdrop-blur-md">
              <span className="flex items-center gap-2">
                Explore curriculum
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </div>
          
          <div className="mt-12 grid gap-4 rounded-3xl border border-border-glass bg-surface/40 p-6 text-sm text-text-secondary sm:grid-cols-3 backdrop-blur-md shadow-inner">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-text-primary">5</span>
              <span className="uppercase tracking-widest text-xs font-semibold">Stages</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-text-primary">
                {CURRICULUM.reduce((a, c) => a + c.modules.reduce((b, m) => b + m.lessons.length, 0), 0)}
              </span>
              <span className="uppercase tracking-widest text-xs font-semibold">Lessons</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-text-primary">
                {CURRICULUM.reduce((a, c) => a + c.modules.length, 0)}
              </span>
              <span className="uppercase tracking-widest text-xs font-semibold">Modules</span>
            </div>
          </div>
        </div>
      </motion.section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">The 5 Stages</h2>
            <p className="text-base text-text-secondary max-w-xl">Master modern engineering concepts, systems thinking, and real-world problem solving.</p>
          </div>
        </div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {CURRICULUM.map((c) => (
            <motion.div key={c.slug} variants={itemVariants}>
              <Link
                href={`/courses/${c.slug}`}
                className="group flex h-full flex-col justify-between rounded-[2rem] border border-border-glass bg-surface/70 p-8 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] hover:bg-surface"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex h-10 items-center justify-center rounded-full bg-primary/10 px-4 text-xs font-black uppercase tracking-widest text-primary ring-1 ring-inset ring-primary/20">
                      Stage {c.stage}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">{c.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-text-secondary">{c.description}</p>
                </div>
                
                <div className="mt-8 space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {c.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-xl border border-border-glass bg-background/50 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-border-glass pt-5 text-xs font-semibold text-text-secondary">
                    <div className="flex gap-4">
                      <span>{c.modules.length} modules</span>
                      <span>~{c.estimatedHours}h</span>
                    </div>
                    <span className="text-primary opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      Start →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card relative overflow-hidden p-8 md:p-12"
      >
        <div className="absolute right-0 top-0 h-64 w-64 bg-gradient-to-bl from-warning/20 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 grid gap-8 md:grid-cols-3">
          <Feature title="8-section learning model"
                   body="Every topic has Simple Explanation → Visual → Deep Breakdown → Dry Run → Common Mistakes → Interview Questions → Practice Problems → Think Like an Engineer." 
                   icon="🧠" />
          <Feature title="Built-in sandbox"
                   body="Run JavaScript inside the browser with a clean execution preview. Understand what the event loop actually does with live examples." 
                   icon="⚡" />
          <Feature title="Engineered for learners"
                   body="Modern, responsive lessons with clear progression, code practice, and milestone tracking for real learner growth." 
                   icon="📈" />
        </div>
      </motion.section>
    </div>
  );
}

function Feature({ title, body, icon }: { title: string; body: string; icon: string }) {
  return (
    <div className="group rounded-3xl border border-transparent p-6 transition-all hover:bg-surface/50 hover:border-border-glass hover:shadow-xl">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-2xl shadow-inner ring-1 ring-inset ring-secondary/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-secondary/20 group-hover:-rotate-3">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-text-primary">{title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{body}</p>
    </div>
  );
}
