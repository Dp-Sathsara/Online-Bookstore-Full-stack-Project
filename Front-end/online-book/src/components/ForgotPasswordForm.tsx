import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// ✅ Validation Schemas
// Step 1: Email Validation
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Step 2: Password Reset Validation
const resetSchema = z.object({
  otp: z.string().min(4, "Invalid OTP code"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Email Input, 2 = Reset Password
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Forms Setup
  const emailForm = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });
  const resetForm = useForm<z.infer<typeof resetSchema>>({ resolver: zodResolver(resetSchema) });

  // ✅ Step 1: Send OTP Function
  const onSendOtp = async (data: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    
    // TODO: Backend API call to send OTP
    console.log("Sending OTP to:", data.email);
    setUserEmail(data.email);

    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // ඊළඟ පියවරට මාරු වෙන්න
    }, 1500);
  };

  // ✅ Step 2: Reset Password Function
  const onResetPassword = async (data: z.infer<typeof resetSchema>) => {
    setIsLoading(true);

    // TODO: Backend API call to verify OTP and update password
    console.log("Resetting Password:", { email: userEmail, ...data });

    setTimeout(() => {
      setIsLoading(false);
      navigate("/login"); // සාර්ථක නම් Login එකට යවන්න
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-none font-sans">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-black text-center tracking-tight">
          {step === 1 ? "Forgot Password?" : "Reset Password"}
        </CardTitle>
        <CardDescription className="text-center font-medium">
          {step === 1 
            ? "Enter your email address and we'll send you a code to reset your password." 
            : `We sent a code to ${userEmail}. Enter it below to reset your password.`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* 👉 STEP 1: Email Input View */}
        {step === 1 && (
          <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...emailForm.register("email")} />
              {emailForm.formState.errors.email && (
                <p className="text-red-500 text-xs font-bold">{emailForm.formState.errors.email.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full font-black text-md h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Code"}
            </Button>
          </form>
        )}

        {/* 👉 STEP 2: OTP & New Password View */}
        {step === 2 && (
          <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="font-bold">OTP Code</Label>
              <Input id="otp" placeholder="123456" className="tracking-widest text-center font-black text-lg" {...resetForm.register("otp")} />
              {resetForm.formState.errors.otp && (
                <p className="text-red-500 text-xs font-bold">{resetForm.formState.errors.otp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">New Password</Label>
              <Input id="password" type="password" {...resetForm.register("password")} />
              {resetForm.formState.errors.password && (
                <p className="text-red-500 text-xs font-bold">{resetForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-bold">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...resetForm.register("confirmPassword")} />
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs font-bold">{resetForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full font-black text-md h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Reset Password
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Link to="/login" className="flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
}