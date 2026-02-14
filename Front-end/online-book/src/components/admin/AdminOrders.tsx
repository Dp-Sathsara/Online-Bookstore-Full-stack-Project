import { useCartStore } from "@/store/userCartStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, CheckCircle2, Truck, Clock, Eye, ShoppingBag } from "lucide-react";

const AdminOrders = () => {
  // ✅ Zustand store එකෙන් orders සහ updateOrderStatus function එක ගන්නවා
  const { orders, updateOrderStatus } = useCartStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Order Management</h1>
        <Badge variant="outline" className="font-black px-4 py-2 border-primary/20 text-primary uppercase tracking-wider text-xs">
          {orders.length} Total Orders
        </Badge>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-background">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-6">Order ID</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Date</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Amount</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32">
                     <div className="flex flex-col items-center gap-3 opacity-20">
                        <ShoppingBag className="h-16 w-16" />
                        <p className="font-black uppercase italic text-2xl tracking-tighter">No Orders Available</p>
                        <p className="text-xs font-bold uppercase tracking-widest">Place an order first to see it here.</p>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.orderId} className="hover:bg-muted/20 border-muted/20 transition-colors">
                    <TableCell className="pl-8 py-6 font-black text-primary italic tracking-tight uppercase">{order.orderId}</TableCell>
                    <TableCell className="font-bold text-xs">{order.date}</TableCell>
                    <TableCell className="font-black text-sm italic">LKR {order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      {/* ✅ Status එක අනුව Badge එකේ පාට මාරු වීම */}
                      <Badge className={`
                        ${order.status === 'Delivered' ? 'bg-blue-500 hover:bg-blue-600' : 
                          order.status === 'Shipped' ? 'bg-orange-500 hover:bg-orange-600' : 
                          'bg-green-500 hover:bg-green-600'} 
                        text-white border-none font-black uppercase text-[9px] px-3 py-1 rounded-full shadow-lg shadow-primary/10 transition-colors
                      `}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted transition-colors"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 font-sans rounded-2xl p-2 shadow-2xl border-none">
                          <div className="p-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Change Status</div>
                          
                          {/* ✅ Status Update Actions */}
                          <DropdownMenuItem 
                            className="gap-3 font-bold uppercase text-[10px] tracking-widest cursor-pointer py-3 rounded-xl focus:bg-green-50"
                            onClick={() => updateOrderStatus(order.orderId, "Processing")}
                          >
                             <Clock className="h-4 w-4 text-green-600" /> Processing
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            className="gap-3 font-bold uppercase text-[10px] tracking-widest cursor-pointer py-3 rounded-xl focus:bg-orange-50"
                            onClick={() => updateOrderStatus(order.orderId, "Shipped")}
                          >
                             <Truck className="h-4 w-4 text-orange-600" /> Shipped
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            className="gap-3 font-bold uppercase text-[10px] tracking-widest cursor-pointer py-3 rounded-xl focus:bg-blue-50"
                            onClick={() => updateOrderStatus(order.orderId, "Delivered")}
                          >
                             <CheckCircle2 className="h-4 w-4 text-blue-600" /> Delivered
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-muted" />
                          
                          <DropdownMenuItem className="gap-3 font-bold uppercase text-[10px] tracking-widest cursor-pointer py-3 rounded-xl">
                             <Eye className="h-4 w-4" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;