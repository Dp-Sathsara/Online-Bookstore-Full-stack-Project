import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/userCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Truck, CreditCard, Banknote, MapPin, ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Validation Schema
const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phone: z.string().min(10, "Phone number must be valid"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  paymentMethod: z.enum(["card", "cod"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // ✅ Store එකෙන් අවශ්‍ය දේවල් ගන්නවා (clearSelectedItems එකත් එක්ක)
  const { cart, totalPrice, clearSelectedItems } = useCartStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // ✅ 1. Checkout කරන්නේ Select කරපු items විතරයි
  const selectedItems = cart.filter(item => item.selected);
  
  const shippingCost = 450;
  const subTotal = totalPrice(); // Store එකෙන් දැන් එන්නේ selected ඒවයේ total එක විතරයි
  const finalTotal = subTotal + shippingCost;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const newOrderNum = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(newOrderNum);
      
      setIsSuccessOpen(true);
      
      // ✅ 2. මෙතනදී selected items පමණක් ඉවත් කරනවා
      clearSelectedItems();
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    navigate("/");
  };

  // ✅ 3. තෝරාගත් items නැත්නම් Empty state එකක් පෙන්වනවා
  if (selectedItems.length === 0 && !isSuccessOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans">
        <div className="bg-muted p-6 rounded-full">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-black uppercase">No items selected</h2>
        <p className="text-muted-foreground font-medium">Please select items from your cart to proceed with checkout.</p>
        <Button onClick={() => navigate("/")} variant="default" className="font-bold uppercase tracking-widest px-8 h-12">Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 font-sans">
      <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent font-bold" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
      </Button>

      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 italic text-foreground">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Forms */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} id="checkout-form">
            
            <Card className="shadow-md border-none rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight">
                  <MapPin className="text-primary h-5 w-5" /> Shipping Details
                </CardTitle>
                <CardDescription>Enter your delivery address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-bold text-xs uppercase tracking-wider">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" {...form.register("fullName")} className="rounded-xl bg-muted/30 border-none h-11" />
                    {form.formState.errors.fullName && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold text-xs uppercase tracking-wider">Phone Number</Label>
                    <Input id="phone" placeholder="077xxxxxxx" {...form.register("phone")} className="rounded-xl bg-muted/30 border-none h-11" />
                    {form.formState.errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="font-bold text-xs uppercase tracking-wider">Address</Label>
                  <Input id="address" placeholder="123, Main Street" {...form.register("address")} className="rounded-xl bg-muted/30 border-none h-11" />
                  {form.formState.errors.address && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="font-bold text-xs uppercase tracking-wider">City</Label>
                    <Input id="city" placeholder="Colombo" {...form.register("city")} className="rounded-xl bg-muted/30 border-none h-11" />
                    {form.formState.errors.city && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="font-bold text-xs uppercase tracking-wider">Postal Code</Label>
                    <Input id="postalCode" placeholder="10100" {...form.register("postalCode")} className="rounded-xl bg-muted/30 border-none h-11" />
                    {form.formState.errors.postalCode && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.postalCode.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-none mt-6 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight">
                  <CreditCard className="text-primary h-5 w-5" /> Payment Method
                </CardTitle>
                <CardDescription>Select how you want to pay.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue="cod" 
                  onValueChange={(val) => form.setValue("paymentMethod", val as "card" | "cod")}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      <span className="font-bold uppercase text-xs tracking-widest">Card Payment</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                    <Label
                      htmlFor="cod"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <Banknote className="mb-3 h-6 w-6" />
                      <span className="font-bold uppercase text-xs tracking-widest">Cash On Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-primary/10 sticky top-24 rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg font-bold uppercase tracking-tight">Order Summary</CardTitle>
              <CardDescription className="font-medium">{selectedItems.length} selected items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="text-foreground font-bold line-clamp-1 uppercase text-xs">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-black text-primary text-xs">{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="font-black">LKR {subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span className="text-green-600 font-black">+ LKR {shippingCost.toLocaleString()}</span>
                </div>
              </div>

              <Separator className="bg-primary/10" />

              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-black uppercase italic tracking-tighter">Total Amount</span>
                <span className="text-2xl font-black text-primary tracking-tighter italic leading-none">LKR {finalTotal.toLocaleString()}</span>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/30 border-t pt-6">
              <Button 
                type="submit" 
                form="checkout-form"
                className="w-full h-14 text-md font-black uppercase tracking-widest shadow-xl shadow-primary/30 rounded-xl active:scale-95 transition-transform"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Complete Order"}
              </Button>
            </CardFooter>
          </Card>
          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
            <Truck className="h-3 w-3" /> 
            <span>Verified Secure Delivery</span>
          </div>
        </div>
      </div>

      {/* ✅ Final Fixed Success Popup Dialog - Centered for Desktop & Mobile */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-md p-0 rounded-3xl border-none shadow-2xl overflow-hidden font-sans">
          <div className="flex flex-col items-center justify-center text-center p-10 bg-background w-full">
            
            <DialogHeader className="flex flex-col items-center justify-center w-full space-y-6">
              
              {/* Success Icon with Animation Container */}
              <div className="relative flex items-center justify-center h-24 w-24 mb-2">
                 <div className="absolute inset-0 border-4 border-green-500/20 rounded-full"></div>
                 <div className="relative bg-green-500 p-4 rounded-full shadow-lg shadow-green-200">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                      <path 
                        className="animate-draw-check" 
                        d="M5 13l4 4L19 7" 
                        style={{
                          strokeDasharray: 50,
                          strokeDashoffset: 50,
                          animation: 'drawCheck 0.6s ease-in-out forwards 0.2s'
                        }}
                      />
                    </svg>
                 </div>
              </div>

              <div className="space-y-2 w-full flex flex-col items-center">
                 <DialogTitle className="text-3xl font-black tracking-tighter text-foreground uppercase italic leading-none text-center">
                    Order <span className="text-green-600">Placed!</span>
                 </DialogTitle>
                 <DialogDescription className="text-lg font-medium text-muted-foreground max-w-[280px] text-center italic">
                    Thank you for your purchase. Your books are on the way!
                 </DialogDescription>
              </div>
            </DialogHeader>
            
            {/* Order Reference Box - Center Aligned Wrapper */}
            <div className="w-full flex justify-center mt-6">
                <div className="bg-muted/40 p-5 rounded-2xl border border-muted/50 space-y-1 flex flex-col items-center min-w-[240px]">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order Reference</p>
                    <p className="text-2xl font-black tracking-widest text-primary italic leading-none">{orderNumber}</p>
                </div>
            </div>

            <p className="text-[11px] text-muted-foreground mt-5 px-4 leading-relaxed max-w-[300px] text-center font-medium">
              A confirmation email has been sent to your inbox. You can track your order using the reference above.
            </p>

            <div className="mt-8 w-full flex justify-center items-center">
              <Button 
                  className="w-full sm:w-64 h-14 text-md font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 bg-primary" 
                  onClick={handleCloseSuccess}
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes drawCheck {
              to { stroke-dashoffset: 0; }
            }
          `}} />
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CheckoutPage;