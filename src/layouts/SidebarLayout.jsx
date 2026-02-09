// src/layouts/SidebarLayout.jsx
import React from "react";
import Sidebar from "../components/Shared/SideBar";
import { Outlet } from "react-router-dom";

const SidebarLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6">
        {/* Soporta rutas anidadas y contenido inyectado como children */}
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default SidebarLayout;
