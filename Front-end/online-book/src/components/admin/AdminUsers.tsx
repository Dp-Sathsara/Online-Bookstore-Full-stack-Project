import { useState } from "react";
import { 
  Search, MoreVertical, ShieldCheck, UserMinus, 
  Mail, Calendar, Trash2, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const initialUsers = [
  { id: "U001", name: "Amila Perera", email: "amila@example.com", joined: "2025-10-12", role: "Customer", status: "Active" },
  { id: "U002", name: "Kavindi Silva", email: "kavindi@example.com", joined: "2025-11-05", role: "Admin", status: "Active" },
  { id: "U003", name: "Nimal Fernando", email: "nimal@example.com", joined: "2025-12-01", role: "Customer", status: "Suspended" },
  { id: "U004", name: "Sajith Maduranga", email: "sajith@example.com", joined: "2026-01-10", role: "Customer", status: "Active" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  // ✅ 1. Role එක Admin කිරීමට හෝ නැවත Customer කිරීමට
  const toggleRole = (id: string, currentRole: string) => {
    const newRole = currentRole === "Admin" ? "Customer" : "Admin";
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  // ✅ 2. Status එක Active/Suspended මාරු කිරීමට
  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  // ✅ 3. User කෙනෙක්ව ඉවත් කිරීමට
  const deleteUser = (id: string) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col space-y-1">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">User Management</h1>
        <p className="text-muted-foreground font-medium text-sm">Oversee your customer base and administrative roles.</p>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-10 h-12 rounded-2xl bg-background border-none shadow-sm font-bold focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="font-black px-4 py-2 border-primary/20 text-primary uppercase tracking-widest text-xs hidden md:block">
          {users.length} Registered Users
        </Badge>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-background">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-6">User Info</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Joined Date</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Role</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/20 border-muted/10 transition-colors group border-b border-muted/20">
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm border border-primary/5">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-black text-sm uppercase tracking-tight leading-none">{user.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-bold text-[11px] uppercase text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-sans tracking-tight">
                      <Calendar className="h-3.5 w-3.5" /> {user.joined}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge className={`${user.role === 'Admin' ? 'bg-purple-500 shadow-purple-200' : 'bg-blue-500 shadow-blue-200'} text-white border-none font-black uppercase text-[8px] px-3 py-1 rounded-full tracking-widest shadow-lg`}>
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="secondary" className={`${user.status === 'Active' ? 'text-green-600' : 'text-red-600'} font-black uppercase text-[8px] tracking-widest bg-transparent border-none`}>
                      <span className={`h-1.5 w-1.5 rounded-full mr-2 ${user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'} animate-pulse`} />
                      {user.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 font-sans rounded-[1.5rem] p-2 border-none shadow-2xl animate-in zoom-in-95">
                        <div className="px-3 py-2 text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-50">Manage Access</div>
                        
                        <DropdownMenuItem 
                          onClick={() => toggleRole(user.id, user.role)}
                          className="gap-3 font-bold uppercase text-[10px] tracking-widest cursor-pointer py-3 rounded-xl focus:bg-primary/10"
                        >
                           <ShieldCheck className="h-4 w-4 text-primary" /> {user.role === "Admin" ? "Remove Admin" : "Make Admin"}
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                          onClick={() => toggleStatus(user.id, user.status)}
                          className="gap-3 font-bold uppercase text-[10px] tracking-widest cursor-pointer py-3 rounded-xl focus:bg-orange-50 text-orange-600"
                        >
                           {user.status === "Active" ? <UserMinus className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                           {user.status === "Active" ? "Suspend User" : "Activate User"}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-muted/50" />

                        <DropdownMenuItem 
                          onClick={() => deleteUser(user.id)}
                          className="gap-3 font-bold uppercase text-[10px] tracking-widest cursor-pointer py-3 rounded-xl focus:bg-red-50 text-red-600"
                        >
                           <Trash2 className="h-4 w-4" /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;