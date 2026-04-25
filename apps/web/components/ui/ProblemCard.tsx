import { Button } from '@/components/ui/Button';

export function ProblemCard({ title, description, tags }: { title: string; description: string; tags: string[] }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg shadow-black/5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">Problem prompt</p>
          <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
        </div>
        <Button variant="ghost" size="sm">
          Start
        </Button>
      </div>
      <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
