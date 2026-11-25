import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ComponentType } from "react";
import ServerError from "../shared/pages/ServerError";
import AppLayout from "../shared/layout/AppLayout";
import Loader from "../shared/components/feedback/Loader";

// Turns a dynamic import into a lazy-loaded route
const page = (load: () => Promise<{ default: ComponentType }>) => ({
  lazy: async () => ({ Component: (await load()).default }),
});

const router = createBrowserRouter([
  {
    errorElement: <ServerError />,
    hydrateFallbackElement: <Loader fullPage />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },

      // Auth
      {
        path: "/login",
        ...page(() => import("../features/auth/pages/LoginPage")),
      },
      {
        path: "/forgot-password",
        ...page(() => import("../features/auth/pages/ForgotPasswordPage")),
      },
      {
        path: "/reset-password/:token",
        ...page(() => import("../features/auth/pages/ResetPasswordPage")),
      },

      // End-user
      {
        path: "/user",
        element: <AppLayout role="user" />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          {
            path: "dashboard",
            ...page(() => import("../features/end-user/pages/Dashboard")),
          },
        ],
      },

      // Zone admin
      {
        path: "/zone",
        element: <AppLayout role="zone" />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          {
            path: "dashboard",
            ...page(() => import("../features/zone/pages/ZoneDashboard")),
          },
          {
            path: "meters",
            ...page(() => import("../features/zone/pages/MeterManagement")),
          },
          {
            path: "meters/:meterId",
            ...page(() => import("../features/zone/pages/MeterDetails")),
          },
          {
            path: "users",
            ...page(() => import("../features/zone/pages/UserManagement")),
          },
          {
            path: "reports",
            ...page(() => import("../features/zone/pages/Reports")),
          },
          {
            path: "alerts",
            ...page(() => import("../features/zone/pages/Alerts")),
          },
          {
            path: "settings",
            ...page(() => import("../features/zone/pages/Settings")),
          },
        ],
      },

      // Enterprise
      {
        path: "/enterprise",
        element: <AppLayout role="enterprise" />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          {
            path: "dashboard",
            ...page(
              () => import("../features/enterprise/pages/EnterpriseDashboard"),
            ),
          },
        ],
      },

      // Unknown addresses
      { path: "*", ...page(() => import("../shared/pages/NotFound")) },
    ],
  },
]);

export default router;
