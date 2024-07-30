"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export default function UploadDocument() {
	const [file, setFile] = useState(null);
	const [progress, setProgress] = useState(0);
	const [downloadURL, setDownloadURL] = useState("");
	const [uploadSuccess, setUploadSuccess] = useState(false);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleUpload = async () => {
		if (!file) return;

		const storageRef = ref(storage, `documents/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setProgress(progress);
			},
			(error) => {
				console.log("Upload error:", error);
			},
			async () => {
				getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
					setDownloadURL(downloadURL);
					// Call the function to create the document in the backend
					await createDocument(downloadURL);
				});
			}
		);
	};

	const createDocument = async (documentUrl) => {
		try {
			const formData = new FormData();
			formData.append("documentUrl", documentUrl);

			const response = await fetch("/api/document", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				return NextResponse.json(
					{ message: "Failed to create document" },
					{ status: 500 }
				);
			}

			const document = await response.json();
			console.log("Document created:", document);
			setUploadSuccess(true);
		} catch (error) {
			console.log("Error creating document:", error);
		}
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
			)}
			{uploadSuccess && <p>Document created successfully!</p>}
		</>
	);
}
