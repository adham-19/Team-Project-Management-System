import { ArrowUpRight } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
}) {
  return (
    <div className="rounded-2xl border border-border-light bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-main-bg">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <ArrowUpRight className="h-4 w-4 text-text-secondary" />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-text-secondary">
          {title}
        </p>

        <p className="mt-1 text-3xl font-bold text-text-main">
          {value}
        </p>

        {description && (
          <p className="mt-1 text-xs text-text-secondary">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}