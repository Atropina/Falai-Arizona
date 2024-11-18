import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
  where,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";

interface ChatBoxProps {
  chatName: string;
  chatWith: string;
  currentUser: string;
  userPhotoUrl?: string;
}

interface Message {
  id: string;
  text?: string;
  sender: string;
  receiver: string;
  timestamp: number;
  type: "text" | "media";
  mediaUrl?: string;
  mediaType?: string;
}

let typingTimeout: NodeJS.Timeout | null = null;

const ChatBox: React.FC<ChatBoxProps> = ({ chatName, chatWith, currentUser, userPhotoUrl }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isPageVisible = useRef<boolean>(true);

 

  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisible.current = !document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Message, "id">;
        return {
          id: doc.id,
          ...data,
        };
      });

      const filteredMessages = loadedMessages.filter(
        (msg) =>
          (msg.sender === currentUser && msg.receiver === chatWith) ||
          (msg.sender === chatWith && msg.receiver === currentUser)
      );

      setMessages((prevMessages) => {
        if (filteredMessages.length !== prevMessages.length) {
          return filteredMessages;
        }
        return prevMessages;
      });

      if (!isPageVisible.current && filteredMessages.length > messages.length) {
        const latestMessage = filteredMessages[filteredMessages.length - 1];
        if (latestMessage.sender === chatWith && latestMessage.text) {
          sendNotification(latestMessage.text);
        }
      }
    });

    return () => unsubscribe();
  }, [chatWith, currentUser]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn("Permissão para notificações não concedida.");
        }
      });
    }
  }, []);

  useEffect(() => {
    const chatRef = doc(db, "chats", `${chatWith}_${currentUser}`);
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists() && snapshot.data().typing) {
        setIsTyping(snapshot.data().typing);
      } else {
        setIsTyping(false);
      }
    });
    return () => unsubscribe();
  }, [chatWith, currentUser]);

  const handleTyping = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const chatRef = doc(db, "chats", `${currentUser}_${chatWith}`);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, { typing: true });
    } else {
      await updateDoc(chatRef, { typing: true });
    }

    typingTimeout = setTimeout(async () => {
      await updateDoc(chatRef, { typing: false });
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const message = {
      text: input,
      sender: currentUser,
      receiver: chatWith,
      timestamp: Date.now(),
      type: "text",
    };

    await addDoc(collection(db, "messages"), message);
    setInput("");

    const chatRef = doc(db, "chats", `${currentUser}_${chatWith}`);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    await updateDoc(chatRef, { typing: false });
  };

  const handleDeleteMessage = async () => {
    if (messageToDelete) {
      await deleteDoc(doc(db, "messages", messageToDelete));
      setMessageToDelete(null);
    }
  };

  const handleDeleteChat = async () => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Você tem certeza que deseja apagar toda a conversa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, apagar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("sender", "in", [currentUser, chatWith]), where("receiver", "in", [currentUser, chatWith]));

        const snapshot = await getDocs(q);
        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        Swal.fire("Conversa apagada!", "Todas as mensagens foram removidas.", "success");
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_URL, formData);

      const { secure_url } = response.data;
      const message: Message = {
        sender: currentUser,
        receiver: chatWith,
        timestamp: Date.now(),
        type: "media",
        mediaUrl: secure_url,
        mediaType: file.type,
        id: ""
      };
      await addDoc(collection(db, "messages"), message);
      setIsUploading(false);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const sendNotification = (message: string) => {
    if (Notification.permission === "granted") {
      new Notification(`Nova mensagem de ${chatName}`, {
        body: message,
      });
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, messageId: string) => {
    setAnchorEl(event.currentTarget);
    setMessageToDelete(messageId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMessageToDelete(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "93vh" }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Box sx={{ bgcolor: "white", p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={userPhotoUrl || ""} sx={{ mr: 2 }} />
          <Typography variant="h6">{chatName}</Typography>
        </Box>

        <Tooltip title="Apagar conversa" arrow>
          <IconButton onClick={handleDeleteChat} color="error" sx={{ ml: 2 }}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#f9f9f9", padding: 2 }}>
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: msg.sender === currentUser ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  maxWidth: "80%",
                  minWidth: "120px",
                  bgcolor: msg.sender === currentUser ? "#FF6F00" : "#0077FF",
                  p: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                  position: "relative",
                  color: "white",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.type === "text" ? (
                  <ListItemText primary={msg.text} />
                ) : (
                  <>
                    {msg.mediaType?.startsWith("image/") ? (
                      <img src={msg.mediaUrl || ""} alt="media" style={{ maxWidth: "100%", borderRadius: 4 }} />
                    ) : (
                      <a href={msg.mediaUrl || ""} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
                        Arquivo enviado
                      </a>
                    )}
                  </>
                )}
                <Typography variant="caption" sx={{ color: "white", display: "block", marginTop: 0.5 }}>
                  {formatTimestamp(msg.timestamp)}
                </Typography>

                {msg.sender === currentUser && (
                  <IconButton
                    onClick={(e) => handleMenuClick(e, msg.id)}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: -5,
                      right: 5,
                      color: "white",
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </ListItem>
          ))}
          {isTyping && (
            <ListItem sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Typography variant="body2" sx={{ fontStyle: "italic", color: "#555" }}>
                {chatName} está digitando...
              </Typography>
            </ListItem>
          )}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderTop: "1px solid #ccc",
          bgcolor: "white",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <input
          type="file"
          style={{ display: "none" }}
          id="file-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <IconButton color="primary" component="span">
            <AttachFileIcon />
          </IconButton>
        </label>

        <TextField
          fullWidth
          placeholder="Digite uma mensagem..."
          value={input}
          onChange={handleTyping}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        {isUploading ? (
          <CircularProgress size={24} sx={{ ml: 1 }} />
        ) : (
          <IconButton onClick={handleSendMessage} color="primary" sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        )}
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleDeleteMessage}>Deletar mensagem</MenuItem>
      </Menu>
    </Box>
  );
};

export default ChatBox;
