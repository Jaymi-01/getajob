"use client";

import { useEffect, useState } from "react";
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      const jobDoc = await getDoc(doc(db, "jobs", params.id));
      if (jobDoc.exists()) {
        const jobData = jobDoc.data();
        setTitle(jobData.title);
        setDescription(jobData.description);
        setLocation(jobData.location);
      }
    };

    fetchJob();
  }, [params.id]);

  const handleEditJob = async (e) => {
    e.preventDefault();
    try {
      const jobRef = doc(db, "jobs", params.id);
      await updateDoc(jobRef, {
        title,
        description,
        location,
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
          <CardTitle className="text-2xl">Edit Job</CardTitle>
          <CardDescription>
            Fill in the details below to edit the job.
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
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleEditJob}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
