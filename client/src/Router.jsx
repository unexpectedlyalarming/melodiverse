import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import React, { useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import useSession from "./hooks/useSession";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Samples from "./pages/Samples";
import Groups from "./pages/Groups";
import About from "./pages/About";
import Sample from "./pages/Modular/Sample";
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

const queryClient = new QueryClient();

function Router() {
  const { user, setUser, loading } = useSession();
  // useEffect(() => {
  //   if (user) {
  //     setUser(user);
  //   } else {
  //     setUser(null);
  //   }
  // }, [user, setUser]);
  // const [user, setUser] = useState("full");
  // const loading = false;

  const AuthorizedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      console.log("no user" + user);
      return <Navigate to="/login" />;
    }

    return children;
  };

  const Layout = () => {
    return (
      <>
        <NavBar user={user} />
        <Outlet />
      </>
    );
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

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider value={{ user, setUser }}>
        <RouterProvider router={router} />
      </UserProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default Router;
