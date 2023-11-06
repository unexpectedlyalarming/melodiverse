import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import React, { useEffect, useState } from 'react'
import useSession from './hooks/useSession';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Samples from './pages/Samples';
import Groups from './pages/Groups';
import About from './pages/About';
import Sample from './pages/Modular/Sample';
import Profile from './pages/Modular/Profile';



function Router() {
    const { user, setUser, loading } = useSession();
    useEffect(() => {
        if (user) {
            setUser(user);

            
        } else {
            setUser(null);


        }

    }, [user, setUser]);
    // const [user, setUser] = useState("full");
    // const loading = false;

    const Layout = () => {
        return (
            <>
            <NavBar />
            <Outlet />
            </>
        )
    }


const AuthorizedRoute = ({ children }) => {
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthorizedRoute><Layout /></AuthorizedRoute>,
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
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
    ]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <UserProvider value={{ user, setUser }}>
        <RouterProvider router={router}>
          </RouterProvider>
        </UserProvider>
    );


}

export default Router;