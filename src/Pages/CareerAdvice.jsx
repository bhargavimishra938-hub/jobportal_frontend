
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Search,
  ArrowRight,
  Clock3,
  CalendarDays,
  Bookmark,
  TrendingUp,
  FileText,
  Users,
  Code2,
  BriefcaseBusiness,
  ChevronRight,
  Sparkles,
  Lightbulb,
} from "lucide-react";

import Footer from "../Components/Footer";
import Header from "../Components/Header";

const ARTICLES_API =
  "http://localhost/job_portal/job-portal-api/api/articles/get-all.php";

// Dynamic category icons
const categoryIcons = {
  "Resume & CV": FileText,
  Resume: FileText,
  Interview: Users,
  "Career Growth": TrendingUp,
  "Job Search": BriefcaseBusiness,
  Skills: Code2,
};

const defaultIcon = FileText;

const CareerAdvice = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [savedArticles, setSavedArticles] = useState([]);
  const [apiArticles, setApiArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch articles from backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(ARTICLES_API);

        const fetchedArticles = Array.isArray(
          response.data?.articles
        )
          ? response.data.articles
          : [];

        const formattedArticles = fetchedArticles
          .filter((article) => {
            // If status is available, show only published articles
            if (!article.status) return true;

            return (
              String(article.status).toLowerCase() ===
              "published"
            );
          })
          .map((article) => {
            const category = article.category || "General";

            return {
              ...article,

              id: article.id || article.article_id,

              title: article.title || "Untitled Article",

              description:
                article.description ||
                article.excerpt ||
                article.content?.substring(0, 180) ||
                "No description available.",

              category,

              readTime:
                article.read_time ||
                article.readTime ||
                "5 min read",

              date:
                article.created_at ||
                article.date ||
                "Recently",

              featured:
                article.featured === true ||
                article.featured === 1 ||
                article.featured === "1",

              tag: article.tag || category,

              icon:
                categoryIcons[category] ||
                defaultIcon,
            };
          });

        setApiArticles(formattedArticles);
      } catch (err) {
        console.error("Career articles API error:", err);

        setError(
          "Unable to load career articles. Please try again."
        );

        setApiArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // All articles are coming from API
  const articles = apiArticles;

  // Generate categories dynamically from API data
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        articles
          .map((article) => article.category)
          .filter(Boolean)
      ),
    ];

    return [
      {
        name: "All",
        icon: Sparkles,
      },

      ...uniqueCategories.map((name) => ({
        name,
        icon: categoryIcons[name] || defaultIcon,
      })),
    ];
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return articles.filter((article) => {
      const categoryMatch =
        activeCategory === "All" ||
        article.category === activeCategory;

      const title = String(
        article.title || ""
      ).toLowerCase();

      const description = String(
        article.description || ""
      ).toLowerCase();

      const category = String(
        article.category || ""
      ).toLowerCase();

      const searchMatch =
        !searchValue ||
        title.includes(searchValue) ||
        description.includes(searchValue) ||
        category.includes(searchValue);

      return categoryMatch && searchMatch;
    });
  }, [articles, activeCategory, search]);

  // Dynamic featured article
  const featuredArticle = useMemo(() => {
    return (
      articles.find((article) => article.featured) ||
      articles[0] ||
      null
    );
  }, [articles]);

  // Save / unsave article
  const toggleSave = (id) => {
    setSavedArticles((previousArticles) =>
      previousArticles.includes(id)
        ? previousArticles.filter(
            (articleId) => articleId !== id
          )
        : [...previousArticles, id]
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
  };

  // Select popular search
  const handlePopularSearch = (value) => {
    setSearch(value);
    setActiveCategory("All");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">
      <Header />

      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
            {/* Hero content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                <Sparkles size={15} />
                Career Resources & Insights
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                Take the next step in your
                <span className="block text-blue-600">
                  career journey.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
                Expert advice, practical tips and career
                insights to help you build your skills,
                prepare for interviews and find the right
                opportunity.
              </p>

              {/* Search */}
              <div className="mt-8 max-w-2xl">
                <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-200/50 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center">
                    <Search
                      size={20}
                      className="ml-3 shrink-0 text-gray-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search career advice, resume, interview..."
                      className="w-full bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("latest-articles")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }}
                    className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Dynamic popular topics */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-medium text-gray-400">
                  Popular:
                </span>

                {categories
                  .filter(
                    (category) => category.name !== "All"
                  )
                  .slice(0, 4)
                  .map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() =>
                        handlePopularSearch(category.name)
                      }
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {category.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-600 to-indigo-700 p-7 shadow-2xl shadow-blue-200">
                <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                  <TrendingUp size={20} />
                </div>

                <p className="text-sm font-semibold text-blue-100">
                  Career Growth
                </p>

                <h3 className="mt-3 text-2xl font-bold leading-tight text-white">
                  Small improvements.
                  <br />
                  Big career results.
                </h3>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                        <FileText size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Build a stronger resume
                        </p>

                        <p className="mt-0.5 text-xs text-blue-100">
                          Stand out from recruiters
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                        <Users size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Ace your interview
                        </p>

                        <p className="mt-0.5 text-xs text-blue-100">
                          Prepare with confidence
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                        <BriefcaseBusiness size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Find the right job
                        </p>

                        <p className="mt-0.5 text-xs text-blue-100">
                          Match your skills and goals
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic statistics */}
                <div className="mt-7 flex items-center justify-between border-t border-white/15 pt-5">
                  <div>
                    <p className="text-2xl font-extrabold text-white">
                      {articles.length}
                    </p>

                    <p className="text-xs text-blue-100">
                      Career resources
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-extrabold text-white">
                      {Math.max(categories.length - 1, 0)}
                    </p>

                    <p className="text-xs text-blue-100">
                      Categories
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-7 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Learn. Improve. Grow.
                  </p>

                  <p className="text-[11px] text-gray-400">
                    Your career starts here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CATEGORY BAR
      ========================== */}
      <section className="sticky top-16 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;

              const isActive =
                activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category.name)
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={16} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Loading state */}
        {loading && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-5 text-sm font-semibold text-gray-500">
              Loading career articles...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-10 text-center">
            <p className="text-sm font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* =========================
                FEATURED ARTICLE
            ========================== */}
            {activeCategory === "All" &&
              !search.trim() &&
              featuredArticle && (
                <section className="mb-14">
                  <div className="mb-6 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Featured
                      </div>

                      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
                        Career insights worth reading
                      </h2>
                    </div>

                    <span className="hidden text-sm text-gray-400 sm:block">
                      Featured article
                    </span>
                  </div>

                  <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-xl">
                    <div className="grid lg:grid-cols-[1.05fr_1fr]">
                      {/* Featured visual */}
                      <div className="relative min-h-[330px] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-8 lg:p-12">
                        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[30px] border-white/10" />

                        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full border-[35px] border-white/10" />

                        <div className="relative flex h-full flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                              {featuredArticle.tag}
                            </span>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                              {React.createElement(
                                featuredArticle.icon || FileText,
                                { size: 19 }
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-xl">
                              {React.createElement(
                                featuredArticle.icon || FileText,
                                {
                                  size: 38,
                                  strokeWidth: 1.8,
                                }
                              )}
                            </div>

                            <p className="text-sm font-semibold text-blue-100">
                              {featuredArticle.category}
                            </p>

                            <p className="mt-2 text-xl font-bold leading-7 text-white">
                              Make your first impression count.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Featured content */}
                      <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-12">
                        <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                          {featuredArticle.category}
                        </span>

                        <h3 className="mt-4 max-w-xl text-2xl font-extrabold leading-tight text-gray-950 sm:text-3xl">
                          {featuredArticle.title}
                        </h3>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
                          {featuredArticle.description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Clock3 size={14} />
                            {featuredArticle.readTime}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-gray-300" />

                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {featuredArticle.date}
                          </span>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              document
                                .getElementById("latest-articles")
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                })
                            }
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                          >
                            View Articles
                            <ArrowRight size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleSave(featuredArticle.id)
                            }
                            className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition ${
                              savedArticles.includes(
                                featuredArticle.id
                              )
                                ? "border-blue-200 bg-blue-50 text-blue-600"
                                : "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                            }`}
                          >
                            <Bookmark
                              size={17}
                              fill={
                                savedArticles.includes(
                                  featuredArticle.id
                                )
                                  ? "currentColor"
                                  : "none"
                              }
                            />

                            {savedArticles.includes(
                              featuredArticle.id
                            )
                              ? "Saved"
                              : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

            {/* =========================
                ARTICLES
            ========================== */}
            <section id="latest-articles">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    Latest Articles
                  </div>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
                    Advice to help you move forward
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Practical tips for every stage of your career.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {(search.trim() ||
                    activeCategory !== "All") && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Clear filters
                    </button>
                  )}

                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                    {filteredArticles.length} articles
                  </span>
                </div>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles
                    .filter(
                      (article) =>
                        article.id !== featuredArticle?.id
                    )
                    .map((article) => {
                      const Icon = article.icon || FileText;

                      const isSaved = savedArticles.includes(
                        article.id
                      );

                      return (
                        <article
                          key={article.id}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
                        >
                          {/* Card visual */}
                          <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
                            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/60 transition duration-500 group-hover:scale-125" />

                            <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-indigo-100/50 transition duration-500 group-hover:scale-125" />

                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                              <Icon
                                size={29}
                                strokeWidth={1.8}
                              />
                            </div>

                            {/* Dynamic tag */}
                            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-gray-600 shadow-sm backdrop-blur">
                              {article.tag}
                            </span>

                            {/* Bookmark */}
                            <button
                              type="button"
                              onClick={() =>
                                toggleSave(article.id)
                              }
                              aria-label="Save article"
                              className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition ${
                                isSaved
                                  ? "border-blue-100 bg-blue-50 text-blue-600"
                                  : "border-gray-100 bg-white/90 text-gray-400 hover:text-blue-600"
                              }`}
                            >
                              <Bookmark
                                size={16}
                                fill={
                                  isSaved
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                          </div>

                          {/* Card content */}
                          <div className="flex flex-1 flex-col p-5">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-bold text-blue-600">
                                {article.category}
                              </span>

                              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                <Clock3 size={12} />
                                {article.readTime}
                              </span>
                            </div>

                            <h3 className="mt-3 line-clamp-2 text-lg font-extrabold leading-6 text-gray-900 transition group-hover:text-blue-600">
                              {article.title}
                            </h3>

                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                              {article.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
                              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <CalendarDays size={13} />
                                {article.date}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  alert(
                                    "Article details page will be connected soon."
                                  )
                                }
                                className="flex items-center gap-1 text-xs font-bold text-blue-600 transition group-hover:gap-2"
                              >
                                Read More
                                <ArrowRight size={14} />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                </div>
              ) : (
                <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                    <Search
                      size={27}
                      className="text-gray-400"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-extrabold text-gray-900">
                    No articles found
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    We couldn't find any career advice
                    matching your search. Try another keyword
                    or browse all categories.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Browse All Articles
                  </button>
                </div>
              )}
            </section>

            {/* =========================
                DYNAMIC TOPICS
            ========================== */}
            {categories.filter(
              (category) => category.name !== "All"
            ).length > 0 && (
              <section className="mt-16">
                <div className="mb-7">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    Explore Topics
                  </div>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950">
                    What do you want to improve?
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {categories
                    .filter(
                      (category) => category.name !== "All"
                    )
                    .map((topic) => {
                      const Icon = topic.icon;

                      const topicArticles = articles.filter(
                        (article) =>
                          article.category === topic.name
                      );

                      return (
                        <button
                          key={topic.name}
                          type="button"
                          onClick={() => {
                            setActiveCategory(topic.name);
                            setSearch("");

                            document
                              .getElementById("latest-articles")
                              ?.scrollIntoView({
                                behavior: "smooth",
                              });
                          }}
                          className="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                              <Icon size={20} />
                            </div>

                            <ChevronRight
                              size={18}
                              className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                            />
                          </div>

                          <h3 className="mt-5 text-base font-bold text-gray-900">
                            {topic.name}
                          </h3>

                          <p className="mt-1.5 text-sm leading-5 text-gray-500">
                            Explore {topicArticles.length}{" "}
                            career articles
                          </p>
                        </button>
                      );
                    })}
                </div>
              </section>
            )}
          </>
        )}

        {/* =========================
            CTA
        ========================== */}
        <section className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-xl shadow-blue-100 sm:p-10 lg:p-12">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[45px] border-white/10" />

          <div className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full border-[40px] border-white/10" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100 backdrop-blur">
                <BriefcaseBusiness size={14} />
                Find your next opportunity
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                Ready to take the next step?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Put your career knowledge into action and
                discover jobs that match your skills and
                ambitions.
              </p>
            </div>

            <Link
              to="/jobs"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-blue-600 shadow-lg transition hover:bg-gray-50"
            >
              Explore Jobs
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CareerAdvice;