import { useEffect, useMemo, useState } from "react";
import { ClipboardList, FolderKanban, Users } from "lucide-react";

import { getAllTasks } from "../services/task.service";
import { getAllProjects } from "../services/project.service";

import Loading from "../components/Loading";
import Error from "../components/Error";

import DashboardCard from "../components/Dashboard/DashboardCard";
import DashboardHighlight from "../components/Dashboard/DashboardHighlight";
import DashboardTasks from "../components/Dashboard/DashboardTasks";
import DashboardProjects from "../components/Dashboard/DashboardProjects";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
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
          err.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // PROJECT LOOKUP
  const projectsMap = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc[project._id] = project;
      return acc;
    }, {});
  }, [projects]);

  // TOP PRIORITY PENDING TASK
  const priorityTask = useMemo(() => {
    const priorityOrder = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    return [...tasks]
      .filter((task) => task.status !== "Done")
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])[0];
  }, [tasks]);

  // TOP 3 TASKS
  const latestTasks = useMemo(() => {
    return tasks.slice(0, 3);
  }, [tasks]);

  // TOP 3 PROJECTS BY MEMBERS
  const topProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0))
      .slice(0, 3);
  }, [projects]);

  // LEVEL 1 FALLBACK:
  // Real "joined projects" count will be based on
  // the current authenticated user in Level 2.
  const joinedProjectsCount = useMemo(() => {
    return projects.filter((project) => project.members?.length > 0).length;
  }, [projects]);

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
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-text-main">Dashboard</h1>

          <p className="mt-1 text-sm text-text-secondary">
            Here's an overview of your projects and tasks
          </p>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="My Tasks"
            value={tasks.length}
            icon={ClipboardList}
            description="Tasks assigned to you"
          />

          <DashboardCard
            title="My Projects"
            value={projects.length}
            icon={FolderKanban}
            description="Projects you created"
          />

          <DashboardCard
            title="Joined Projects"
            value={joinedProjectsCount}
            icon={Users}
            description="Projects you're a member of"
          />
        </div>

        {/* HIGHLIGHT */}
        <div className="mt-6">
          <DashboardHighlight
            task={priorityTask}
            projectName={
              priorityTask ? projectsMap[priorityTask.projectId]?.name : ""
            }
          />
        </div>

        {/* TASKS + PROJECTS */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DashboardTasks tasks={latestTasks} projectsMap={projectsMap} />

          <DashboardProjects projects={topProjects} />
        </div>
      </div>
    </main>
  );
}
