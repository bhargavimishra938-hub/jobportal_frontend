import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  LifeBuoy,
  Mail,
  MessageCircle,
  Search,
  ShieldQuestion,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const HelpsAndSupport = () => {
  const [search, setSearch] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    ["How do I search for a job?", "Open Find Jobs from the navigation, then search by title, company, skill, location or category. You can also use the filters to narrow the results."],
    ["How do I apply for a job?", "Open a job detail page and select Apply Now. You may need to sign in as a candidate and complete your profile before applying."],
    ["How can I save a job?", "Sign in as a candidate and use the save icon on a job card or job details page. Saved jobs are available from the Saved Jobs section."],
    ["How do recruiters post a job?", "Recruiters can sign in, open the Recruiter Panel and choose Post a Job. Add the role details, required skills and publish the listing."],
    ["I forgot my password. What should I do?", "Use Forgot Password on the login page. Enter your registered email and phone number, then create a new password."],
    ["How do I contact support?", "Send us your question through the Contact Us page. Include your account email and enough detail for us to understand the issue."],
  ];

  const filteredFaqs = useMemo(() => {
    const value = search.trim().toLowerCase();
    return faqs.filter(([question, answer]) => !value || `${question} ${answer}`.toLowerCase().includes(value));
  }, [search]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><LifeBuoy size={28} /></div>
              <p className="mt-6 text-sm font-semibold text-blue-600">Support centre</p>
              <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">How can we help?</h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">Find quick answers about jobs, applications, accounts and recruiting on JobPortal.</p>
              <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/60 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                <Search className="ml-3 shrink-0 text-slate-400" size={20} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search help articles..." className="w-full bg-transparent px-2 py-3 outline-none" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [BookOpen, "Getting started", "Learn the basics of finding jobs and managing your profile."],
              [MessageCircle, "Account support", "Get help with login, password reset and account details."],
              [ShieldQuestion, "Safety and trust", "Understand how to use the platform responsibly and safely."],
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={21} /></div>
                <h2 className="mt-5 text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-blue-600">Common questions</p><h2 className="mt-1 text-2xl font-bold">Frequently asked questions</h2></div><span className="text-sm text-slate-400">{filteredFaqs.length} results</span></div>
              <div className="space-y-3">
                {filteredFaqs.map(([question, answer], index) => {
                  const isOpen = openQuestion === index;
                  return <div key={question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><button type="button" onClick={() => setOpenQuestion(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-slate-800"><span>{question}</span><ChevronDown size={19} className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180 text-blue-600" : ""}`} /></button>{isOpen && <p className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600">{answer}</p>}</div>;
                })}
                {filteredFaqs.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">No help articles match your search.</div>}
              </div>
            </div>

            <aside className="h-fit rounded-3xl bg-blue-600 p-6 text-white shadow-lg shadow-blue-600/20">
              <Mail size={28} className="text-blue-100" />
              <h2 className="mt-5 text-xl font-bold">Still need help?</h2>
              <p className="mt-2 text-sm leading-6 text-blue-100">Our team is ready to help with account, job or hiring questions.</p>
              <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">Contact support <ArrowRight size={16} /></Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpsAndSupport;