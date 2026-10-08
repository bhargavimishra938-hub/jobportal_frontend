import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  FileCheck2,
  Scale,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Clock3,
  Mail,
  ExternalLink,
  ArrowUp,
} from "lucide-react";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

// =========================================================
// TERMS DATA
// =========================================================

const TERMS_SECTIONS = [
  {
    title: "Using JobPortal",
    description:
      "You may use JobPortal to search for jobs, apply to opportunities, create a candidate profile, recruit talent and manage related account activity. You must provide accurate information and use the platform lawfully.",
    icon: BookOpen,
  },

  {
    title: "Accounts and security",
    description:
      "You are responsible for keeping your login details secure and for activity under your account. Do not share access, impersonate another person or create an account using misleading information.",
    icon: ShieldCheck,
  },

  {
    title: "Job listings and applications",
    description:
      "Recruiters are responsible for the accuracy and legality of their listings. Candidates are responsible for reviewing opportunities carefully and submitting truthful application information.",
    icon: CheckCircle2,
  },

  {
    title: "Acceptable conduct",
    description:
      "Do not misuse the platform, scrape data, upload harmful content, send spam, discriminate, harass other users or attempt to access another user’s account or private information.",
    icon: ShieldCheck,
  },

  {
    title: "Content and ownership",
    description:
      "You retain rights to content you submit, while granting JobPortal permission to display and process it as needed to provide the service. JobPortal branding and software remain protected property.",
    icon: FileCheck2,
  },

  {
    title: "Service availability",
    description:
      "We work to keep the platform available and useful, but features may change, be paused or be unavailable for maintenance. We are not responsible for decisions made solely from information on the platform.",
    icon: Clock3,
  },

  {
    title: "Changes and contact",
    description:
      "We may update these terms as the service evolves. Continued use after an update means you accept the revised terms. For questions, contact our support team.",
    icon: Mail,
  },
];

// =========================================================
// HELPERS
// =========================================================

