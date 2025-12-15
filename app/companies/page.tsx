import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const companies = [
  {
    id: "google",
    name: "Google",
    description: "A multinational technology company.",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "A social media and technology company.",
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "A multinational technology company.",
  },
];

export default function CompaniesPage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <Link href={`/companies/${company.id}`} key={company.id}>
          <Card>
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{company.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
