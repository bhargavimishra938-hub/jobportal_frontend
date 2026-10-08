import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  LockKeyhole,
  Mail,
  MessageSquare,
  Scale,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

const PRIVACY_SECTIONS = [
  {
    id: "information-we-collect",
    number: "01",
    title: "Information We Collect",
    icon: UserRound,
    content: [
      {
        heading: "Account information",
        text: "When you create an account, we may collect information such as your name, email address, phone number, password, account role and other information required to provide our services.",
      },
      {
        heading: "Candidate information",
        text: "Candidates may choose to provide professional information such as location, education, skills, work experience, projects, resume, LinkedIn profile, GitHub profile, portfolio and professional preferences.",
      },
      {
        heading: "Recruiter and company information",
        text: "Recruiters and companies may provide company name, company contact information, company description, website, logo, job listings, hiring requirements and other information needed to use employer features.",
      },
      {
        heading: "Application information",
        text: "When you apply for a job, we may collect the information submitted as part of your application, including your resume, cover letter and application-related information.",
      },
      {
        heading: "Technical information",
        text: "We may collect limited technical information such as browser type, device information, IP address, pages visited and basic usage information to operate, secure and improve the platform.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    number: "02",
    title: "How We Use Your Information",
    icon: ShieldCheck,
    content: [
      {
        heading: "Providing the service",
        text: "We use your information to create and maintain your account, provide job search functionality, process applications, support recruiter tools, enable messaging and provide other features available through JobPortal.",
      },
      {
        heading: "Connecting candidates and recruiters",
        text: "Information you choose to make available may be used to help candidates discover relevant opportunities and help recruiters evaluate candidates for their job requirements.",
      },
      {
        heading: "Communication",
        text: "We may use your contact information to send account notifications, application updates, security alerts, service announcements and other important communications related to your use of the platform.",
      },
      {
        heading: "Security and fraud prevention",
        text: "We may process information to detect suspicious activity, prevent unauthorized access, investigate misuse and protect candidates, recruiters and the platform.",
      },
      {
        heading: "Improving JobPortal",
        text: "We may use aggregated or appropriately protected usage information to understand how our services are used, troubleshoot problems and improve features, performance and user experience.",
      },
    ],
  },
  {
    id: "how-information-is-shared",
    number: "03",
    title: "How Information Is Shared",
    icon: Users,
    content: [
      {
        heading: "When you apply for a job",
        text: "When you submit a job application, the information included in your application may be made available to the relevant recruiter or company so they can evaluate your application.",
      },
      {
        heading: "Candidate profiles",
        text: "Depending on your profile visibility settings and the features you use, professional profile information may be visible to recruiters using JobPortal.",
      },
      {
        heading: "Recruiter and company information",
        text: "Job listings and approved company information may be displayed to candidates and other visitors as part of the normal operation of the platform.",
      },
      {
        heading: "Service providers",
        text: "We may use trusted service providers to support hosting, infrastructure, email delivery, security, analytics and other operational requirements. These providers should only receive information necessary for their services.",
      },
      {
        heading: "Legal and safety requirements",
        text: "We may disclose information where reasonably necessary to comply with applicable law, legal process, enforce our terms, protect the rights and safety of users or investigate suspected fraud or abuse.",
      },
      {
        heading: "We do not sell personal information",
        text: "JobPortal does not sell your personal information as a product to third parties.",
      },
    ],
  },
  {
    id: "applications-and-messaging",
    number: "04",
    title: "Applications, Messaging and Recruiter Interactions",
    icon: MessageSquare,
    content: [
      {
        heading: "Job applications",
        text: "When you apply for a position, your application information is associated with that job and may be reviewed by the recruiter or company responsible for the position.",
      },
      {
        heading: "Application status",
        text: "JobPortal may display application status information such as Applied, Under Review, Shortlisted, Interview Scheduled, Hired or Rejected when those statuses are provided or updated by the relevant recruiter or platform administrator.",
      },
      {
        heading: "Messaging",
        text: "Messages sent through JobPortal may be stored and processed so that candidates and recruiters can communicate about job opportunities, applications and recruitment activities.",
      },
      {
        heading: "Recruiter invitations",
        text: "If recruiters use candidate discovery or invitation features, information required for the invitation may be processed to notify the candidate and support the recruitment interaction.",
      },
    ],
  },
  {
    id: "profile-visibility-and-controls",
    number: "05",
    title: "Profile Visibility and Your Controls",
    icon: LockKeyhole,
    content: [
      {
        heading: "Profile visibility",
        text: "Where JobPortal provides profile visibility controls, candidates can choose whether their professional profile should be available to recruiters through candidate discovery features.",
      },
      {
        heading: "Profile updates",
        text: "You can review and update available account and professional profile information through your account settings and profile pages.",
      },
      {
        heading: "Resume and professional links",
        text: "You control the information you choose to add to your resume, LinkedIn, GitHub, portfolio and other professional profile fields. Avoid adding sensitive information that is not necessary for your job search.",
      },
      {
        heading: "Account closure",
        text: "You may request closure of your account. Certain information may need to be retained for legitimate business, security, legal or record-keeping purposes.",
      },
    ],
  },
  {
    id: "cookies-and-technology",
    number: "06",
    title: "Cookies and Similar Technologies",
    icon: FileText,
    content: [
      {
        heading: "Essential storage",
        text: "JobPortal may use browser storage, cookies or similar technologies that are necessary to maintain sessions, remember account preferences and provide core platform functionality.",
      },
      {
        heading: "Analytics",
        text: "We may use basic analytics or similar technologies to understand general usage patterns, diagnose technical issues and improve the platform.",
      },
      {
        heading: "Your browser controls",
        text: "Most browsers allow you to manage cookies and related storage through their settings. Disabling certain technologies may affect some features of the platform.",
      },
    ],
  },
  {
    id: "data-security",
    number: "07",
    title: "Data Security",
    icon: ShieldCheck,
    content: [
      {
        heading: "Reasonable safeguards",
        text: "We use reasonable technical and organizational safeguards designed to protect information from unauthorized access, alteration, disclosure or destruction.",
      },
      {
        heading: "Account security",
        text: "You are responsible for keeping your password and account credentials confidential. Please use a strong password and avoid sharing your login information with others.",
      },
      {
        heading: "Security incidents",
        text: "No internet service can guarantee absolute security. If you believe your account has been compromised or notice suspicious activity, contact us as soon as possible.",
      },
    ],
  },
  {
    id: "data-retention",
    number: "08",
    title: "Data Retention",
    icon: Clock3,
    content: [
      {
        heading: "How long we keep information",
        text: "We retain information for as long as reasonably necessary to provide our services, maintain business and application records, meet legal obligations, resolve disputes and enforce our agreements.",
      },
      {
        heading: "Inactive accounts",
        text: "Information associated with inactive accounts may be retained for legitimate operational, security or legal purposes and may be deleted or anonymized when no longer required.",
      },
      {
        heading: "Application records",
        text: "Job application and recruitment records may be retained for an appropriate period to support application history, platform security, dispute resolution and legal or business requirements.",
      },
    ],
  },
  {
    id: "your-rights",
    number: "09",
    title: "Your Privacy Choices and Rights",
    icon: Scale,
    content: [
      {
        heading: "Access and correction",
        text: "You may review available information in your account and request correction of inaccurate or incomplete personal information where appropriate.",
      },
      {
        heading: "Deletion requests",
        text: "You may contact us to request deletion or closure of your account. Some information may need to be retained where required by law or where there is a legitimate reason to maintain the record.",
      },
      {
        heading: "Communication preferences",
        text: "You may manage available communication preferences. Some service-related communications, such as security or important account notices, may still be necessary.",
      },
      {
        heading: "Privacy questions",
        text: "If you have questions about how your information is handled or want to make a privacy-related request, please contact the JobPortal support team.",
      },
    ],
  },
  {
    id: "children-privacy",
    number: "10",
    title: "Children's Privacy",
    icon: Info,
    content: [
      {
        heading: "Age requirement",
        text: "JobPortal is intended for people who are legally able to use employment and recruitment services. We do not knowingly seek to collect personal information from children who are not permitted to use the service under applicable law.",
      },
      {
        heading: "If you believe a child provided information",
        text: "If you believe that a child has provided personal information to us without appropriate authorization, please contact us so that we can review the situation and take appropriate action.",
      },
    ],
  },
  {
    id: "policy-changes",
    number: "11",
    title: "Changes to This Privacy Policy",
    icon: FileText,
    content: [
      {
        heading: "Policy updates",
        text: "We may update this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements or privacy practices.",
      },
      {
        heading: "Effective date",
        text: "When changes are made, the updated version will be published on this page with a revised 'Last updated' date. We encourage you to review this page periodically.",
      },
    ],
  },
];

const getSectionIcon = (Icon) => {
  if (!Icon) return ShieldCheck;
  return Icon;
};

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(
    PRIVACY_SECTIONS[0]?.id || "",
  );
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500);

      const sections = PRIVACY_SECTIONS.map((section) =>
        document.getElementById(section.id),
      ).filter(Boolean);

      let currentSection = PRIVACY_SECTIONS[0]?.id || "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= 160) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (!element) return;

    const offset = 105;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });

    setActiveSection(id);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* =========================================================
            HERO
        ========================================================== */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-100/50 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            {/* Breadcrumb */}
            <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
              <Link to="/" className="transition hover:text-blue-600">
                Home
              </Link>

              <ChevronRight size={15} />

              <span className="font-medium text-slate-800">Privacy Policy</span>
            </div>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <LockKeyhole size={16} />
                Privacy & Data Protection
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Privacy Policy
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                This Privacy Policy explains what information JobPortal
                collects, why we use it, how it may be shared and the choices
                available to you when you use our job search and recruitment
                platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
                  <Clock3 size={17} className="text-blue-600" />
                  Last updated: September 22, 2026
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
                  <FileText size={17} className="text-blue-600" />
                  {PRIVACY_SECTIONS.length} sections
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            MAIN CONTENT
        ========================================================== */}
        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-8 lg:py-16">
          {/* =======================================================
              SIDEBAR
          ======================================================== */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Privacy Guide
                </p>

                <h2 className="mt-2 text-lg font-bold text-slate-900">
                  On this page
                </h2>
              </div>

              <nav className="space-y-1">
                {PRIVACY_SECTIONS.map((section) => {
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 text-xs font-bold ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-blue-500"
                        }`}
                      >
                        {section.number}
                      </span>

                      <span className="leading-5">{section.title}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Contact box */}
              <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Mail size={19} />
                </div>

                <h3 className="mt-4 font-bold">Have a privacy question?</h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Contact our team if you have a question about your personal
                  information or privacy choices.
                </p>

                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-blue-300"
                >
                  Contact us
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </aside>

          {/* =======================================================
              ARTICLE
          ======================================================== */}
          <article className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Important notice */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Your privacy matters
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    We aim to collect only the information needed to provide,
                    secure and improve JobPortal and to give you meaningful
                    control over the information you choose to share.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                  Privacy at JobPortal
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  We want you to understand how your information is handled.
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  JobPortal is a platform that helps candidates discover job
                  opportunities and enables recruiters and companies to manage
                  hiring activities. Because these services involve professional
                  and personal information, we take privacy and responsible data
                  handling seriously.
                </p>

                <p className="mt-4 leading-8 text-slate-600">
                  This policy describes our general approach to information
                  collected through JobPortal. By using the platform, you should
                  review this policy together with our Terms & Conditions and
                  any other notices presented when specific features are used.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {PRIVACY_SECTIONS.map((section, index) => {
                  const Icon = getSectionIcon(section.icon);

                  return (
                    <section
                      key={section.id}
                      id={section.id}
                      className={`scroll-mt-28 ${
                        index !== 0 ? "border-t border-slate-200 pt-12" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Icon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-bold text-blue-600">
                              {section.number}
                            </span>

                            <span className="h-1 w-1 rounded-full bg-slate-300" />

                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Privacy
                            </span>
                          </div>

                          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                            {section.title}
                          </h2>
                        </div>
                      </div>

                      <div className="mt-7 space-y-6 pl-0 sm:pl-[60px]">
                        {section.content.map((item) => (
                          <div key={item.heading}>
                            <h3 className="flex items-start gap-2 text-base font-bold text-slate-900">
                              <CheckCircle2
                                size={18}
                                className="mt-0.5 shrink-0 text-blue-600"
                              />

                              {item.heading}
                            </h3>

                            <p className="mt-2 text-[15px] leading-8 text-slate-600">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>

              {/* Final note */}
              <div className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Info size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Important
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      This Privacy Policy describes JobPortal's intended privacy
                      practices and may be updated as the platform, features or
                      applicable requirements change. Please review the latest
                      version periodically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="mt-10 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                      <Mail size={17} />
                      Privacy support
                    </div>

                    <h2 className="mt-3 text-2xl font-black">
                      Have questions about your data?
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                      If you need help understanding how your information is
                      used or want to make a privacy-related request, our
                      support team can help.
                    </p>
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-blue-50"
                  >
                    Contact Support
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>

              {/* Bottom links */}
              <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-7 text-sm sm:flex-row sm:items-center sm:justify-between">
               
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/terms"
                    className="font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Terms & Conditions
                  </Link>

                  <Link
                    to="/contact"
                    className="font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>

      <Footer />

      {/* Back to top */}
      {showTopButton && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-600"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default PrivacyPolicy;
