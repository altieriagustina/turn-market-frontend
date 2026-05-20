import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="app-root">
      <div className="app-inner">
        {/* Outlet renderiza la ruta hija: Login, ForgotPassword o SignUp */}
        <Outlet />
      </div>
    </div>
  );
}