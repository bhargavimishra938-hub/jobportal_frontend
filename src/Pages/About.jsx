import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const About = () => {
  const highlights = [
    {
      icon: Search,
      title: "Find the right fit",
      text: "Search opportunities by skills, location, category and work mode.",
    },
    {
      icon: ShieldCheck,
      title: "Built around trust",
      text: "Clear job information and a secure experience for every user.",
    },
    {
      icon: Users,
      title: "People first",
      text: "Helping candidates and recruiters connect with less friction.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        <section className="overflow-hidden bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                <BriefcaseBusiness size={16} />
                About JobPortal
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
                Better connections between talent and opportunity.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                JobPortal makes finding work and hiring talent simpler. We bring
                useful tools, relevant jobs and practical career guidance into one
                focused experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/jobs" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
                  Explore jobs <ArrowRight size={17} />
                </Link>
                <Link to="/contact" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600">
                  Talk to us
                </Link>
              </div>
            </div>

            <div className="relative rounded-3xl bg-blue-600 p-7 text-white shadow-2xl shadow-blue-200 sm:p-10">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/30 blur-2xl" />
              <p className="relative text-sm font-semibold text-blue-100">Our purpose</p>
              <h2 className="relative mt-4 text-3xl font-bold leading-tight">Make the next career move feel clear.</h2>
              <div className="relative mt-8 space-y-4 text-sm text-blue-50">
                {["Relevant opportunities", "Helpful career resources", "A smoother hiring journey"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={19} className="shrink-0 text-cyan-200" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-600">What we focus on</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">A calmer way to move forward.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={23} /></div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;