const getSectionId = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// =========================================================
// COMPONENT
// =========================================================

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] =
    useState("");

  const [showTopButton, setShowTopButton] =
    useState(false);

  // =======================================================
  // SECTION IDS
  // =======================================================

  const sectionIds = useMemo(() => {
    return TERMS_SECTIONS.map((section) => ({
      ...section,
      id: getSectionId(section.title),
    }));
  }, []);

  // =======================================================
  // SCROLL LISTENER
  // =======================================================

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(
        window.scrollY > 500
      );

      let currentSection = "";

      sectionIds.forEach((section) => {
        const element =
          document.getElementById(
            section.id
          );

        if (!element) return;

        const rect =
          element.getBoundingClientRect();

        if (
          rect.top <= 180 &&
          rect.bottom >= 120
        ) {
          currentSection = section.id;
        }
      });

      if (currentSection) {
        setActiveSection(
          currentSection
        );
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [sectionIds]);

  // =======================================================
  // SCROLL TO SECTION
  // =======================================================

  const scrollToSection = (id) => {
    const element =
      document.getElementById(id);

    if (!element) return;

    const headerOffset = 110;

    const elementPosition =
      element.getBoundingClientRect()
        .top + window.scrollY;

    window.scrollTo({
      top:
        elementPosition -
        headerOffset,
      behavior: "smooth",
    });

    setActiveSection(id);
  };

  // =======================================================
  // SCROLL TOP
  // =======================================================

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">

      <Header />

      <main className="flex-1">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden bg-slate-950">

          {/* Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.18),transparent_30%)]" />

          <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">

            <div className="max-w-4xl">

              {/* Breadcrumb */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">

                <Link
                  to="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>

                <ChevronRight
                  size={15}
                />

                <span className="text-slate-300">
                  Terms & Conditions
                </span>

              </div>

              {/* Icon */}
              <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-blue-300 shadow-xl backdrop-blur">
                <FileCheck2
                  size={30}
                />
              </div>

              {/* Label */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-200">
                <Scale size={14} />
                Legal & Platform Guidelines
              </div>

              {/* Heading */}
              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Terms &{" "}
                <span className="text-blue-400">
                  Conditions
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                These terms describe the rules for
                using JobPortal and help keep the
                platform useful, secure and
                respectful for candidates and
                recruiters.
              </p>

              {/* Meta */}
              <div className="mt-7 flex flex-wrap items-center gap-3">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                  <Clock3
                    size={14}
                    className="text-blue-400"
                  />
                  Last updated: September 22,
                  2026
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                  <FileCheck2
                    size={14}
                    className="text-emerald-400"
                  />
                  {TERMS_SECTIONS.length} sections
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-8 lg:py-16">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="h-fit lg:sticky lg:top-24">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* Sidebar Header */}
              <div className="border-b border-slate-100 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BookOpen
                      size={19}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      On this page
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Quick navigation
                    </p>
                  </div>

                </div>

              </div>

              {/* Navigation */}
              <nav className="p-3">

                {sectionIds.map(
                  (section, index) => {
                    const active =
                      activeSection ===
                      section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() =>
                          scrollToSection(
                            section.id
                          )
                        }
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                          active
                            ? "bg-blue-50 font-bold text-blue-700"
                            : "font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                      >

                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                            active
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                          }`}
                        >
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="min-w-0 flex-1 truncate">
                          {section.title}
                        </span>

                        <ChevronRight
                          size={14}
                          className={`shrink-0 transition-transform ${
                            active
                              ? "translate-x-0 text-blue-600"
                              : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-blue-500"
                          }`}
                        />

                      </button>
                    );
                  }
                )}

              </nav>

              {/* Contact CTA */}
              <div className="border-t border-slate-100 p-4">

                <div className="rounded-2xl bg-slate-950 p-4 text-white">

                  <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Need help?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Have questions about
                    these terms?
                  </p>

                  <Link
                    to="/contact"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-blue-300"
                  >
                    Contact us
                    <ArrowRight
                      size={15}
                    />
                  </Link>

                </div>

              </div>

            </div>
          </aside>

          {/* =================================================
              TERMS ARTICLE
          ================================================= */}

          <article className="min-w-0">

            {/* Important Notice */}
            <div className="mb-8 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">

              <div className="flex gap-4 p-6 sm:p-7">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Scale
                    size={21}
                  />
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Please read before using
                    JobPortal
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Please read these terms before
                    creating an account, applying for
                    jobs, posting jobs or using any
                    other JobPortal service.
                  </p>

                </div>

              </div>

            </div>

            {/* Article */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="p-6 sm:p-8 lg:p-10">

                {/* Intro */}
                <div className="border-b border-slate-100 pb-8">

                  <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                    JobPortal Terms
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                    Rules for using our
                    platform
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                    These guidelines are intended to
                    make JobPortal a reliable place
                    for candidates looking for
                    opportunities and recruiters
                    looking for talent.
                  </p>

                </div>

                {/* Sections */}
                <div className="divide-y divide-slate-100">

                  {sectionIds.map(
                    (
                      section,
                      index
                    ) => {
                      const Icon =
                        section.icon;

                      return (
                        <section
                          key={
                            section.id
                          }
                          id={
                            section.id
                          }
                          className="scroll-mt-28 py-9 first:pt-8 last:pb-2"
                        >

                          <div className="flex gap-5">

                            {/* Number/Icon */}
                            <div className="hidden shrink-0 sm:block">

                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <Icon
                                  size={21}
                                />
                              </div>

                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1">

                              <div className="flex items-center gap-3">

                                <span className="text-xs font-black tracking-wider text-blue-600">
                                  {String(
                                    index +
                                      1
                                  ).padStart(
                                    2,
                                    "0"
                                  )}
                                </span>

                                <span className="h-px w-8 bg-blue-100" />

                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                  Section
                                </span>

                              </div>

                              <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">
                                {
                                  section.title
                                }
                              </h2>

                              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">
                                {
                                  section.description
                                }
                              </p>

                            </div>

                          </div>

                        </section>
                      );
                    }
                  )}

                </div>

                {/* Bottom CTA */}
                <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">

                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <div className="flex items-center gap-2 text-blue-300">
                        <Mail
                          size={17}
                        />

                        <span className="text-sm font-bold">
                          Need clarification?
                        </span>
                      </div>

                      <h3 className="mt-2 text-xl font-black">
                        We're here to help.
                      </h3>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                        If you have questions about
                        these terms or how JobPortal
                        works, contact our support
                        team.
                      </p>

                    </div>

                    <Link
                      to="/contact"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                    >
                      Contact our team

                      <ArrowRight
                        size={16}
                      />
                    </Link>

                  </div>

                </div>

              </div>

            </div>

            {/* Footer Legal Note */}
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <FileCheck2
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Terms & Conditions
                  </p>

                  <p className="text-xs text-slate-400">
                    Last updated September 22,
                    2026
                  </p>
                </div>

              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                Contact support
                <ExternalLink
                  size={15}
                />
              </Link>

            </div>

          </article>
        </section>

      </main>

      {/* =====================================================
          BACK TO TOP
      ===================================================== */}

      {showTopButton && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-600"
        >
          <ArrowUp size={19} />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default TermsAndConditions;