'use client';

import { ActivityGraph } from '@/components/ui/ActivityGraph';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Heatmap } from '@/components/ui/Heatmap';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatsCard } from '@/components/ui/StatsCard';
import { motion } from 'framer-motion';

const skillData = [
  { label: 'JavaScript', value: 92 },
  { label: 'TypeScript', value: 86 },
  { label: 'Backend', value: 78 },
  { label: 'System design', value: 69 },
];

export default function ProfilePage() {
  return (
    <div className="space-y-8 pb-16 pt-2">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute right-0 bottom-0 h-96 w-96 bg-gradient-to-tr from-secondary/10 to-transparent blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-secondary">Profile</p>
              <h1 className="mt-1 text-4xl font-extrabold text-text-primary">Student profile</h1>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 mt-2">
              <div className="glass-card p-5 shadow-none hover:shadow-md">
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest">Level</p>
                <p className="mt-2 text-3xl font-extrabold text-text-primary">Engineer</p>
              </div>
              <div className="glass-card p-5 shadow-none hover:shadow-md">
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest">Certificates</p>
                <p className="mt-2 text-3xl font-extrabold text-text-primary">3 earned</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm font-semibold text-text-secondary mb-3">
                <span>Overall Mastery</span>
                <span className="text-primary">76%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-border-glass ring-1 ring-inset ring-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `76%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" 
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="primary">Download certificate</Button>
              <Button variant="secondary">View achievements</Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <StatsCard title="Lessons completed" value="34" percent={85} />
          <StatsCard title="XP earned" value="1,180" percent={72} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-secondary">Skill matrix</p>
              <h2 className="mt-1 text-2xl font-bold text-text-primary">Strengths and focus</h2>
            </div>
            <Button variant="secondary">
              Edit profile
            </Button>
          </div>
          <div className="space-y-6 mt-4">
            {skillData.map((skill, i) => (
              <div key={skill.label} className="space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-text-secondary">
                  <span>{skill.label}</span>
                  <span className="text-text-primary drop-shadow-sm">{skill.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-border-glass ring-1 ring-inset ring-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(99,102,241,0.4)]" 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="overflow-hidden">
          <ActivityGraph />
        </div>
      </div>

      <div className="overflow-hidden">
        <Heatmap />
      </div>
    </div>
  );
}
