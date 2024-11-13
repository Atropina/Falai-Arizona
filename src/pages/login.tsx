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

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {user,login, registerSSO } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
   
    login(email, password)
    
  };

  const handleGoogleLogin = () => {
    registerSSO()
  };
  useEffect(() => {
    if (user) {
      navigate('/home'); // Redireciona para /home se o usuário já estiver logado
    }
  }, [user, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              backgroundColor: 'white',
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" color="primary" gutterBottom>
              Entrar
            </Typography>

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
                fontWeight: 600,
                py: 1.2,
              }}
              onClick={handleSubmit}
            >
              Login
            </Button>

            <Divider sx={{ my: 2 }}>ou</Divider>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                fontWeight: 500,
                ':hover': {
                  backgroundColor: theme.palette.secondary.main,
                  borderColor: theme.palette.primary.main,
                },
              }}
              onClick={handleGoogleLogin}
            >
              Login com Google
            </Button>

            <Box mt={3}>
              <Typography variant="body2">
                Não tem uma conta?{' '}
                <Link href="/register" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Registre-se
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
