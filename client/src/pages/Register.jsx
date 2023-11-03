import React, { useState } from 'react';
import Container from '../components/Container';
import useApi from '../hooks/useApi';

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const { data, request } = useApi({
        url: "/register",
        method: "POST",
        body: {
            username,
            password,
        }
    })

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        await request();
        if (data) {
            setMessage(data.message);
        }
    }
    return (
        <Container>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" required onChange={(e => setUsername(e.target.value))}/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" required onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                <button>Register</button>
                <p>{message ? message : null}</p>
            </form>
        </Container>
    )
}