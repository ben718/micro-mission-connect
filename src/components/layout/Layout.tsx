import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { useAuth } from "@/hooks/useAuth";

const Layout = () => {
  const { profile } = useAuth();
  const isAssociation = profile?.type === "organization";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navigation latérale */}
      <div className="w-64 flex-shrink-0">
        <Navigation />
      </div>

      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        <div className={isAssociation ? "bg-white" : ""}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 