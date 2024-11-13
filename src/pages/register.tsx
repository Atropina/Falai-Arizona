import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { Navigate, redirect, Router, Routes, useNavigate } from 'react-router-dom';
import Home from './home';
import { useAuth } from '../services/auth';
import { Email, Password } from '@mui/icons-material';

// Definindo a paleta de cores
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6400', // cor destaque
    },
    secondary: {
      main: '#A0C4FF', // azul claro para fundo e acentos sutis
    },
    background: {
      default: '#E5E5E5', // fundo neutro claro
    },
    text: {
      primary: '#333333', // cor do texto principal
      secondary: '#0064FF', // link e detalhes
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});



const Register: React.FC = () => {
  const navigate = useNavigate()
  const [ password, setPassword] = useState('')
  const [ username, setUsername] = useState('')
  const [ email, setEmail] = useState('')
  const {user, registerSSO, register } = useAuth()
  useEffect(() => {
    if (user) {
      navigate('/home'); // Redireciona para /home se o usuário já estiver logado
    }
  }, [user, navigate]);
  const handleRegister = () =>{
    register(username,email, password)


  }

  const handleRegisterSSO = () =>{
    registerSSO()
  }
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.default', // Aplicando a cor de fundo aqui
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              backgroundColor: 'white', // Caixa branca para contraste com fundo cinza
              p: 4,
              borderRadius: 3,
              boxShadow: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" color="primary" gutterBottom>
              Registrar
            </Typography>


            <TextField
              label="Nome Completo"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
             
            />
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
           
            />
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
          
            />
            <Button
              onClick={handleRegister}
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
                fontWeight: 600,
                paddingY: 1.2,
              }}
            >
              Registrar
            </Button>

            <Divider sx={{ my: 2 }}>ou</Divider>

            <Button
              onClick={handleRegisterSSO}
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{
                mt: 2,
                borderColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                fontWeight: 500,
                ':hover': {
                  backgroundColor: theme.palette.secondary.main,
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              Registrar com Google
            </Button>

            <Box mt={3}>
              <Typography variant="body2">
                Já tem uma conta?{' '}
                <Link href="/login" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
