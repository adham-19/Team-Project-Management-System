import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";

export default function DashboardTasks({
  tasks,
  projectsMap,
}) {
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
    <section className="rounded-2xl border border-border-light bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-text-main">
            My Tasks
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Your latest tasks
          </p>
        </div>

        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center px-5 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-main-bg">
            <ClipboardList className="h-6 w-6 text-text-secondary" />
          </div>

          <p className="text-sm font-semibold text-text-main">
            No tasks found
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            You don't have any tasks available right now.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => {
                const project = projectsMap[task.projectId];

                return (
                  <tr key={task._id}>
                    <td>
                      <p className="font-semibold text-text-main">
                        {task.title}
                      </p>

                      <p className="mt-1 max-w-sm truncate text-xs text-text-secondary">
                        {task.description}
                      </p>
                    </td>

                    <td>
                      {project ? (
                        <Link
                          to={`/projects/${project._id}`}
                          className="font-medium text-text-main hover:text-primary transition-colors"
                        >
                          {project.name}
                        </Link>
                      ) : (
                        <span className="text-text-secondary">
                          Unknown Project
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          task.status,
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}               