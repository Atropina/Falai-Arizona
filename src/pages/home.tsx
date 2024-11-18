import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Badge,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ChatBox from "../components/ChatBox";
import NavBar from "../components/Navbar";
import { collection, getDocs, onSnapshot, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
  unreadMessages: number;
}

const Home: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const userLocal = sessionStorage.getItem("uid");
  const currentUser = userLocal ?? "";

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsRef = collection(db, "users");
        const snapshot = await getDocs(contactsRef);
        const loadedContacts = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            online: false,
            unreadMessages: 0, // Inicializa com 0 mensagens não lidas
          }))
          .filter((contact) => contact.id !== currentUser) as Contact[];

        setContacts(loadedContacts);

        loadedContacts.forEach((contact) => {
          const userDocRef = doc(db, "users", contact.id);
          onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              setContacts((prevContacts) =>
                prevContacts.map((c) =>
                  c.id === contact.id ? { ...c, online: docSnap.data().online } : c
                )
              );
            }
          });

          // Contador de mensagens não lidas
          const messagesRef = collection(db, "messages");
          const q = query(messagesRef, where("receiver", "==", currentUser), where("sender", "==", contact.id));
          onSnapshot(q, (querySnapshot) => {
            const unreadMessagesCount = querySnapshot.docs.filter(doc => !doc.data().read).length;

            setContacts((prevContacts) =>
              prevContacts.map((c) =>
                c.id === contact.id ? { ...c, unreadMessages: unreadMessagesCount } : c
              )
            );
          });
        });
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
      }
    };

    fetchContacts();
  }, [currentUser]);

  useEffect(() => {
    const updateStatus = async (status: boolean) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser);
        await updateDoc(userRef, { online: status });
      }
    };

    updateStatus(true);

    return () => {
      updateStatus(false);
    };
  }, [currentUser]);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setDrawerOpen(false);

    // Marcar mensagens como lidas ao selecionar o contato
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("receiver", "==", currentUser), where("sender", "==", contact.id));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((messageDoc) => {
        updateDoc(messageDoc.ref, { read: true });
      });
    });
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />

      {/* Ícone do Menu para Mobile */}
      {isMobile && (
        <IconButton
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300, color: "white" }}
          onClick={() => toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Corpo do layout */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => toggleDrawer(false)}
          PaperProps={{ sx: { width: 300 } }}
        >
          <Typography variant="h6" color="primary" sx={{ p: 2 }}>
            Contatos
          </Typography>
          <List>
            {contacts.map((contact) => (
              <React.Fragment key={contact.id}>
                <ListItem
                  onClick={() => handleContactClick(contact)}
                  sx={{
                    bgcolor: selectedContact?.id === contact.id ? "primary.light" : "white",
                    "&:hover": { bgcolor: "primary.light" },
                    cursor: "pointer",
                  }}
                >
                  <Badge
                    color={contact.online ? "success" : "default"}
                    variant="dot"
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar src={contact.avatar} sx={{ mr: 2 }} />
                  </Badge>
                  <ListItemText
                    primary={contact.name}
                    secondary={contact.email}
                    sx={{ display: "flex", alignItems: "center" }}
                  />
                  {contact.unreadMessages > 0 && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ ml: 2 }}
                    >
                      {contact.unreadMessages}
                    </Typography>
                  )}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Drawer>

        {/* Lista de contatos para Desktop */}
        <Box
          sx={{
            width: { xs: "0", md: "25%" },
            maxWidth: "300px",
            bgcolor: "white",
            boxShadow: 2,
            overflowY: "auto",
            display: { xs: "none", md: "block" },
          }}
        >
          <Typography variant="h6" color="primary" sx={{ p: 2 }}>
            Contatos
          </Typography>
          <List>
            {contacts.map((contact) => (
              <React.Fragment key={contact.id}>
                <ListItem
                  onClick={() => handleContactClick(contact)}
                  sx={{
                    bgcolor: selectedContact?.id === contact.id ? "primary.light" : "white",
                    "&:hover": { bgcolor: "primary.light" },
                    cursor: "pointer",
                  }}
                >
              <Badge
                    color={contact.online ? "success" : "default"}
                    variant="dot"
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar src={contact.avatar} sx={{ mr: 2 }} 
                    />
                        </Badge>
                  
                  <ListItemText
                    primary={contact.name}
                   
                    sx={{ display: "flex", alignItems: "center" }}
                  />
                  {contact.unreadMessages > 0 && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ ml: 2 }}
                    >
                      {contact.unreadMessages}
                    </Typography>
                  )}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Conteúdo principal do chat */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#F5F5F5",
            overflowY: "auto",
          }}
        >
          {selectedContact ? (
            <ChatBox
              chatName={selectedContact.name}
              chatWith={selectedContact.id}
              currentUser={currentUser}
              userPhotoUrl={selectedContact.avatar}
            />
          ) : (
            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
              sx={{ mt: 4 }}
            >
              Selecione um contato para começar a conversar.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
