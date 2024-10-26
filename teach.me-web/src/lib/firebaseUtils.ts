import { database } from '../firebase/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, push } from 'firebase/database';

const storage = getStorage();

export const uploadFileInfo = async (file) => {
  const storageRef = ref(storage, `uploads/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  const fileId = push(dbRef(database, 'uploads')).key;

  await set(dbRef(database, `uploads/${fileId}`), {
    name: file.name,
    url: downloadURL,
    size: file.size,
    type: file.type,
    createdAt: new Date().toISOString(),
  });

  return fileId; 
};
