import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const jobs = [
  {
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    description: "We are looking for a talented software engineer to join our team.",
  },
  {
    title: "Product Manager",
    company: "Facebook",
    location: "Menlo Park, CA",
    description: "We are looking for a talented product manager to join our team.",
  },
  {
    title: "Data Scientist",
    company: "Amazon",
    location: "Seattle, WA",
    description: "We are looking for a talented data scientist to join our team.",
  },
];

export default function JobsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{job.description}</p>
          </CardContent>
          <CardFooter>
            <Button>Apply</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
