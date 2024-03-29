import React, { useState } from 'react';
import { Container, Paper, TextField, Button, CssBaseline } from '@mui/material';
import { styled } from '@mui/system';
import LoginIcon from '@mui/icons-material/Login';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        },
        paper: {
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    };

    const StyledContainer = styled(Container)(styles.container);
    const StyledPaper = styled(Paper)(styles.paper);

    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, username, password);
            console.log("Login Success");
            navigate('/Form');
        } catch (error) {
            setError("Username does exsits or please check the password");
        }
    };

    return (
        <StyledContainer component="main" maxWidth="xl">
            <CssBaseline />
            <StyledPaper elevation={3}>
                <h1>MAA ANANDINI EDUCATION</h1>
                <form onSubmit={(e) => handleLogin(e)}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Username or Email"
                        name="username"
                        autoComplete="username"
                        required
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        required
                    />
                    <p><a href='/Signup'>SignUp</a></p>


                    <Button type="submit" fullWidth variant="contained" color="secondary" startIcon={<LoginIcon />}>
                        Login
                    </Button>


                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </StyledPaper>
        </StyledContainer>
    );
}

export default Login;