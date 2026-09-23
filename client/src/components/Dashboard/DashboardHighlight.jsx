import { Flag } from "lucide-react";

export default function DashboardHighlight({ task, projectName }) {
  if (!task) {
    return (
      <section className="rounded-2xl border border-border-light bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-main-bg">
            <Flag className="h-4 w-4 text-primary" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-text-main">
              Priority Task
            </h2>

            <p className="text-xs text-text-secondary">
              Your most important pending task
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border-light bg-main-bg/50 p-4">
          <p className="text-sm font-semibold text-text-main">
            No pending tasks
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            You currently have no unfinished tasks.
          </p>
        </div>
      </section>
    );
  }

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-error border border-red-100";

      case "Medium":
        return "bg-orange-50 text-orange-600 border border-orange-100";

      case "Low":
        return "bg-green-50 text-success border border-green-100";

      default:
        return "bg-main-bg text-text-secondary border border-border-light";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-50 text-success border border-green-100";

      case "In Progress":
        return "bg-blue-50 text-blue-600 border border-blue-100";

      case "To Do":
        return "bg-orange-50 text-orange-600 border border-orange-100";

      default:
        return "bg-main-bg text-text-secondary border border-border-light";
    }
  };

  return (
    <section className="rounded-2xl border border-border-light bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-main-bg">
          <Flag className="h-4 w-4 text-primary" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-text-main">
            Priority Task
          </h2>

          <p className="text-xs text-text-secondary">
            Your most important pending task
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border-light bg-main-bg/50 p-4">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-sm font-bold text-text-main">
              {task.title}
            </h3>

            <p className="mt-1 text-xs text-text-secondary">
              {projectName || "Unknown Project"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                task.priority,
              )}`}
            >
              {task.priority}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                task.status,
              )}`}
            >
              {task.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}