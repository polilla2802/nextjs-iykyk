"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
export default  function UpoloadDocument() {
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
			<p>Sube tu documento en png/pdf</p>
			<input type="file" onChange={handleFileChange} />
			<button onClick={handleUpload}>Upload</button>
			<p>Upload Progress: {progress}%</p>
			{downloadURL && (
				<p>
					Download URL: <a href={downloadURL}>{downloadURL}</a>
				</p>
			)}</>
	);
}