'use client';
import {ChangeEvent, useState} from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState({ message: ""});
    const apiUrl = process.env.NODE_ENV === "development"
        ? "http://localhost:5001/contact"
        : process.env.NEXT_PUBLIC_API_GATEWAY_URL;

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);

        const contactData = {
            contact: {
                email: formData.email,
                name: formData.name,
                message: formData.message
            }
        };

        if (!apiUrl) {
            setSuccess({ message: "Set NEXT_PUBLIC_API_GATEWAY_URL"})
            return
        }

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactData)
            });

            const result = await response.json();
            if (result.success) {
                setSuccess({ message: result.message });
                setFormData({ name: "", email: "", message: "" });
            } else {
                setSuccess({ message: "Failed to send message." });
            }
        } catch (error) {
            setSuccess({ message: "Error sending message." + error} );
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
            <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">Contact Us</h2>
                <p className="row-auto w-full text-center">
                    The Stable<br/>
                    3-6 Wadham St<br/>
                    Weston-super-Mare<br/>
                    BS23 1JY
                </p>
                <br/>
                {success && <p className="text-center text-green-500 mb-4">{success.message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="border-b-2 mr-2"
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border-b-2"
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        className="border-2 w-full"
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="w-full bg-green-50" disabled={loading}>
                        {loading ? "Sending...": "Send Message"}
                    </button>
                </form>
            </div>
        </div>
    );
}
