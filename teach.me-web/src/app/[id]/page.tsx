"use client";

import { useEffect, useState } from 'react';
import { database } from '../../firebase/firebaseConfig';
import { ref, get } from 'firebase/database';
import { useParams } from 'next/navigation';

const FilePage = () => {
  const { id } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileData = async () => {
      if (id) {
        const fileRef = ref(database, `uploads/${id}`);
        const snapshot = await get(fileRef);
        setFileData(snapshot.val());
      }
      setLoading(false);
    };

    fetchFileData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while fetching
  }

  return (
    <div>
      <h1>File ID: {id}</h1>
      {fileData ? (
        <div>
          <h2>File Name: {fileData.name}</h2>
          <p>File Size: {fileData.size} bytes</p>
          <p>File Type: {fileData.type}</p>
        </div>
      ) : (
        <p>File not found.</p>
      )}
    </div>
  );
};

export default FilePage;
