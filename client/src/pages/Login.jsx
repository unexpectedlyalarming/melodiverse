import React, { useState } from 'react'
import Container from '../components/Container'
import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom';
export default function Login() {

    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    const { login } = useAuth(username, password);


    return (
        <Container>
            <h2>Login</h2>
            <form onSubmit={(e) => { e.preventDefault; login;}}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                <button >Login</button>
                </form>
                <Link to="/register">Register</Link>

        </Container>
    )
}