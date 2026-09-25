import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const PrivacyPolicy = () => {
  const sections = [
    ["Information we collect", "We collect account details such as your name, email address, phone number and role. We also collect information you choose to add to your profile, resume, company profile or job listing."],
    ["How we use information", "Your information helps us provide job search, applications, recruiter tools, messaging and account support. We use it to improve the platform, prevent misuse and communicate important service updates."],
    ["Information sharing", "Candidate information is shared with recruiters when you apply or choose to connect. Recruiter job and company information may be visible to candidates. We do not sell personal information."],
    ["Data security", "We use reasonable technical and organisational safeguards to protect your account information. Please keep your password private and contact us if you notice suspicious activity."],
    ["Your choices", "You can review and update your profile information from your account. You may also contact us to ask about your personal data or request account closure, subject to records we must retain by law."],
    ["Cookies and analytics", "We may use essential browser storage and basic analytics to keep the platform working, understand usage and improve the experience. You can control cookies through your browser settings."],
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><LockKeyhole size={24} /></div>
              <p className="mt-6 text-sm font-semibold text-blue-600">Your privacy matters</p>
              <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Privacy Policy</h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">This policy explains what information JobPortal collects, how we use it and the choices available to you.</p>
              <p className="mt-4 text-sm font-medium text-slate-400">Last updated: September 22, 2026</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8 lg:py-16">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">On this page</p>
            <nav className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
              {sections.map(([title]) => <a key={title} href={`#${title.toLowerCase().replaceAll(" ", "-")}`} className="block hover:text-blue-600">{title}</a>)}
            </nav>
          </aside>
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="mb-8 flex items-start gap-3 rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-blue-800"><ShieldCheck className="mt-0.5 shrink-0 text-blue-600" size={20} /> We aim to keep your information useful, secure and under your control.</div>
            <div className="space-y-10">
              {sections.map(([title, text], index) => <section key={title} id={title.toLowerCase().replaceAll(" ", "-")}><p className="text-sm font-semibold text-blue-600">0{index + 1}</p><h2 className="mt-2 text-xl font-bold">{title}</h2><p className="mt-3 leading-8 text-slate-600">{text}</p></section>)}
            </div>
            <div className="mt-10 border-t border-slate-200 pt-6"><p className="text-sm text-slate-500">Questions about privacy?</p><Link to="/contact" className="mt-2 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700">Contact our team <ArrowRight size={16} /></Link></div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;