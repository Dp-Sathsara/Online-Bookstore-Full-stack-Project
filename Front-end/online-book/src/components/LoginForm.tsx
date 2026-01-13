import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { SocialLogin } from "./SocialLogin"; 

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    // TODO: Spring Boot Backend call for JWT Login
    console.log("Login Data:", data);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-none font-sans">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-black text-center tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-center font-medium">
          Enter your email and password to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
            {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-bold">Password</Label>
              
              {/* ✅ Forgot Password Link Updated */}
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                Forgot password?
              </Link>
            
            </div>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-red-500 text-xs font-bold">{errors.password.message}</p>}
          </div>
          
          <Button type="submit" className="w-full font-black text-md h-11" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Social Login Component */}
          <SocialLogin />

        </form>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <div className="text-sm font-medium text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}