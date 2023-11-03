import React, { useState } from 'react';
import axios from 'axios';
const ServerURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:2000';
import User from '../interfaces/User';
import UserContextType from '../interfaces/UserContextType';



export default function useAuth(userContext: UserContextType) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (username: string, password: string) => {
        try {

            const response = await axios.post(ServerURL + '/log-in', {
                username,
                password
            });
            if (response.data) {
                setUser(response.data);
                userContext.setUser(response.data);
            }
            else {
                throw new Error('Login failed');
            }
        } catch (err) {
            console.error(err)
        }

    const logout = async () => {
        try {
            await axios.post(ServerURL + '/log-out');
            setUser(null);
            userContext.setUser(null);
        } catch (err) {
            console.error(err);
        }
    }

    return { user, login, logout}

    }
}
