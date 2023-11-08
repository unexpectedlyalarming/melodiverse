import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import React, { useEffect, useState } from "react";
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
  console.log(user);

  const AuthorizedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (loading || !user) {
      return <div>Loading...</div>;
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
    <UserProvider value={{ user, setUser }}>
      <RouterProvider router={router}></RouterProvider>
    </UserProvider>
  );
}

export default Router;
