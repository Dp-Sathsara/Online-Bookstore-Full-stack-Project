import { useState } from "react";
import { ContactService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactPage = () => {
    // const { addContactMessage } = useContentStore(); // Deprecated
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await ContactService.create(formData);
            toast.success("Message sent successfully!");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

                {/* Contact Info */}
                <div className="space-y-8 animate-in slide-in-from-left duration-500">
                    <div>
                        <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">Get in Touch</h1>
                        <p className="text-muted-foreground text-lg">
                            We'd love to hear from you. Fill out the form or reach out using the contact details below.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-card border shadow-sm">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Our Location</h3>
                                <p className="text-muted-foreground">123 Book Street, Reading City, RC 45678</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-card border shadow-sm">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Phone Number</h3>
                                <p className="text-muted-foreground">+1 (234) 567-890</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-card border shadow-sm">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Email Address</h3>
                                <p className="text-muted-foreground">hello@onlinebookstore.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-card p-8 rounded-2xl border shadow-lg animate-in slide-in-from-right duration-500">
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your Name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="How can we help?"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Tell us more..."
                                className="min-h-[150px]"
                            />
                        </div>

                        <Button type="submit" className="w-full gap-2 font-bold uppercase tracking-wide">
                            <Send className="h-4 w-4" /> Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
