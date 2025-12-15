"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { signup } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signupSchema } from "@/lib/schemas/auth";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await signup(data.email, data.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        userType: data.userType,
      });
      toast.success("Account created successfully!");
      router.push(
        data.userType === "company"
          ? `/companies/${user.uid}`
          : `/talents/${user.uid}`
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>You are a:</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="company"
                    value="company"
                    {...register("userType")}
                  />
                  <Label htmlFor="company" className="ml-2">
                    Company
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="talent"
                    value="talent"
                    {...register("userType")}
                  />
                  <Label htmlFor="talent" className="ml-2">
                    Talent
                  </Label>
                </div>
              </div>
              {errors.userType && (
                <p className="text-red-500 text-sm">
                  {errors.userType.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Button className="w-full my-4" type="submit">
                Create account
              </Button>
              <div className="mt-4 text-sm text-center">
                Already have an account?{" "}
                <Link href="/auth/login" className="underline">
                  Login
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
