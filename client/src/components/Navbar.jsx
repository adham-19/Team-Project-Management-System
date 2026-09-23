// REACT IMPORTS
import { NavLink } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-dark-navy border-b border-border-light">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto ">
        {/* Logo */}
        <h1 className="text-primary font-bold text-2xl">TPMS</h1>
        {/*=== Logo ===*/}
        {/* Links */}
        <div className="hidden md:flex items-center gap-2 ">
          <NavLink
            to="/"
            className={({ isActive }) => `
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-surface text-primary font-semibold"
                  : "text-text-secondary hover:text-primary hover:bg-surface/10"
              }`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => `
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-surface text-primary font-semibold"
                  : "text-text-secondary hover:text-primary hover:bg-surface/10"
              }`}
          >
            Projects
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) => `
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-surface text-primary font-semibold"
                  : "text-text-secondary hover:text-primary hover:bg-surface/10"
              }`}
          >
            My Tasks
          </NavLink>
        </div>
        {/*=== Links ===*/}

        {/* Actions */}
        <div className="hidden md:flex items-center  gap-6 text-text-secondary">
          <NavLink
            to="/Profile"
            className={({ isActive }) => `
              w-9 h-9 rounded-full border-2 border-border-light flex items-center justify-center transition-colors hover:border-primary
              ${
                isActive
                  ? "text-primary font-bold bg-surface border-primary"
                  : "text-text-secondary hover:text-primary  bg-dark-navy hover:bg-surface/10 "
              }`}
          >
            <User className="w-5 h-5" />
          </NavLink>
          <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
        {/*=== Actions ===*/}

        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-text-secondary hover:text-primary cursor-pointer p-1"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {/*=== Menu Button ===*/}
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden bg-dark-navy px-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-96 opacity-100 py-4"
            : "max-h-0 opacity-0 py-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-2">
          <NavLink
            to="/"
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `w-full px-4 py-2.5 rounded-lg text-base font-medium transition-all block ${
                isActive
                  ? "bg-surface text-primary"
                  : "text-text-secondary hover:text-primary hover:bg-surface/50"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/projects"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `w-full px-4 py-2.5 rounded-lg text-base font-medium transition-all block ${
                isActive
                  ? "bg-surface text-primary"
                  : "text-text-secondary hover:text-primary hover:bg-surface/50"
              }`
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `w-full px-4 py-2.5 rounded-lg text-base font-medium transition-all block ${
                isActive
                  ? "bg-surface text-primary"
                  : "text-text-secondary hover:text-primary hover:bg-surface/50"
              }`
            }
          >
            My Tasks
          </NavLink>
        </div>
        <hr className="border-border-light" />
        <div className="flex items-center justify-between w-full pt-2">
          <NavLink
            to="/Profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors
              ${isActive ? "border-primary text-primary bg-surface" : "border-border-light text-text-secondary bg-dark-navy"}`}
          >
            <User className="w-5 h-5" />
          </NavLink>

          <button className="flex items-center gap-2 text-text-secondary hover:text-primary cursor-pointer px-3 py-2 rounded-lg hover:bg-surface/50 transition-colors text-base font-medium">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
      {/*=== Mobile Dropdown ===*/}
    </div>
  );
}
