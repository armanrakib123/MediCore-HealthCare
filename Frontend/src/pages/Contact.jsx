
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

        if (!form.email.trim()) {
            e.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ) {
            e.email = "Invalid email";
        }

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
            await api.post("/contact", { ...form });

            setStatus({
                type: "success",
                message: "Message sent. We'll get back to you soon."
            });

            setForm({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

            setErrors({});
        } catch (err) {
            console.error(err);

            setStatus({
                type: "error",
                message: "Failed to send message. Try again later."
            });
        } finally {
            setLoading(false);
        }
    }

    function updateField(e) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

        // Clear the field error while typing.
        if (errors[e.target.name]) {
            setErrors((prev) => ({
                ...prev,
                [e.target.name]: ""
            }));
        }
    }

    return (
        <main className="contact-page">
            <div className="contact-background-shape shape-one" />
            <div className="contact-background-shape shape-two" />

            <div className="contact-container">

                {/* Left: Contact Information */}
                <section className="contact-intro">

                    <div className="contact-badge">
                        <span>✉</span>
                        Contact Us
                    </div>

                    <h1>
                        Get in Touch with
                        <span>MediCore</span>
                    </h1>

                    <p className="contact-lead">
                        We're here to help! Whether you have a question,
                        need support, or want to share feedback, feel free
                        to reach out. Our team will get back to you as soon
                        as possible.
                    </p>

                    <div className="contact-details">

                        <div className="contact-detail-card">
                            <div className="detail-icon email-icon">✉</div>
                            <div>
                                <h3>Email Us</h3>
                                <a href="mailto:hellofriends420420@gmail.com">
                                    hellofriends420420@gmail.com
                                </a>
                                <p>We'll respond within 24 hours</p>
                            </div>
                        </div>

                        <div className="contact-detail-card">
                            <div className="detail-icon phone-icon">☎</div>
                            <div>
                                <h3>Call Us</h3>
                                <a href="tel:+15551234567">
                                    +8801727868832
                                </a>
                                <p>Mon – Fri, 9:00 AM – 5:00 PM</p>
                            </div>
                        </div>

                        <div className="contact-detail-card">
                            <div className="detail-icon location-icon">⌖</div>
                            <div>
                                <h3>Visit Our Office</h3>
                                <p className="detail-address">
                                    Mirpur, Dhaka
                                </p>
                                <p>We'd love to see you in person</p>
                            </div>
                        </div>

                    </div>

                    <div className="privacy-note">
                        <div className="privacy-icon">✓</div>
                        <div>
                            <h4>Your Privacy Matters</h4>
                            <p>
                                We respect your privacy and will never share
                                your personal information with third parties.
                            </p>
                        </div>
                    </div>

                </section>

                {/* Right: Contact Form */}
                <section className="contact-form-section">

                    <div className="form-badge">
                        Send us a Message
                    </div>

                    <h2>How can we help you?</h2>

                    <p className="form-description">
                        Fill out the form below and we'll get back to you shortly.
                    </p>

                    <form
                        className="contact-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <div className="field-row">

                            <div className="field">
                                <label htmlFor="name">
                                    Name <span>*</span>
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Your full name"
                                    value={form.name}
                                    onChange={updateField}
                                    className={errors.name ? "input-error" : ""}
                                />

                                {errors.name && (
                                    <small className="error">
                                        {errors.name}
                                    </small>
                                )}
                            </div>

                            <div className="field">
                                <label htmlFor="email">
                                    Email <span>*</span>
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={updateField}
                                    className={errors.email ? "input-error" : ""}
                                />

                                {errors.email && (
                                    <small className="error">
                                        {errors.email}
                                    </small>
                                )}
                            </div>

                        </div>

                        <div className="field">
                            <label htmlFor="subject">
                                Subject <span>*</span>
                            </label>

                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                placeholder="What can we help you with?"
                                value={form.subject}
                                onChange={updateField}
                                className={errors.subject ? "input-error" : ""}
                            />

                            {errors.subject && (
                                <small className="error">
                                    {errors.subject}
                                </small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="message">
                                Message <span>*</span>
                            </label>

                            <textarea
                                id="message"
                                name="message"
                                rows="6"
                                maxLength="1000"
                                placeholder="Type your message here..."
                                value={form.message}
                                onChange={updateField}
                                className={errors.message ? "input-error" : ""}
                            />

                            {errors.message && (
                                <small className="error">
                                    {errors.message}
                                </small>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="button-spinner" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span>➤</span>
                                        Send Message
                                        <span className="button-arrow"></span>
                                    </>
                                )}
                            </button>

                            {status && (
                                <div
                                    className={`status ${status.type}`}
                                    role="status"
                                >
                                    {status.message}
                                </div>
                            )}
                        </div>

                        <p className="form-security">
                            <span>🔒</span>
                            Your information is safe with us.
                        </p>

                    </form>
                </section>

            </div>
        </main>
    );
}