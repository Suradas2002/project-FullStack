import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
       
        if (token) {
            setLoggedIn(true);
           
            if (role === 'admin') {
                setIsAdmin(true);
            }
        }
    }, []);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/v1/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role); 
            localStorage.setItem('username', username);

            
            setLoggedIn(true);
            setIsAdmin(response.data.role === 'admin'); 
            
            
            window.location.reload();
        } catch (err) {
            console.error('Login Error:', err)
            setError('Invalid username or password');
        }
    };

    const handleAdminClick = () => {
        navigate('/adminpage');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setLoggedIn(false);
        setIsAdmin(false);

        window.location.reload();
    };

    return (
        <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {!loggedIn ? (
                <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Typography variant="h4" gutterBottom>Login</Typography>
                    
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                    />

                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Login
                    </Button>

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" gutterBottom>ล็อคอินสำเร็จแล้ว</Typography>
                    {isAdmin && (
                        <Button onClick={handleAdminClick} variant="contained" color="secondary" sx={{ mt: 2 }}>
                            Go to Admin
                        </Button>
                    )}
                    <Button onClick={handleLogout} variant="outlined" color="primary" sx={{ mt: 2 }}>
                        Logout
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default Login;
