// REACT IMPORTS
import { useEffect, useMemo, useState } from "react";

// ICONS
import {
  ArrowLeft,
  CalendarDays,
  Pencil,
  Trash2,
  Plus,
  ClipboardList,
} from "lucide-react";

// ROUTER
import { useParams, Link, useNavigate } from "react-router-dom";

// SERVICE IMPORTS
import {
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} from "../services/project.service";

import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/task.service";

import { getAllUsers } from "../services/user.service";

// COMPONENT IMPORTS
import Error from "../components/Error";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import ConfirmationModal from "../components/ConfirmationModal";

// UTILS
import { projectFields, taskFields } from "../utils/fieldsFormat";

// AUTH
import { useAuth } from "../contexts/AuthContext";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // =========================
  // PROJECT / TASK STATE
  // =========================

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [isTasksLoading, setIsTasksLoading] = useState(true);

  const [projectError, setProjectError] = useState("");
  const [tasksError, setTasksError] = useState("");

  // =========================
  // PROJECT MODAL STATE
  // =========================

  const [isEditProject, setIsEditProject] = useState(false);
  const [isDeleteProject, setIsDeleteProject] = useState(false);

  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
  });

  // =========================
  // TASK MODAL STATE
  // =========================

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [isDeleteTask, setIsDeleteTask] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Low",
    status: "To Do",
  });

  // =========================
  // MEMBERS STATE
  // =========================

  const [memberFormData, setMemberFormData] = useState({
    userId: "",
  });

  const [selectedMember, setSelectedMember] = useState(null);

  const [isAddMember, setIsAddMember] = useState(false);
  const [isRemoveMember, setIsRemoveMember] = useState(false);

  // =========================
  // SHARED MODAL STATE
  // =========================

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    const fetchData = async () => {
      setIsProjectLoading(true);
      setIsTasksLoading(true);

      setProjectError("");
      setTasksError("");

      try {
        const projectRes = await getProjectById(id);

        const [tasksRes, usersRes] = await Promise.all([
          getAllTasks({ projectId: id }),
          getAllUsers(),
        ]);

        setProject(projectRes.data.data);
        setTasks(tasksRes.data.data);
        setUsers(usersRes.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Failed to load project";

        setProjectError(message);
        setTasksError(message);
      } finally {
        setIsProjectLoading(false);
        setIsTasksLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // PROJECT OWNER
  // =========================

  const isProjectOwner = useMemo(() => {
    if (!project || !user) {
      return false;
    }

    const ownerId = project.owner?._id || project.owner;

    return String(ownerId) === String(user._id);
  }, [project, user]);

  // =========================
  // TASK MODAL FIELDS
  // =========================

  const taskModalFields = (() => {
    const assignedToField = {
      name: "assignedTo",
      label: "Assigned To",
      type: "select",
      required: true,
      options: (project?.members || []).map((member) => ({
        label: `${member.firstName} ${member.secondName} (@${member.username})`,
        value: member._id,
      })),
    };

    return [
      taskFields[0],
      taskFields[1],
      assignedToField,
      taskFields[2],
      taskFields[3],
    ];
  })(); // =========================
  // AVAILABLE MEMBERS
  // =========================

  const availableMembers = useMemo(() => {
    if (!project) {
      return [];
    }

    return users.filter((candidate) => {
      const candidateId = String(candidate._id);

      const ownerId = String(project.owner?._id || project.owner);

      const isOwner = candidateId === ownerId;

      const isAlreadyMember = (project.members || []).some(
        (member) => String(member._id || member) === candidateId,
      );

      return !isOwner && !isAlreadyMember;
    });
  }, [users, project]);

  // =========================
  // MEMBER MODAL FIELDS
  // =========================

  const memberFields = useMemo(() => {
    return [
      {
        name: "userId",
        label: "Member",
        type: "select",
        required: true,
        options: availableMembers.map((member) => ({
          label: `${member.firstName} ${member.secondName} (@${member.username})`,
          value: member._id,
        })),
      },
    ];
  }, [availableMembers]);

  // =========================
  // UTILS
  // =========================

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

  const getMemberById = (memberId) => {
    if (!memberId) {
      return null;
    }

    return (project?.members || []).find(
      (member) => String(member._id || member) === String(memberId),
    );
  };

  // =========================
  // PROJECT HANDLERS
  // =========================

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

  // =========================
  // TASK HANDLERS
  // =========================

  const handleOpenCreateTask = () => {
    setTaskFormData({
      title: "",
      description: "",
      assignedTo: project?.members?.[0]?._id || "",
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
        assignedTo: project?.members?.[0]?._id || "",
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
    const assignedToId = task.assignedTo?._id || task.assignedTo || "";

    setSelectedTask(task);

    setTaskFormData({
      title: task.title,
      description: task.description,
      assignedTo: assignedToId,
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
      const res = await updateTask(selectedTask._id, taskFormData);

      setTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? res.data.data : task,
        ),
      );

      setIsEditTask(false);
      setSelectedTask(null);
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
      setSelectedTask(null);
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // MEMBER HANDLERS
  // =========================

  const handleOpenAddMember = () => {
    setMemberFormData({
      userId: availableMembers[0]?._id || "",
    });

    setModalError("");
    setIsAddMember(true);
  };

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;

    setMemberFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setModalError("");

    try {
      const res = await addProjectMember(id, memberFormData.userId);

      setProject(res.data.data);

      setIsAddMember(false);

      setMemberFormData({
        userId: "",
      });
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenRemoveMember = (member) => {
    setSelectedMember(member);
    setModalError("");
    setIsRemoveMember(true);
  };

  const handleRemoveMember = async () => {
    setIsSubmitting(true);
    setModalError("");

    try {
      const res = await removeProjectMember(id, selectedMember._id);

      setProject(res.data.data);

      setIsRemoveMember(false);
      setSelectedMember(null);
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // LOADING / ERROR
  // =========================

  if (isProjectLoading) {
    return <Loading message="Loading Project" />;
  }

  if (projectError) {
    return <Error message={projectError} />;
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-main-bg p-6 text-text-main">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* BACK BUTTON */}
        <div className="mb-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        {/* PROJECT INFO */}
        <section className="rounded-2xl border border-border-light bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {project.name}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
                {project.description ||
                  "No description provided for this project."}
              </p>
            </div>

            {/* PROJECT ACTIONS */}
            {isProjectOwner && (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenEditProject}
                  className="inline-flex items-center gap-2 rounded-xl border border-border-light bg-surface px-4 py-2 text-sm font-semibold text-text-main hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={handleOpenDeleteProject}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-border-light pt-4 text-xs text-text-secondary">
            <CalendarDays className="h-4 w-4" />
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </section>

        {/* MEMBERS */}
        <section className="overflow-hidden rounded-2xl border border-border-light bg-surface shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border-light p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Members</h2>

              <p className="mt-1 text-xs text-text-secondary">
                People contributing to this project.
              </p>
            </div>

            {isProjectOwner && (
              <button
                type="button"
                onClick={handleOpenAddMember}
                disabled={availableMembers.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                New Member
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            {project.members?.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm font-semibold text-text-main">
                  No members yet
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  Add members to start working on this project.
                </p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    {isProjectOwner && <th>Actions</th>}
                  </tr>
                </thead>

                <tbody>
                  {project.members?.map((member) => {
                    const memberId = member._id || member;

                    const ownerId = project.owner?._id || project.owner;

                    const isOwner = String(memberId) === String(ownerId);

                    return (
                      <tr key={memberId}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-main-bg text-xs font-bold text-primary">
                              {`${member.firstName?.[0] || ""}${
                                member.secondName?.[0] || ""
                              }`.toUpperCase()}
                            </div>

                            <div>
                              <p className="font-semibold text-text-main">
                                {member.firstName
                                  ? `${member.firstName} ${member.secondName}`
                                  : "Unknown Member"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="text-text-secondary">
                            {member.username ? `@${member.username}` : "—"}
                          </span>
                        </td>

                        <td>
                          {isOwner ? (
                            <span className="inline-flex rounded-full border border-border-light bg-main-bg px-3 py-1 text-xs font-semibold text-text-secondary">
                              Owner
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
                              Member
                            </span>
                          )}
                        </td>

                        {isProjectOwner && (
                          <td>
                            {!isOwner && (
                              <button
                                type="button"
                                onClick={() => handleOpenRemoveMember(member)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-red-100 bg-red-50/60 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* TASKS */}
        <section className="overflow-hidden rounded-2xl border border-border-light bg-surface shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border-light p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Tasks</h2>

              <p className="mt-1 text-xs text-text-secondary">
                Manage tasks and track project progress.
              </p>
            </div>

            {isProjectOwner && tasks.length !== 0 && (
              <button
                type="button"
                onClick={handleOpenCreateTask}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                New Task
              </button>
            )}
          </div>

          {isTasksLoading ? (
            <Loading message="Loading Tasks" />
          ) : tasksError ? (
            <Error message={tasksError} />
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-main-bg">
                <ClipboardList className="h-6 w-6 text-text-secondary" />
              </div>

              <h3 className="text-sm font-semibold text-text-main">
                No tasks yet
              </h3>

              <p className="mt-1 max-w-sm text-xs text-text-secondary">
                Create your first task to start organizing this project.
              </p>

              {isProjectOwner && (
                <button
                  type="button"
                  onClick={handleOpenCreateTask}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </button>
              )}
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
                    {isProjectOwner && <th>Actions</th>}
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => {
                    const assignedToId =
                      task.assignedTo?._id || task.assignedTo;

                    const assignedMember = getMemberById(assignedToId);

                    return (
                      <tr key={task._id}>
                        <td>
                          <p className="font-semibold text-text-main">
                            {task.title}
                          </p>
                        </td>

                        <td>
                          <p className="max-w-sm truncate text-text-secondary">
                            {task.description}
                          </p>
                        </td>

                        <td>
                          {assignedMember ? (
                            <div>
                              <p className="font-medium text-text-main">
                                {assignedMember.firstName}{" "}
                                {assignedMember.secondName}
                              </p>

                              <p className="mt-1 text-xs text-text-secondary">
                                @{assignedMember.username}
                              </p>
                            </div>
                          ) : (
                            <span className="text-text-secondary">
                              Unknown Member
                            </span>
                          )}
                        </td>

                        <td>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityStyle(
                              task.priority,
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                              task.status,
                            )}`}
                          >
                            {task.status}
                          </span>
                        </td>

                        {isProjectOwner && (
                          <td>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditTask(task)}
                                className="rounded-lg p-2 text-text-secondary hover:bg-main-bg hover:text-primary transition-colors cursor-pointer"
                                title="Edit Task"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenDeleteTask(task)}
                                className="rounded-lg p-2 text-text-secondary hover:bg-red-50 hover:text-error transition-colors cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =========================
            MODALS
        ========================= */}

        {/* CREATE TASK */}
        {isCreateTask && (
          <Modal
            title="Create New Task"
            description="Create a new task for this project."
            fields={taskModalFields}
            setIsModalOpen={setIsCreateTask}
            handleSubmit={handleCreateTaskSubmit}
            isSubmitting={isSubmitting}
            handleInputChange={handleTaskInputChange}
            formData={taskFormData}
            submitLabel="Create Task"
            modalError={modalError}
          />
        )}

        {/* EDIT PROJECT */}
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

        {/* EDIT TASK */}
        {isEditTask && (
          <Modal
            title="Edit Task"
            description="Update the task information."
            fields={taskModalFields}
            setIsModalOpen={setIsEditTask}
            handleSubmit={handleEditTaskSubmit}
            isSubmitting={isSubmitting}
            handleInputChange={handleTaskInputChange}
            formData={taskFormData}
            submitLabel="Save Changes"
            modalError={modalError}
          />
        )}

        {/* ADD MEMBER */}
        {isAddMember && (
          <Modal
            title="Add Member"
            description="Choose a user to add to this project."
            fields={memberFields}
            setIsModalOpen={setIsAddMember}
            handleSubmit={handleAddMemberSubmit}
            isSubmitting={isSubmitting}
            handleInputChange={handleMemberInputChange}
            formData={memberFormData}
            submitLabel="Add Member"
            modalError={modalError}
          />
        )}

        {/* DELETE PROJECT */}
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

        {/* DELETE TASK */}
        {isDeleteTask && selectedTask && (
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

        {/* REMOVE MEMBER */}
        {isRemoveMember && selectedMember && (
          <ConfirmationModal
            title="Remove Member"
            description={`Are you sure you want to remove ${selectedMember.firstName} ${selectedMember.secondName} from this project?`}
            setIsModalOpen={setIsRemoveMember}
            handleConfirm={handleRemoveMember}
            isSubmitting={isSubmitting}
            confirmLabel="Remove Member"
            modalError={modalError}
          />
        )}
      </div>
    </main>
  );
}
