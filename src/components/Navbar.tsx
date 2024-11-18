import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Button, IconButton, Drawer, List, ListItem, ListItemText, Divider, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/rubik-mono-one';
import { useAuth } from '../services/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6400', // cor de destaque para a navbar
    },
    text: {
      primary: '#333333', // cor do texto
    },
  },
  typography: {
    fontFamily: 'Rubik Mono One, Arial, sans-serif',
  },
});

const NavBar = () => {
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.name || null);
        }
      }
    };

    fetchUserName();
  }, [user]);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'space-between', position: 'relative' }}>
          {isMobile && (
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{ position: 'absolute', right: 16, color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Título "Fal.AI" centralizado no mobile e alinhado à esquerda no desktop */}
          <Typography variant="h6" sx={{ color: 'text.primary', fontFamily: 'Rubik Mono One' }}>
            Fal.AI
          </Typography>

          {!isMobile && (
            <Box display="flex" alignItems="center">
              {user && (
                <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
                  {user.photoURL && <Avatar src={user.photoURL} alt={user.displayName || 'User'} sx={{ mr: 1 }} />}
                  <Typography color="text.primary">{userName || user.displayName || user.email || 'Usuário'}</Typography>
                </Box>
              )}
              <Button variant="outlined" onClick={logout} sx={{ color: 'white', borderColor: 'white' }}>
                Sair
              </Button>
            </Box>
          )}

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{ sx: { bgcolor: "white", width: 250 } }} // Consistência na cor e tamanho do Drawer
          >
            <Box sx={{ p: 2 }}>
              <IconButton onClick={toggleDrawer(false)} sx={{ m: 2 }}>
                <CloseIcon />
              </IconButton>
              <Divider />
              <List>
                {user && (
                  <ListItem>
                    <Box display="flex" alignItems="center">
                      {user.photoURL && <Avatar src={user.photoURL} alt={user.displayName || 'User'} sx={{ mr: 2 }} />}
                      <ListItemText primary={userName || user.displayName || user.email || 'Usuário'} />
                    </Box>
                  </ListItem>
                )}
                <Divider />
                <ListItem onClick={logout}>
                  <ListItemText primary="Sair" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default NavBar;
