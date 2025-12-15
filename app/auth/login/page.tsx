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
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/schemas/auth";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await login(data.email, data.password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      toast.success("Logged in successfully!");
      router.push(
        userData.userType === "company"
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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
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
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Button className="w-full my-4" type="submit">
                Sign in
              </Button>
              <div className="mt-4 text-sm text-center">
                <Link href="/auth/forgot-password">
                  Forgot your password?
                </Link>
              </div>
              <div className="mt-4 text-sm text-center">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
