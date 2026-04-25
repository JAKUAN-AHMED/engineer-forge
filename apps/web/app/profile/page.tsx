'use client';

import { ActivityGraph } from '@/components/ui/ActivityGraph';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Heatmap } from '@/components/ui/Heatmap';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatsCard } from '@/components/ui/StatsCard';

const skillData = [
  { label: 'JavaScript', value: 92 },
  { label: 'TypeScript', value: 86 },
  { label: 'Backend', value: 78 },
  { label: 'System design', value: 69 },
];

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-secondary">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-text-primary">Student profile</h1>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-text-secondary">Level</p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">Engineer</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Certificates</p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">3 earned</p>
              </div>
            </div>
            <ProgressBar value={76} />
            <div className="flex flex-wrap gap-3 pt-4">
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
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-secondary">Skill matrix</p>
              <h2 className="text-xl font-semibold text-text-primary">Strengths and focus</h2>
            </div>
            <Button variant="ghost" size="sm">
              Edit profile
            </Button>
          </div>
          <div className="space-y-4">
            {skillData.map((skill) => (
              <div key={skill.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>{skill.label}</span>
                  <span>{skill.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${skill.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <ActivityGraph />
        </Card>
      </div>

      <Heatmap />
    </div>
  );
}
