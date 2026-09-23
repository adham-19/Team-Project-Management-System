// REACT IMPORTS
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpRight, Plus } from "lucide-react";

// SERVICE IMPORTS
import { createProject, getAllProjects } from "../services/project.service";
import { Link } from "react-router-dom";

// COMPONENT IMPORTS
import Error from "../components/Error";
import Loading from "../components/Loading";
import Modal from "../components/Modal";

// UTILS
import { projectFields } from "../utils/fieldsFormat";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // USE MEMO
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [projects, searchQuery]);

  // USE EFFECT
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProjects();
        setProjects(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // LOADING & ERROR
  if (isLoading) {
    return <Loading message="Loading Projects" />;
  }
  if (error) {
    return <Error message={error} />;
  }

  // EVENT HANDLERS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createProject(formData);
      setProjects([...projects, res.data.data]);
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-main-bg p-6 text-text-main">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mx-auto max-w-7xl mb-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage and track your team's projects.
          </p>
        </div>
        {/*=== Title ===*/}

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* SearchBar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="project title ..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full md:w-72 rounded-xl border border-border-light bg-surface placeholder:text-text-secondary pl-10 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          {/*=== SearchBar ===*/}
          {/* Create Project Button */}
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
          {/*=== Create Project Button ===*/}
        </div>
      </div>
      {/*=== Header ===*/}

      {/* Projects */}
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Owned Projecst */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-dark-navy border-b border-border-light pb-2">
            Owned Projects
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-8 text-text-secondary bg-surface rounded-xl border border-border-light text-sm">
              No projects created yet. Click 'New Project' to get started.
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-text-secondary bg-surface rounded-xl border border-border-light text-sm">
              No projects match your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p) => (
                <Link
                  key={p._id}
                  to={`/projects/${p._id}`}
                  className="group bg-surface border border-border-light rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-45 cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-md font-bold text-text-main truncate group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-text-secondary text-xs mt-2 line-clamp-2 leading-relaxed">
                      {p.description ||
                        "There is no description for this project yet"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border-light text-[11px] text-text-secondary">
                    <div className="flex items-center gap-3">
                      <span>0 Tasks</span>
                      <span>•</span>
                      <span>0 Members</span>
                    </div>
                    <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      View Project
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/*=== Owned Projecst ===*/}

        {/* Contributed Projects */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-dark-navy border-b border-border-light pb-2">
            Contributed Projects
          </h2>
          <div className="text-center py-8 text-text-secondary bg-surface rounded-xl border border-border-light text-sm">
            You haven't been invited to any projects yet.{" "}
          </div>
        </div>
        {/*=== Contributed Projects ===*/}
      </div>
      {/*=== Projects ===*/}

      {/* Create New Project Modal */}
      {isModalOpen && (
        <Modal
          title="Create New Project"
          description="Enter details to build a new workspace for your team."
          fields={projectFields}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          handleInputChange={handleInputChange}
          formData={formData}
        />
      )}
      {/*=== Create New Project Modal ===*/}
    </div>
  );
}
