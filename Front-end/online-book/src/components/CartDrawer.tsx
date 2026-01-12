import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/userCartStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function CartDrawer() {
  const { cart, addToCart, removeFromCart, removeItemCompletely, totalPrice } = useCartStore();
  
  // මුළු පොත් ගණන
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted transition-colors">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground animate-in zoom-in border-2 border-background">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="h-6 w-6 text-primary" />
            My Cart
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({cartCount} items)
            </span>
          </SheetTitle>
        </SheetHeader>
        
        <Separator />

        <div className="flex-1 overflow-hidden">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground font-medium">Your cart is empty</p>
              <SheetClose asChild>
                <Button variant="link" className="text-primary font-bold">Continue Shopping</Button>
              </SheetClose>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4 mt-4">
              {cart.map((item) => (
                <div key={item.id} className="mb-4 group">
                  <div className="flex items-start gap-4">
                    {/* Item Image */}
                    <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </div>

                    {/* Info & Controls */}
                    <div className="flex flex-1 flex-col justify-between self-stretch">
                      <div>
                        <h4 className="text-sm font-bold line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.author}</p>
                        <p className="text-sm font-bold text-primary mt-1">Rs. {item.price}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* +/- Buttons */}
                        <div className="flex items-center border rounded-lg bg-muted/30">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:text-primary"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:text-primary"
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Trash Button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeItemCompletely(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </ScrollArea>
          )}
        </div>

        {/* Footer section with Total */}
        {cart.length > 0 && (
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">Rs. {totalPrice().toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
            <SheetFooter>
              <Button className="w-full h-12 text-md font-bold group shadow-md">
                Checkout Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}