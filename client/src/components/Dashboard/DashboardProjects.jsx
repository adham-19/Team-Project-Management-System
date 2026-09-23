import { Link } from "react-router-dom";
import { ArrowRight, FolderKanban, Users } from "lucide-react";

export default function DashboardProjects({ projects }) {
  return (
    <section className="rounded-2xl border border-border-light bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-text-main">
            My Projects
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Your projects with the most members
          </p>
        </div>

        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center px-5 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-main-bg">
            <FolderKanban className="h-6 w-6 text-text-secondary" />
          </div>

          <p className="text-sm font-semibold text-text-main">
            No projects found
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            You don't have any projects available right now.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border-light">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-main-bg/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main-bg">
                  <FolderKanban className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-main">
                    {project.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-text-secondary">
                    {project.description || "No description available"}
                  </p>
                </div>
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-secondary">
                <Users className="h-3.5 w-3.5" />

                {project.members?.length || 0}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}