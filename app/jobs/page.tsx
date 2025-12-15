"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobsCollection = collection(db, "jobs");
      const jobSnapshot = await getDocs(jobsCollection);
      const jobList = await Promise.all(
        jobSnapshot.docs.map(async (jobDoc) => {
          const jobData = jobDoc.data();
          const companyDoc = await getDoc(doc(db, "users", jobData.companyId));
          const companyData = companyDoc.data();
          return {
            id: jobDoc.id,
            ...jobData,
            companyName: companyData.name,
          };
        })
      );
      setJobs(jobList);
    };

    fetchJobs();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setUserType(userData.userType);
      } else {
        setUserType(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleApply = async (jobId) => {
    if (!user) {
      alert("Please login to apply for this job.");
      return;
    }
    try {
      await addDoc(collection(db, "applications"), {
        jobId,
        talentId: user.uid,
        status: "pending",
      });
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job: ", error);
      alert("Error submitting application.");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        {user && userType === "company" && (
          <Link href="/post-job">
            <Button>Post a Job</Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.companyName}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{job.description}</p>
            </CardContent>
            <CardFooter>
              {user && userType === "talent" && (
                <Button onClick={() => handleApply(job.id)}>Apply</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
