import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/userCartStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // 👈 අලුතින්
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
import { useNavigate } from "react-router-dom";

export function CartDrawer() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, removeItemCompletely, totalPrice, toggleSelectItem, toggleSelectAll } = useCartStore();
  
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const selectedCount = cart.filter(item => item.selected).length;
  const isAllSelected = cart.length > 0 && selectedCount === cart.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted transition-colors">
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground animate-in zoom-in border-2 border-background font-bold text-[10px]">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background font-sans">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight italic">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Your Cart
          </SheetTitle>
          
          {/* ✅ Select All Option */}
          {cart.length > 0 && (
            <div className="flex items-center gap-2 py-2">
              <Checkbox 
                id="selectAll" 
                checked={isAllSelected}
                onCheckedChange={(checked) => toggleSelectAll(!!checked)}
              />
              <label htmlFor="selectAll" className="text-sm font-bold cursor-pointer text-muted-foreground">
                Select All ({cart.length})
              </label>
            </div>
          )}
        </SheetHeader>
        
        <Separator />

        <div className="flex-1 overflow-hidden relative">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="p-6 bg-muted/50 rounded-full">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
              </div>
              <p className="text-lg font-bold text-center">Your cart is empty</p>
              <SheetClose asChild>
                <Button variant="default" className="font-bold">Start Shopping</Button>
              </SheetClose>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4 mt-4 -mr-4">
              <div className="pr-4 space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="group flex items-center gap-3">
                    {/* ✅ Individual Checkbox */}
                    <Checkbox 
                      checked={item.selected}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                    />

                    <div className="flex flex-1 gap-4">
                      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="font-bold line-clamp-1 text-sm uppercase">{item.title}</h4>
                          <p className="text-xs text-muted-foreground italic">by {item.author}</p>
                        </div>
                        
                        <div className="flex items-end justify-between">
                          <p className="font-black text-lg text-primary">
                            LKR {item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border rounded-lg bg-muted/30 h-8">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => addToCart(item)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItemCompletely(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="mt-auto pt-4 sm:pt-6 border-t bg-background">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Selected ({selectedCount})</span>
                <span className="text-2xl font-black tracking-tight text-primary">
                  LKR {totalPrice().toLocaleString()}
                </span>
              </div>
              <SheetClose asChild>
                <Button 
                  className="w-full h-14 text-md font-black uppercase tracking-widest"
                  onClick={() => navigate("/checkout")}
                  disabled={selectedCount === 0} // 👈 එකක්වත් තෝරලා නැත්නම් checkout යන්න බෑ
                >
                  Checkout Selected ({selectedCount})
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}