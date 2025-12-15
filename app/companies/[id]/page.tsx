"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCompanyAndJobs = async () => {
      const companyDoc = await getDoc(doc(db, "users", params.id));
      if (companyDoc.exists()) {
        setCompany(companyDoc.data());
      }

      const q = query(collection(db, "jobs"), where("companyId", "==", params.id));
      const querySnapshot = await getDocs(q);
      const jobsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsList);
    };

    fetchCompanyAndJobs();
  }, [params.id]);

  const handleDelete = async (jobId) => {
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job: ", error);
    }
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{company.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2">
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  Profile
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  Jobs
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  Settings
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-3">
        <h2 className="text-2xl font-bold mb-4">Posted Jobs</h2>
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{job.description}</p>
              </CardContent>
              {user && user.uid === params.id && (
                <div className="p-4 flex gap-2">
                  <Link href={`/edit-job/${job.id}`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
