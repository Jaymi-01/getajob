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
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";

export default function TalentProfilePage({ params }: { params: { id: string } }) {
  const [talent, setTalent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTalentAndApplications = async () => {
      const talentDoc = await getDoc(doc(db, "users", params.id));
      if (talentDoc.exists()) {
        setTalent(talentDoc.data());
      }

      const q = query(
        collection(db, "applications"),
        where("talentId", "==", params.id)
      );
      const querySnapshot = await getDocs(q);
      const applicationsList = await Promise.all(
        querySnapshot.docs.map(async (appDoc) => {
          const appData = appDoc.data();
          const jobDoc = await getDoc(doc(db, "jobs", appData.jobId));
          const jobData = jobDoc.data();
          const companyDoc = await getDoc(doc(db, "users", jobData.companyId));
          const companyData = companyDoc.data();
          return {
            id: appDoc.id,
            ...appData,
            jobTitle: jobData.title,
            companyName: companyData.name,
          };
        })
      );
      setApplications(applicationsList);
    };

    fetchTalentAndApplications();
  }, [params.id]);

  if (!talent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{talent.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2">
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  Profile
                </Button>
              </li>
              <li>
                <Link href="/talents/resume">
                  <Button variant="ghost" className="w-full justify-start">
                    Resume
                  </Button>
                </Link>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  Applications
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
        {talent.resume && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Resume</h2>
            <Card>
              <CardContent className="p-4">
                <p>
                  <a
                    href={talent.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        <h2 className="text-2xl font-bold mt-8 mb-4">Applications</h2>
        <div className="grid grid-cols-1 gap-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <CardTitle>{application.jobTitle}</CardTitle>
                <CardDescription>{application.companyName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Status: {application.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
