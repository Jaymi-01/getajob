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
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label>You are a:</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Input type="radio" id="company" name="userType" value="company" />
                <Label htmlFor="company" className="ml-2">
                  Company
                </Label>
              </div>
              <div className="flex items-center">
                <Input type="radio" id="talent" name="userType" value="talent" />
                <Label htmlFor="talent" className="ml-2">
                  Talent
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <Button className="w-full">Create account</Button>
            <div className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline">
                Login
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
