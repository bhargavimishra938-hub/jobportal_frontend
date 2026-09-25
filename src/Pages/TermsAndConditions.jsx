import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileCheck2, Scale } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const TermsAndConditions = () => {
  const sections = [
    ["Using JobPortal", "You may use JobPortal to search for jobs, apply to opportunities, create a candidate profile, recruit talent and manage related account activity. You must provide accurate information and use the platform lawfully."],
    ["Accounts and security", "You are responsible for keeping your login details secure and for activity under your account. Do not share access, impersonate another person or create an account using misleading information."],
    ["Job listings and applications", "Recruiters are responsible for the accuracy and legality of their listings. Candidates are responsible for reviewing opportunities carefully and submitting truthful application information."],
    ["Acceptable conduct", "Do not misuse the platform, scrape data, upload harmful content, send spam, discriminate, harass other users or attempt to access another user’s account or private information."],
    ["Content and ownership", "You retain rights to content you submit, while granting JobPortal permission to display and process it as needed to provide the service. JobPortal branding and software remain protected property."],
    ["Service availability", "We work to keep the platform available and useful, but features may change, be paused or be unavailable for maintenance. We are not responsible for decisions made solely from information on the platform."],
    ["Changes and contact", "We may update these terms as the service evolves. Continued use after an update means you accept the revised terms. For questions, contact our support team."],
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><FileCheck2 size={24} /></div>
              <p className="mt-6 text-sm font-semibold text-blue-600">Clear expectations</p>
              <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Terms & Conditions</h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">These terms describe the rules for using JobPortal and help keep the community useful for candidates and recruiters.</p>
              <p className="mt-4 text-sm font-medium text-slate-400">Last updated: September 22, 2026</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8 lg:py-16">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick links</p>
            <nav className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
              {sections.map(([title]) => <a key={title} href={`#${title.toLowerCase().replaceAll(" ", "-")}`} className="block hover:text-blue-600">{title}</a>)}
            </nav>
          </aside>
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="mb-8 flex items-start gap-3 rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-blue-800"><Scale className="mt-0.5 shrink-0 text-blue-600" size={20} /> Please read these terms before creating an account or using our services.</div>
            <div className="space-y-10">
              {sections.map(([title, text], index) => <section key={title} id={title.toLowerCase().replaceAll(" ", "-")}><p className="text-sm font-semibold text-blue-600">0{index + 1}</p><h2 className="mt-2 text-xl font-bold">{title}</h2><p className="mt-3 leading-8 text-slate-600">{text}</p></section>)}
            </div>
            <div className="mt-10 border-t border-slate-200 pt-6"><p className="text-sm text-slate-500">Need clarification about these terms?</p><Link to="/contact" className="mt-2 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700">Contact our team <ArrowRight size={16} /></Link></div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;