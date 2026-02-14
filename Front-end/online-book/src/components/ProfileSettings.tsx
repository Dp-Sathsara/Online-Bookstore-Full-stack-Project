import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, Camera, Lock, Save, 
  CheckCircle2, Mail, MapPin, Phone, Hash, SendHorizontal, AlertCircle
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    fullName: "User Name",
    phone: "0759951458",
    email: "user@example.com",
    city: "Kurunegala",
    postalCode: "60000",
    address: "381/1 Nahalla, Rideegama",
    profilePic: ""
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<"initial" | "otpEntry" | "passwordReset">("initial");
  
  // ✅ OTP Validation States
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000);
  };

  // ✅ OTP Verify Logic
  const handleVerifyOTP = () => {
    setIsVerifying(true);
    setOtpError(false);

    // තත්පර 1.5ක simulate verification එකක්
    setTimeout(() => {
      if (otpValue === "123456") {
        setActiveStep("passwordReset");
        setOtpError(false);
      } else {
        setOtpError(true);
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile({ ...profile, profilePic: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 font-sans animate-in fade-in duration-500">
      <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Profile Settings</h1>

      {/* --- Profile Card (කලින් වගේමයි) --- */}
      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-background">
        <CardContent className="p-8 md:p-12 space-y-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-muted shadow-xl bg-muted flex items-center justify-center">
                {profile.profilePic ? (
                  <img src={profile.profilePic} className="h-full w-full object-cover" alt="Profile" />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground/40" />
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera className="h-4 w-4" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><User className="h-3 w-3" /> Full Name</Label>
              <Input value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} className="h-12 rounded-2xl bg-muted/30 border-none font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><Mail className="h-3 w-3" /> Email</Label>
              <Input value={profile.email} disabled className="h-12 rounded-2xl bg-muted/10 border-none font-bold opacity-60 italic" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><Phone className="h-3 w-3" /> Phone</Label>
              <Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="h-12 rounded-2xl bg-muted/30 border-none font-bold" />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => { setIsPasswordModalOpen(true); setActiveStep("initial"); setOtpValue(""); setOtpError(false); }} className="h-12 w-full rounded-2xl border-2 border-primary/20 font-black uppercase text-[10px] tracking-widest gap-2">
                <Lock className="h-4 w-4" /> Change Password
              </Button>
            </div>
            <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin className="h-3 w-3" /> City</Label><Input value={profile.city} onChange={(e) => setProfile({...profile, city: e.target.value})} className="h-12 rounded-2xl bg-muted/30 border-none font-bold" /></div>
            <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><Hash className="h-3 w-3" /> Postal Code</Label><Input value={profile.postalCode} onChange={(e) => setProfile({...profile, postalCode: e.target.value})} className="h-12 rounded-2xl bg-muted/30 border-none font-bold" /></div>
            <div className="space-y-2 md:col-span-2"><Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin className="h-3 w-3" /> Shipping Address</Label><Input value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} className="h-12 rounded-2xl bg-muted/30 border-none font-bold" /></div>
          </div>

          <Button onClick={handleUpdateProfile} disabled={isUpdating} className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all duration-500 ${isUpdating ? "bg-green-500 text-white" : "bg-primary text-white"}`}>
            {isUpdating ? <><CheckCircle2 className="mr-2 h-5 w-5 animate-bounce" /> Saved!</> : <><Save className="mr-2 h-5 w-5" /> Update Profile</>}
          </Button>
        </CardContent>
      </Card>

      {/* ✅ Multi-Step Password Update Modal with Validation */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] font-sans border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-center">
              {activeStep === "initial" && "Verification"}
              {activeStep === "otpEntry" && "Identity Check"}
              {activeStep === "passwordReset" && "Reset Password"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            {/* Step 1: Send OTP */}
            {activeStep === "initial" && (
              <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/20">
                  <Mail className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-relaxed">
                    Security check required. Send code to: <br/>
                    <span className="text-primary font-black lowercase tracking-normal">{profile.email}</span>
                  </p>
                </div>
                <Button onClick={() => setActiveStep("otpEntry")} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-primary gap-3 shadow-lg shadow-primary/20">
                  <SendHorizontal className="h-5 w-5" /> Send OTP Code
                </Button>
              </div>
            )}

            {/* Step 2: Enter OTP with Validation Logic */}
            {activeStep === "otpEntry" && (
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                <div className="bg-primary/5 p-4 rounded-2xl flex items-center gap-3">
                  <Mail className="text-primary h-6 w-6" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">OTP Code Sent to <span className="text-primary lowercase">{profile.email}</span></p>
                </div>
                
                <div className="space-y-3">
                   <Input 
                    placeholder="ENTER 6-DIGIT CODE" 
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => {
                      setOtpValue(e.target.value.replace(/\D/g, ""));
                      setOtpError(false);
                    }}
                    className={`h-16 text-center text-2xl tracking-[0.4em] rounded-2xl bg-muted/30 border-2 font-black transition-all ${
                      otpError ? "border-red-500 bg-red-50 text-red-600" : "border-transparent focus-visible:ring-primary"
                    }`} 
                   />
                   {otpError && (
                     <p className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 animate-bounce">
                        <AlertCircle className="h-3 w-3" /> Invalid Code! Use 123456 to test.
                     </p>
                   )}
                </div>

                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={otpValue.length !== 6 || isVerifying}
                  className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-primary shadow-lg shadow-primary/20"
                >
                   {isVerifying ? "Verifying..." : "Verify OTP Code"}
                </Button>
              </div>
            )}

            {/* Step 3: New Password */}
            {activeStep === "passwordReset" && (
              <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Confirm Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                </div>
                <Button onClick={() => setIsPasswordModalOpen(false)} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-green-500 text-white mt-4 shadow-lg shadow-green-200">
                  Update Password
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;