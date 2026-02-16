import { useState, useEffect } from "react";
import { ContactService, type Contact } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Mail } from "lucide-react";
import { toast } from "sonner";

const AdminContactMessages = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await ContactService.getAll();
            setContacts(data);
        } catch (error) {
            console.error("Failed to fetch contact messages:", error);
            toast.error("Failed to fetch contact messages");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this message?")) {
            try {
                await ContactService.delete(id);
                toast.success("Message deleted");
                fetchContacts();
            } catch (error) {
                console.error("Failed to delete message:", error);
                toast.error("Failed to delete message");
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tight">Contact Messages</h1>
            </div>

            <div className="bg-card rounded-xl border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && contacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                            </TableRow>
                        ) : contacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell className="text-muted-foreground text-sm">{contact.date || 'N/A'}</TableCell>
                                <TableCell className="font-medium">{contact.name}</TableCell>
                                <TableCell>
                                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-primary hover:underline">
                                        <Mail className="h-3 w-3" /> {contact.email}
                                    </a>
                                </TableCell>
                                <TableCell>{contact.subject}</TableCell>
                                <TableCell className="max-w-md truncate" title={contact.message}>
                                    {contact.message}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(contact.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!loading && contacts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No messages found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminContactMessages;
