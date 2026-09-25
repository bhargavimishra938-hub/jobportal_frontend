import React, { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-blue-600">We are here to help</p>
              <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Let&apos;s talk.</h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                Have a question about jobs, hiring or your account? Send us a
                message and our team will get back to you.
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="space-y-4">
                {[
                  [Mail, "Email us", "support@jobportal.com"],
                  [Phone, "Call us", "+91 98765 43210"],
                  [MapPin, "Visit us", "Lucknow, India"],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Icon size={20} /></div>
                    <div><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-800">{value}</p></div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                {submitted && <div className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">Thanks! Your message has been received.</div>}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-700">Your name</label><input id="contact-name" name="name" required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
                  <div><label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><input id="contact-email" name="email" type="email" required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
                </div>
                <div className="mt-5"><label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-slate-700">Subject</label><input id="contact-subject" name="subject" required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
                <div className="mt-5"><label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-slate-700">Message</label><textarea id="contact-message" name="message" rows={5} required className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
                <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"><Send size={17} /> Send message</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;