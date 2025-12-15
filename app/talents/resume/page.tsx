"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage, auth, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function UploadResumePage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to upload a resume.");
      return;
    }

    try {
      const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        resume: downloadURL,
      });
      router.push(`/talents/${user.uid}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Resume</CardTitle>
          <CardDescription>
            Select a file to upload as your resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="resume-file">Resume File</Label>
            <Input id="resume-file" type="file" onChange={handleFileChange} />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleUpload}>
            Upload
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
