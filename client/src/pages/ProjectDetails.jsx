// REACT IMPORTS
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Pencil,
  Trash2,
  Plus,
  ClipboardList,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

// SERVICE IMPORTS
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "../services/project.service";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/task.service";

// COMPONENT IMPORTS
import Error from "../components/Error";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import ConfirmationModal from "../components/ConfirmationModal";

// UTILS
import { projectFields, taskFields } from "../utils/fieldsFormat";

export default function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [tasksError, setTasksError] = useState("");

  const [isEditProject, setIsEditProject] = useState(false);
  const [isDeleteProject, setIsDeleteProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
  });

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [isDeleteTask, setIsDeleteTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "To Do",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  // USE EFFECT
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await getProjectById(id);
        setProject(projectRes.data.data);
      } catch (err) {
        setProjectError(err.response?.data?.message || "Something went wrong");
      } finally {
        setIsProjectLoading(false);
      }

      try {
        const tasksRes = await getAllTasks();
        const filteredTasks = tasksRes.data.data.filter((t) => {
          return t.projectId === id;
        });
        setTasks(filteredTasks);
      } catch (err) {
        setTasksError(err.response?.data?.message || "Something went wrong");
      } finally {
        setIsTasksLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // LOADING & ERROR
  if (isProjectLoading) {
    return <Loading message="Loading Project" />;
  }
  if (projectError) {
    return <Error message={projectError} />;
  }

  // UTILS
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "text-error bg-red-50";
      case "Medium":
        return "text-warning bg-amber-50";
      case "Low":
        return "text-text-secondary bg-main-bg";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "To Do":
        return "text-text-secondary bg-main-bg";
      case "In Progress":
        return "text-warning bg-amber-50";
      case "Done":
        return "text-success bg-green-50";
    }
  };

  // EVENT HANDLERS
  // Project
  const handleOpenEditProject = () => {
    setProjectFormData({
      name: project.name,
      description: project.description || "",
    });

    setModalError("");
    setIsEditProject(true);
  };
  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;

    setProjectFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditProjectSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setModalError("");

    try {
      const res = await updateProject(id, projectFormData);

      setProject(res.data.data);
      setIsEditProject(false);
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOpenDeleteProject = () => {
    setModalError("");
    setIsDeleteProject(true);
  };
  const handleDeleteProject = async () => {
    setIsSubmitting(true);
    setModalError("");

    try {
      await deleteProject(id);

      setIsDeleteProject(false);

      navigate("/projects");
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Task
  const handleOpenCreateTask = () => {
    setTaskFormData({
      title: "",
      description: "",
      priority: "Low",
      status: "To Do",
    });

    setModalError("");
    setIsCreateTask(true);
  };
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;

    setTaskFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setModalError("");

    try {
      const res = await createTask({
        ...taskFormData,
        projectId: id,
      });

      setTasks((prev) => [...prev, res.data.data]);

      setIsCreateTask(false);

      setTaskFormData({
        title: "",
        description: "",
        priority: "Low",
        status: "To Do",
      });
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOpenEditTask = (task) => {
    setSelectedTask(task);

    setTaskFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    });

    setModalError("");
    setIsEditTask(true);
  };
  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setModalError("");

    try {
      const res = await updateTask(selectedTask._id, {
        ...taskFormData,
        projectId: id,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? res.data.data : task,
        ),
      );

      setIsEditTask(false);
      setSelectedTask({});
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
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

      setTasks((prev) => prev.filter((task) => task._id !== selectedTask._id));

      setIsDeleteTask(false);
      setSelectedTask({});
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-main-bg p-6 text-text-main">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="mb-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
        {/*=== Back Button ===*/}

        {/* Project Info */}
        <div className="bg-surface border border-border-light rounded-2xl shadow-sm p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {project.name}
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-text-secondary max-w-3xl">
                {project.description ||
                  "No description provided for this project."}
              </p>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenEditProject}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border-light bg-surface text-sm font-semibold text-text-main hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleOpenDeleteProject}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
            {/*=== Actions ===*/}
          </div>
          <div className="mt-5 pt-4 border-t border-border-light flex items-center gap-2 text-xs text-text-secondary">
            <CalendarDays className="w-4 h-4" />
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
          {/*=== Header ===*/}
        </div>
        {/*=== Project Info ===*/}

        {/* Members */}
        <div className="bg-surface border border-border-light rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <div>
              <h2 className="text-lg font-bold">Members</h2>
              <p className="text-xs text-text-secondary mt-1">
                People contributing to this project.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer">
              <Plus className="w-4 h-4" />
              New Member
            </button>
          </div>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {project.members.map((m) => {
              return (
                <tr key={m._id}>
                <td>
                {m.firstName} {m.secondName}
                  </td>
                  <td>{m.username}</td>
                </tr>
              );
            })} */}
                <tr>
                  <td>member1</td>
                  <td>mem_username</td>
                  <td>
                    <button
                      type="button"

                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50/60 border border-red-100 rounded-md hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/*=== Members ===*/}

        {/* Tasks */}
        <div className="bg-surface border border-border-light rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-border-light">
            <div>
              <h2 className="text-lg font-bold">Tasks</h2>
              <p className="text-xs text-text-secondary mt-1">
                Manage tasks and track project progress.
              </p>
            </div>
            {tasks.length !== 0 && (
              <button
                onClick={handleOpenCreateTask}
                className="inline-flex items-center gap-2  px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            )}
          </div>
          {isTasksLoading ? (
            <Loading message="Loading Tasks" />
          ) : tasksError ? (
            <Error message={tasksError} />
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-main-bg flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-text-secondary" />
              </div>

              <h3 className="text-sm font-semibold text-text-main">
                No tasks yet
              </h3>

              <p className="text-xs text-text-secondary mt-1 max-w-sm">
                Create your first task to start organizing this project.
              </p>

              <button
                onClick={handleOpenCreateTask}
                className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Assigned To</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => {
                    return (
                      <tr key={t._id}>
                        <td>{t.title}</td>
                        <td>{t.description}</td>
                        <td>{t.assignedTo}</td>
                        <td>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityStyle(t.priority)}`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(t.status)}`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditTask(t)}
                              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-main-bg transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteTask(t)}
                              className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>
        {/*=== Tasks ===*/}

        {/* Modals */}
        {/* Create New Task */}
        {isCreateTask && (
          <Modal
            title="Create New Task"
            description="Create a new task for this project."
            fields={taskFields}
            setIsModalOpen={setIsCreateTask}
            handleSubmit={handleCreateTaskSubmit}
            isSubmitting={isSubmitting}
            handleInputChange={handleTaskInputChange}
            formData={taskFormData}
            submitLabel="Create Task"
            modalError={modalError}
          />
        )}
        {/*=== Create New Task ===*/}

        {/* Add New Member */}
        {/*=== Add New Member ===*/}

        {/* Edit Project */}
        {isEditProject && (
          <Modal
            title="Edit Project"
            description="Update your project information."
            fields={projectFields}
            setIsModalOpen={setIsEditProject}
            handleSubmit={handleEditProjectSubmit}
            isSubmitting={isSubmitting}
            handleInputChange={handleProjectInputChange}
            formData={projectFormData}
            submitLabel="Save Changes"
            modalError={modalError}
          />
        )}
        {/*=== Edit Project ===*/}

        {/* Edit Task */}
        {isEditTask && (
          <Modal
            title="Edit Task"
            description="Update the task information."
            fields={taskFields}
            setIsModalOpen={setIsEditTask}
            handleSubmit={handleEditTaskSubmit}
            isSubmitting={isSubmitting}
            handleInputChange={handleTaskInputChange}
            formData={taskFormData}
            submitLabel="Save Changes"
            modalError={modalError}
          />
        )}
        {/*=== Edit Task ===*/}
        {/*=== Modals ===*/}

        {/* Confirmation Modal */}
        {/* Delete Project */}
        {isDeleteProject && (
          <ConfirmationModal
            title="Delete Project"
            description={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
            setIsModalOpen={setIsDeleteProject}
            handleConfirm={handleDeleteProject}
            isSubmitting={isSubmitting}
            confirmLabel="Delete Project"
            modalError={modalError}
          />
        )}
        {/*=== Delete Project ===*/}

        {/* Delete Task */}
        {isDeleteTask && (
          <ConfirmationModal
            title="Delete Task"
            description={`Are you sure you want to delete "${selectedTask.title}"? This action cannot be undone.`}
            setIsModalOpen={setIsDeleteTask}
            handleConfirm={handleDeleteTask}
            isSubmitting={isSubmitting}
            confirmLabel="Delete Task"
            modalError={modalError}
          />
        )}
        {/*=== Delete Task ===*/}
        {/*=== Confirmation Modal ===*/}
      </div>
    </div>  );
}
