import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export interface Message {
  id: string;
  text: string;
  sender: string;
  receiver: string;
  timestamp: number;
  type: "text" | "media";
  mediaUrl?: string;
}

export const useMessages = (chatWith: string, currentUser: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [seenMessages, setSeenMessages] = useState<Set<string>>(new Set()); 
  const [avatar, setAvatar] = useState<string | null>(null);

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
    if (!chatWith || !currentUser) return; // Não inicia sem valores válidos

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("sender", "in", [currentUser, chatWith]),
      where("receiver", "in", [currentUser, chatWith]),
      orderBy("timestamp", "asc")
    );
    const fetchUserAvatar = async (chatWith: string): Promise<string | null> => {
      try {
        // Cria a referência para o documento do usuário
        const userDocRef = doc(db, "users", chatWith);
        
        // Obtém o documento
        const userDoc = await getDoc(userDocRef);
    
        if (userDoc.exists()) {
          // Retorna o campo 'avatar' se o documento existir
          const userData = userDoc.data();
          return userData.avatar || null;
        } else {
          console.error("Usuário não encontrado no Firestore");
          return null;
        }
      } catch (error) {
        console.error("Erro ao buscar avatar:", error);
        return null;
      }
    };
    
    // Exemplo de uso
    useEffect(() => {
      const getAvatar = async () => {
        const avatar = await fetchUserAvatar(chatWith);
        setAvatar(avatar)
      };
    
      getAvatar();
    }, [chatWith]);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      // Verifica novas mensagens do contato atual
      const newMessages = loadedMessages.filter(
        (msg) => 
          msg.sender === chatWith && 
          !seenMessages.has(msg.id)
      );

      // Adiciona as novas mensagens ao Set reativo
      setSeenMessages((prevSeenMessages) => {
        const updatedSeenMessages = new Set(prevSeenMessages);
        newMessages.forEach((msg) => updatedSeenMessages.add(msg.id));
        return updatedSeenMessages;
      });

      // Dispara notificações para novas mensagens
  

      // Atualiza o estado das mensagens
      setMessages(loadedMessages);
    });

    return unsubscribe;
  }, [chatWith, currentUser, seenMessages, avatar]);

  return messages;
};
