import React from 'react';
import Container from '../components/Container';
import useApi from '../hooks/useApi';

export default function Register() {

    const { data, request } = useApi({
        url: "/register",
        method: "POST",
        body: {
            username: e.target.username.value,
            password: e.target.password.value,
        }
    })

    async function handleSubmit(e) {
        e.preventDefault();
        await request();


    }
    return (
        <Container>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" required/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" required />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" required/>
                <button>Register</button>
            </form>
        </Container>
    )
}