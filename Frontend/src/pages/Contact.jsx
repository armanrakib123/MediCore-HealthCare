import React, { useState } from "react";
import api from "../api/api";
import "./Contact.css";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
        if (!form.subject.trim()) e.subject = "Subject is required";
        if (!form.message.trim()) e.message = "Message is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        setStatus(null);
        if (!validate()) return;
        setLoading(true);
        try {
            // adjust endpoint if your API expects a different path
            await api.post("/contact", { ...form });
            setStatus({ type: "success", message: "Message sent. We'll get back to you soon." });
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            console.error(err);
            setStatus({ type: "error", message: "Failed to send message. Try again later." });
        } finally {
            setLoading(false);
        }
    }

    function updateField(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <main className="contact-page">
            <div className="contact-container">
                <section className="contact-form-section">
                    <h1>Contact Us</h1>
                    <p className="lead">Have a question or feedback? Send us a message and we'll reply soon.</p>

                    <form className="contact-form" onSubmit={handleSubmit} noValidate>
                        <div className="field-row">
                            <div className="field">
                                <label htmlFor="name">Name</label>
                                <input id="name" name="name" value={form.name} onChange={updateField} />
                                {errors.name && <small className="error">{errors.name}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input id="email" name="email" value={form.email} onChange={updateField} />
                                {errors.email && <small className="error">{errors.email}</small>}
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="subject">Subject</label>
                            <input id="subject" name="subject" value={form.subject} onChange={updateField} />
                            {errors.subject && <small className="error">{errors.subject}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" rows="6" value={form.message} onChange={updateField} />
                            {errors.message && <small className="error">{errors.message}</small>}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                            {status && (
                                <div className={`status ${status.type}`}>
                                    {status.message}
                                </div>
                            )}
                        </div>
                    </form>
                </section>

                <aside className="contact-info">
                    <h2>Get in touch</h2>
                    <p><strong>Email:</strong> support@example.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Main St, Your City</p>
                    <div className="hours">
                        <h3>Business hours</h3>
                        <p>Mon — Fri: 9:00 — 17:00</p>
                        <p>Sat: 10:00 — 14:00</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
