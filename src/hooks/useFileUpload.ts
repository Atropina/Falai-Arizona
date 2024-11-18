import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // Ajuste o caminho conforme necessário

const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const fileRef = ref(storage, `chat_files/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Acompanhe o progresso do upload, se necessário
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
      (error) => {
        console.error('Upload failed', error);
        setUploading(false);
      },
      async () => {
        // Obtenha a URL do arquivo carregado
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setFileUrl(downloadUrl);
        setUploading(false);
        console.log('File available at', downloadUrl);
      }
    );
  };

  return { handleFileUpload, uploading, fileUrl };
};

export default useFileUpload;
