import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, ClipboardList, Filter } from "lucide-react";

import { getAllTasks, deleteTask } from "../services/task.service";
import { getAllProjects } from "../services/project.service";

import Loading from "../components/Loading";
import Error from "../components/Error";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleteTask, setIsDeleteTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // FILTERS
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setPageError("");

      try {
        const [tasksRes, projectsRes] = await Promise.all([
          getAllTasks(),
          getAllProjects(),
        ]);

        setTasks(tasksRes.data.data);
        setProjects(projectsRes.data.data);
      } catch (err) {
        setPageError(
          err.response?.data?.message || "Failed to load tasks",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert projects array into an object for quick lookup
  const projectsMap = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc[project._id] = project;
      return acc;
    }, {});
  }, [projects]);

  // FILTERED TASKS
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        !statusFilter || task.status === statusFilter;

      const matchesPriority =
        !priorityFilter || task.priority === priorityFilter;

      const matchesProject =
        !projectFilter || task.projectId === projectFilter;

      return matchesStatus && matchesPriority && matchesProject;
    });
  }, [tasks, statusFilter, priorityFilter, projectFilter]);

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

  const handleOpenDeleteTask = (task) => {
    setSelectedTask(task);
    setModalError("");
    setIsDeleteTask(true);
  };

  const handleDeleteTask = async () => {
    setIsSubmitting(true);
    setModalError("");

    try {
      await deleteTask(selectedTask._id);

      setTasks((prev) =>
        prev.filter((task) => task._id !== selectedTask._id),
      );

      setIsDeleteTask(false);
      setSelectedTask(null);
    } catch (err) {
      setModalError(
        err.response?.data?.message || "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setProjectFilter("");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (pageError) {
    return <Error message={pageError} />;
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-main-bg px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-main">
            My Tasks
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            View and manage your assigned tasks
          </p>
        </div>

        {/* FILTERS */}
        <section className="mb-6 rounded-2xl border border-border-light bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-text-secondary" />

              <h2 className="text-sm font-semibold text-text-main">
                Filters
              </h2>
            </div>

            {(statusFilter || priorityFilter || projectFilter) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* STATUS */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-main">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-border-light bg-main-bg px-4 py-2.5 text-sm text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* PRIORITY */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-main">
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full rounded-xl border border-border-light bg-main-bg px-4 py-2.5 text-sm text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* PROJECT */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-main">
                Project
              </label>

              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full rounded-xl border border-border-light bg-main-bg px-4 py-2.5 text-sm text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">All Projects</option>

                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* TASKS CARD */}
        <section className="overflow-hidden rounded-2xl border border-border-light bg-surface shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-main-bg">
                <ClipboardList className="h-7 w-7 text-text-secondary" />
              </div>

              <h2 className="text-lg font-semibold text-text-main">
                No tasks found
              </h2>

              <p className="mt-1 max-w-sm text-sm text-text-secondary">
                {tasks.length === 0
                  ? "You don't have any tasks available right now."
                  : "No tasks match the selected filters."}
              </p>

              {tasks.length > 0 &&
                (statusFilter || priorityFilter || projectFilter) && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
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
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.map((task) => {
                    const project = projectsMap[task.projectId];

                    return (
                      <tr key={task._id}>
                        {/* TASK */}
                        <td>
                          <div>
                            <p className="font-semibold text-text-main">
                              {task.title}
                            </p>

                            <p className="mt-1 max-w-md truncate text-xs text-text-secondary">
                              {task.description}
                            </p>
                          </div>
                        </td>

                        {/* PROJECT */}
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

                        {/* PRIORITY */}
                        <td>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                              task.priority,
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              task.status,
                            )}`}
                          >
                            {task.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td>
                          <div className="flex items-center gap-2">
                            <Link
                              to={
                                project
                                  ? `/projects/${project._id}`
                                  : "#"
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-main-bg hover:text-primary transition-colors"
                              title="Edit Task"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenDeleteTask(task)
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-red-50 hover:text-error transition-colors cursor-pointer"
                              title="Delete Task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* DELETE TASK MODAL */}
      {isDeleteTask && selectedTask && (
        <ConfirmationModal
          title="Delete Task"
          description={`Are you sure you want to delete "${selectedTask.title}"? This action cannot be undone.`}
          setIsModalOpen={setIsDeleteTask}
          handleConfirm={handleDeleteTask}
          isSubmitting={isSubmitting}
          modalError={modalError}
        />
      )}
    </main>
  );
}