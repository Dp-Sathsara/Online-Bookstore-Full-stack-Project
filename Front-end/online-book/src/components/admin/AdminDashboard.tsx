import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

// Graphs සඳහා Sample Data
const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const AdminDashboard = () => {
  const stats = [
    { label: "Total Revenue", value: "LKR 125,500", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Active Orders", value: "12", icon: ShoppingBag, color: "text-green-600", bg: "bg-green-100" },
    { label: "Total Books", value: "450", icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Monthly Growth", value: "+14%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Page Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Overview</h1>
        <p className="text-muted-foreground font-medium text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md rounded-[2rem] overflow-hidden bg-background">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-xl font-black italic tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart Animation Placeholder */}
        <Card className="rounded-[2.5rem] border-none shadow-lg p-6 bg-background min-h-[350px]">
          <CardHeader className="px-0 pt-0">
             <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Sales Analytics
             </CardTitle>
          </CardHeader>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Popular Categories Placeholder */}
        <Card className="rounded-[2.5rem] border-none shadow-lg p-6 bg-background min-h-[350px]">
          <CardHeader className="px-0 pt-0">
             <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Customer Traffic
             </CardTitle>
          </CardHeader>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[10, 10, 10, 10]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ✅ මීට අමතරව Recent Orders ටේබල් එකක් පහළින් දැම්මොත් පට්ට */}
      <Card className="rounded-[2.5rem] border-none shadow-lg p-8 bg-background">
         <h2 className="text-xl font-black uppercase italic tracking-tight mb-4">Recent Transactions</h2>
         <div className="text-muted-foreground font-medium italic text-sm text-center py-10 border-2 border-dashed rounded-[2rem]">
            No recent transactions to display.
         </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;