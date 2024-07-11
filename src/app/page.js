// src/app/page.js
"use client";
import { useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../lib/firebase";
import ContentForm from "./components/ContentForm";

export default function Home() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
        });
      }
    );
  };

  return (
    <>
      <section className="container m-auto px-4 py-4">
        <h1 className="text-8xl">IYKYK</h1>
        <p>Sube tu documento en png/pdf</p>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <p>Upload Progress: {progress}%</p>
        {downloadURL && (
          <p>
            Download URL: <a href={downloadURL}>{downloadURL}</a>
          </p>
        )}
        <ContentForm />
      </section>
    </>
  );
}
