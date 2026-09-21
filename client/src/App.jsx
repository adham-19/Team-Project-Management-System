import { Route, Routes } from "react-router-dom";

// LAYOUT IMPORTS
import MainLayout from "./layouts/MainLayout";

// PAGE IMPORTS
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>
    </Routes>
  );
}
export default App;
