'use client';

import { CodePanel } from '@/components/ui/CodePanel';
import { OutputConsole } from '@/components/ui/OutputConsole';
import { ProblemCard } from '@/components/ui/ProblemCard';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { useState } from 'react';

const problem = {
  title: 'Optimize array filtering for performance',
  description:
    'Write a function that removes all falsy values from an array and returns a new array with a stable iteration order. Focus on readability, correctness, and supporting common edge cases.',
  tags: ['JavaScript', 'Array', 'Algorithms', 'Performance'],
};

const tabItems = [
  { key: 'instructions', label: 'Instructions' },
  { key: 'examples', label: 'Examples' },
  { key: 'constraints', label: 'Constraints' },
];

export default function ProblemPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState('instructions');

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.28em] text-secondary">Practice</p>
        <h1 className="text-4xl font-semibold text-text-primary">{problem.title}</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_0.55fr]">
        <div className="space-y-6">
          <ProblemCard title={problem.title} description={problem.description} tags={problem.tags} />
          <Card>
            <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
            <div className="mt-6 rounded-3xl border border-border bg-background p-5 text-sm leading-7 text-text-secondary">
              {activeTab === 'instructions' && (
                <p>Implement a helper function that filters out falsy values while preserving array order. Avoid mutation and keep complexity manageable.</p>
              )}
              {activeTab === 'examples' && (
                <div className="space-y-3">
                  <p>Input: [0, 1, false, 2, '', 3] → Output: [1, 2, 3]</p>
                  <p>Input: [null, undefined, NaN, 'hello'] → Output: ['hello']</p>
                </div>
              )}
              {activeTab === 'constraints' && (
                <ul className="list-disc space-y-2 pl-5 text-text-secondary">
                  <li>Use a pure function.</li>
                  <li>Preserve original order.</li>
                  <li>Handle all JavaScript falsy values.</li>
                </ul>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <CodePanel initialCode={`function cleanArray(items) {
  return items.filter(Boolean);
}

console.log(cleanArray([0, 1, false, 2, '', 3]));`} />
          <OutputConsole output="[1, 2, 3]" />
        </div>
      </div>
    </div>
  );
}
