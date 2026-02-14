import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X } from "lucide-react";
import { SocialLogin } from "./SocialLogin";
import { PasswordInput } from "@/components/ui/password-input";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Min 8 chars")
    .regex(/[A-Z]/, "Uppercase letter")
    .regex(/[a-z]/, "Lowercase letter")
    .regex(/[0-9]/, "Number")
    .regex(/[^A-Za-z0-9]/, "Special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ 1. Password Field එක Focus වෙලාද බලන්න state එකක් හැදුවා
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  const validations = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter", valid: /[a-z]/.test(password) },
    { label: "At least one number", valid: /[0-9]/.test(password) },
    { label: "At least one special character (!@#$)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    console.log("Register Data:", data);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login"); 
    }, 2000);
  };

  // ✅ React Hook Form එකේ Props ටික වෙනම ගත්තා conflict නොවෙන්න
  const { onBlur: onPasswordBlur, ...passwordRegisterProps } = register("password");

  return (
    <Card className="w-full max-w-md shadow-2xl border-none font-sans">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-black text-center tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-center font-medium">
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-bold">First name</Label>
              <Input id="firstName" placeholder="John" {...register("firstName")} />
              {errors.firstName && <p className="text-red-500 text-xs font-bold">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-bold">Last name</Label>
              <Input id="lastName" placeholder="Doe" {...register("lastName")} />
              {errors.lastName && <p className="text-red-500 text-xs font-bold">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
            {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-bold">Password</Label>
            
            {/* ✅ 2. Password Input එක Update කළා Focus Events එක්ක */}
            <PasswordInput 
              id="password" 
              {...passwordRegisterProps} // register props ටික pass කළා
              onFocus={() => setIsPasswordFocused(true)} // Click කළාම List එක පෙන්වන්න
              onBlur={(e) => {
                setIsPasswordFocused(false); // Click අයින් කළාම List එක හංගන්න
                onPasswordBlur(e); // React Hook Form එකේ blur එකත් වැඩ කරන්න ඕනේ
              }}
            />
            
            {/* ✅ 3. Conditional Rendering: isPasswordFocused True නම් විතරක් පෙන්වන්න */}
            {isPasswordFocused && (
              <div className="space-y-1.5 pt-1 p-3 bg-muted/50 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-bold text-muted-foreground mb-2">Password must contain:</p>
                {validations.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    {rule.valid ? (
                      <Check className="h-3 w-3 text-green-600 font-bold" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={rule.valid ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Error Message */}
            {errors.password && !isPasswordFocused && (
               <p className="text-red-500 text-xs font-bold">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-bold">Confirm Password</Label>
            <PasswordInput id="confirmPassword" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-red-500 text-xs font-bold">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full font-black text-md h-11" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>

          <SocialLogin />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <div className="text-sm font-medium text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
        </div>
      </CardFooter>
    </Card>
  );
}