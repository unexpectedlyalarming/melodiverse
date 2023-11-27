import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Samples from "./pages/Samples";
import Groups from "./pages/Groups";
import About from "./pages/About";
import Sample from "./pages/Modular/Sample";
import EditSample from "./components/EditSample";
import Profile from "./pages/Modular/Profile";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./components/Dashboard/DashboardHome";
import DashboardGenres from "./components/Dashboard/Genres";
import DashboardUsers from "./components/Dashboard/Users";
import DashboardGroups from "./components/Dashboard/Groups";
import DashboardIssues from "./components/Dashboard/Issues";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardAlerts from "./components/Dashboard/Alerts";
import Inbox from "./pages/Inbox";
import axios from "axios";
import ServerURL from "./variables/URLs";
import { UserProvider } from "./contexts/UserContext";

const queryClient = new QueryClient();

export default function Router() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (user) {
  //     setUser(user);
  //   } else {
  //     setUser(null);
  //   }
  // }, [user, setUser]);
  // const [user, setUser] = useState("full");
  // const loading = false;

  const Layout = () => {
    return (
      <>
        <NavBar />
        <Outlet />
      </>
    );
  };

  useEffect(() => {
    async function checkExistingUserSession() {
      try {
        console.log("checking user session");
        const response = await axios.get(ServerURL + "/auth/validate-session", {
          withCredentials: true,
        });
        if (!response.data || response.data instanceof Error) {
          console.log("no user");
          setUser(null);
        }
        if (response.data && response.status === 200) {
          console.log("user found");
          setUser(response.data);
        }
        setLoading(false);
      } catch (err) {
        setUser(null);
        setLoading(false);
      }
    }
    checkExistingUserSession();
  }, []);

  const AuthorizedRoute = ({ children }) => {
    if (!user) {
      console.log("no user" + user);
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthorizedRoute>
          <Layout />
        </AuthorizedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/samples",
          element: <Samples />,
        },
        {
          path: "/groups",
          element: <Groups />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/sample/:id",
          element: <Sample />,
        },
        {
          path: "/sample/edit/:id",
          element: <EditSample />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/inbox",
          element: <Inbox />,
        },

        //Sample packs, messages, alerts
      ],
    },
    {
      path: "/dashboard",
      element: (
        <AuthorizedRoute>
          <Dashboard />
        </AuthorizedRoute>
      ),
      children: [
        {
          path: "",
          element: <DashboardHome />,
        },
        {
          path: "genres",
          element: <DashboardGenres />,
        },
        {
          path: "users",
          element: <DashboardUsers />,
        },
        {
          path: "groups",
          element: <DashboardGroups />,
        },
        {
          path: "issues",
          element: <DashboardIssues />,
        },
        {
          path: "alerts",
          element: <DashboardAlerts />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  if (loading) return <p>Loading...</p>;

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider value={{ user, setUser }}>
        <RouterProvider router={router} />
      </UserProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
