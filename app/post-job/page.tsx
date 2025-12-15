"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be logged in to post a job.");
      }
      await addDoc(collection(db, "jobs"), {
        title,
        description,
        location,
        companyId: user.uid,
      });
      router.push("/jobs");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Post a Job</CardTitle>
          <CardDescription>
            Fill in the details below to post a new job.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g. Software Engineer"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. San Francisco, CA"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="e.g. We are looking for a..."
              required
              value={description}
              onChange={(e) => setDescription(e.-target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePostJob}>
            Post Job
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
