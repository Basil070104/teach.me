import { database } from '../firebase/firebaseConfig';
import { ref, push, set } from 'firebase/database';

export const uploadFileInfo = async (file) => {
  const fileRef = ref(database, 'uploads/');
  const newFileRef = push(fileRef);

  // Prepare file info
  const fileData = {
    id: newFileRef.key,
    name: file.name,
    size: file.size,
    type: file.type,
  };

  await set(newFileRef, fileData);
  
  return newFileRef.key;
};
