import { useState, useEffect } from "react";
import { useCartStore } from "@/store/userCartStore";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { Lock, CreditCard, MapPin, Truck } from "lucide-react";
import api from "@/services/api";

const CheckoutPage = () => {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  // ✅ FIX: Quantity එක්කම Price එක ගණනය කිරීම
  const totalPrice = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  // ... (ඉතුරු state ටික එහෙමමයි: paymentMethod, cardDetails, isProcessing, showSuccessModal, orderId)
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiryDate: "", cvv: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (cart.length === 0 && !showSuccessModal) {
      navigate("/");
    }
  }, [cart, navigate, showSuccessModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (Card Change Logic Same as before)
    let value = e.target.value;
    const name = e.target.name;
    if (name === 'cardNumber') value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    else if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // ... (Validation Logic Same as before)

    const orderData = {
      customerDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
      },
      items: cart.map(item => ({
        bookId: item.id,
        title: item.title,
        author: item.author,
        price: item.price,
        quantity: item.quantity || 1, // ✅ FIX: Default 1 if undefined
        image: item.image
      })),
      totalAmount: totalPrice,
      paymentMethod: paymentMethod === 'cod' ? "Cash on Delivery" : "Credit Card",
      orderStatus: "Pending",
      paymentStatus: paymentMethod === 'card' ? "Paid" : "Pending",
      userId: user?.id
    };
    console.log("Submitting Order Data:", JSON.stringify(orderData, null, 2)); // DEBUG LOG

    try {
      const response = await api.post("/orders", orderData);
      setOrderId(response.data.id || "#ORDER-" + Math.floor(Math.random() * 10000));
      setShowSuccessModal(true);
      clearCart();
    } catch (error) {
      console.error("Order Failed:", error);
      alert("Order Failed! Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/orders");
  };

  const [reviews, setReviews] = useState<{ [key: string]: { rating: number; comment: string } }>({});

  const handleReviewChange = (bookId: string, field: "rating" | "comment", value: any) => {
    setReviews((prev) => ({
      ...prev,
      [bookId]: { ...prev[bookId], [field]: value },
    }));
  };

  const submitReview = async (bookId: string, item: any) => {
    const reviewData = reviews[bookId];
    if (!reviewData || !reviewData.rating) return alert("Please select a rating!");

    try {
      await api.post("/reviews", {
        userId: user?.id || "guest",
        userName: user?.username || "Guest",
        bookId: bookId,
        bookTitle: item.title,
        bookImage: item.image,
        rating: reviewData.rating,
        comment: reviewData.comment || "",
      });
      alert(`Review for "${item.title}" submitted!`);
    } catch (error) {
      console.error("Review Submit Error:", error);
      alert("Failed to submit review.");
    }
  };

  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto py-10">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full text-center space-y-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Truck className="h-10 w-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight text-green-700">Order Placed!</h2>
            <p className="text-muted-foreground font-medium">Thank you for your purchase. Rate your books!</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-dashed border-primary/20">
            <p className="text-sm font-bold uppercase text-muted-foreground">Order ID</p>
            <p className="text-xl font-black text-primary tracking-widest">{orderId}</p>
          </div>

          {/* Review Section */}
          <div className="text-left space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-lg font-bold uppercase border-b pb-2">Rate your ordered books</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 border p-4 rounded-xl bg-gray-50">
                <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-md" />
                <div className="flex-1 space-y-2">
                  <p className="font-bold text-sm">{item.title}</p>

                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleReviewChange(String(item.id), "rating", star)}
                        className={`text-xl ${(reviews[item.id]?.rating || 0) >= star ? "text-yellow-500" : "text-gray-300"
                          }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <Input
                    placeholder="Write a comment..."
                    value={reviews[item.id]?.comment || ""}
                    onChange={(e) => handleReviewChange(String(item.id), "comment", e.target.value)}
                    className="h-9 text-sm"
                  />
                  <Button size="sm" onClick={() => submitReview(String(item.id), item)} className="w-full mt-2">
                    Submit Review
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={closeSuccessModal} className="w-full h-12 rounded-xl font-bold text-lg">View My Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-sans animate-in fade-in duration-500">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* ... (Forms UI Same as before) ... */}
          {/* Shipping Form */}
          <Card className="rounded-3xl border-none shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl font-black uppercase"><MapPin className="text-primary" /> Shipping Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Inputs for Name, Phone, Email, Address, City, Country, Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={formData.name} onChange={handleInputChange} className="rounded-xl h-11 bg-muted/30" required /></div>
                <div className="space-y-2"><Label>Phone</Label><Input name="phone" value={formData.phone} onChange={handleInputChange} className="rounded-xl h-11 bg-muted/30" required /></div>
              </div>
              <div className="space-y-2"><Label>Email</Label><Input name="email" value={formData.email} onChange={handleInputChange} className="rounded-xl h-11 bg-muted/30" required /></div>
              <div className="space-y-2"><Label>Address</Label><Input name="address" value={formData.address} onChange={handleInputChange} className="rounded-xl h-11 bg-muted/30" required /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>City</Label><Input name="city" value={formData.city} onChange={handleInputChange} className="rounded-xl h-11 bg-muted/30" required /></div>
                <div className="space-y-2"><Label>Country</Label><Input name="country" value={formData.country} onChange={handleInputChange} className="rounded-xl h-11 bg-muted/30" placeholder="Sri Lanka" required /></div>
                <div className="space-y-2"><Label>Postal Code</Label><Input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="rounded-xl h-11 bg-muted/30" required /></div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method UI */}
          <Card className="rounded-3xl border-none shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl font-black uppercase"><CreditCard className="text-primary" /> Payment Method</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                <div className={`flex items-center space-x-2 border p-4 rounded-2xl cursor-pointer ${paymentMethod === 'card' ? 'ring-2 ring-primary bg-primary/5' : ''}`}><RadioGroupItem value="card" id="card" /><Label htmlFor="card" className="font-bold cursor-pointer flex gap-2 w-full"><CreditCard className="h-5 w-5" /> Card</Label></div>
                <div className={`flex items-center space-x-2 border p-4 rounded-2xl cursor-pointer ${paymentMethod === 'cod' ? 'ring-2 ring-primary bg-primary/5' : ''}`}><RadioGroupItem value="cod" id="cod" /><Label htmlFor="cod" className="font-bold cursor-pointer flex gap-2 w-full"><Truck className="h-5 w-5" /> COD</Label></div>
              </RadioGroup>
              {paymentMethod === 'card' && (
                <div className="p-6 bg-muted/30 rounded-2xl space-y-4">
                  <div className="space-y-2"><Label>Card Number</Label><Input name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardChange} maxLength={19} placeholder="0000 0000 0000 0000" className="pl-4 rounded-xl h-11 font-mono" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Expiry (MM/YY)</Label><Input name="expiryDate" value={cardDetails.expiryDate} onChange={handleCardChange} placeholder="MM/YY" maxLength={5} className="rounded-xl h-11 font-mono" /></div>
                    <div className="space-y-2"><Label>CVV</Label><Input name="cvv" type="password" value={cardDetails.cvv} onChange={handleCardChange} maxLength={3} placeholder="123" className="rounded-xl h-11 font-mono" /></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-none shadow-lg bg-primary/5 sticky top-6">
            <CardHeader><CardTitle className="text-xl font-black uppercase">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <img src={item.image} alt="" className="h-12 w-10 object-cover rounded bg-white shadow-sm" />
                    <div className="flex-1">
                      <p className="font-bold line-clamp-1">{item.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">Qty: {item.quantity || 1}</span>
                        <span className="font-bold">LKR {(item.price * (item.quantity || 1)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-primary/20 pt-4 flex justify-between items-center">
                <span className="text-lg font-black uppercase">Total</span>
                <span className="text-xl font-black text-primary">LKR {totalPrice.toLocaleString()}</span>
              </div>
              <Button onClick={handleSubmit} disabled={isProcessing} className="w-full h-12 rounded-xl font-black uppercase shadow-lg shadow-primary/30">
                {isProcessing ? "Processing..." : <>Pay & Place Order <Lock className="ml-2 h-4 w-4" /></>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;