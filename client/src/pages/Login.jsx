import React, { useState } from 'react'
import Container from '../components/Container'
import useAuth from '../hooks/useAuth'

export default function Login() {

    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    const { login } = useAuth(username, password);


    return (
        <Container>
            <h2>Login</h2>
            <form>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={login}>Login</button>
                </form>
        </Container>
    )
}