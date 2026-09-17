
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Star,
  Calendar,
  Heart,
  Video,
  Building2,
  GraduationCap,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  Award,
  Clock,
  Sparkles,
  Loader2,
  ShieldCheck,
  Users,
  X,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  MessageCircle,
  Languages,
  BriefcaseMedical,
  SearchX,
} from "lucide-react";
import api from "../api/api";

export default function BeautifulDoctorsPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [filterFacility, setFilterFacility] = useState("all");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/api/doctors");

        if (Array.isArray(res.data)) {
          setDoctors(res.data);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        console.error("Failed to load doctors from backend:", err);
        setError("Unable to load doctors from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const facilities = Array.from(
    new Set(doctors.map((d) => d.facility).filter(Boolean))
  );

  const specialties = Array.from(
    new Set(doctors.map((d) => d.specialty).filter(Boolean))
  );

  const filteredDoctors = doctors
    .filter((doc) => {
      const searchTerm = query.toLowerCase().trim();

      const matchesQuery =
        searchTerm === "" ||
        (doc.name &&
          doc.name.toLowerCase().includes(searchTerm)) ||
        (doc.specialty &&
          doc.specialty.toLowerCase().includes(searchTerm));

      const matchesFacility =
        filterFacility === "all" ||
        doc.facility === filterFacility;

      const matchesSpecialty =
        filterSpecialty === "all" ||
        doc.specialty === filterSpecialty;

      return matchesQuery && matchesFacility && matchesSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }

      if (sortBy === "experience") {
        return (b.experience || 0) - (a.experience || 0);
      }

      if (sortBy === "reviews") {
        return (b.reviews || 0) - (a.reviews || 0);
      }

      return 0;
    });

  const clearFilters = () => {
    setQuery("");
    setFilterFacility("all");
    setFilterSpecialty("all");
    setSortBy("rating");
  };

  const toggleFavorite = (doctorId) => {
    setFavorites((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  return (
    <main className="min-h-screen bg-[#f7faff] text-slate-800">

      {/* =====================================
          HERO SECTION
      ===================================== */}
      <section className="relative isolate overflow-hidden bg-[#0b2147]">

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-48 -left-32 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-28 lg:pt-12">

          {/* Breadcrumb */}
          <nav className="mb-12 flex items-center gap-2 text-sm text-blue-200">
            <button
              onClick={() => navigate("/")}
              className="transition hover:text-white"
            >
              Home
            </button>

            <ChevronRight className="h-4 w-4 opacity-60" />

            <button
              onClick={() => navigate("/facilities")}
              className="transition hover:text-white"
            >
              Facilities
            </button>

            <ChevronRight className="h-4 w-4 opacity-60" />

            <span className="font-medium text-white">Doctors</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">

            {/* Hero copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
                <Stethoscope className="h-4 w-4" />
                Trusted healthcare professionals
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[4.1rem]">
                Find the right doctor
                <span className="mt-2 block bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  for your health.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-blue-100/80 sm:text-lg">
                Connect with experienced specialists, explore trusted
                facilities, and book your next appointment with confidence.
              </p>

              {/* Hero stats */}
              <div className="mt-9 flex flex-wrap gap-7">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2.5">
                    <Users className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      {doctors.length}+
                    </p>
                    <p className="text-xs text-blue-200">
                      Listed Doctors
                    </p>
                  </div>
                </div>

                <div className="h-12 w-px bg-white/15" />

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2.5">
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      Verified
                    </p>
                    <p className="text-xs text-blue-200">
                      Professional Profiles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden min-h-[340px] lg:block">
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full border border-cyan-300/10" />
              <div className="absolute right-8 top-8 h-56 w-56 rounded-full border border-cyan-300/10" />

              <div className="absolute right-6 top-5 w-72 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-400/20 p-3">
                    <Heart className="h-7 w-7 fill-emerald-300 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      Your health matters
                    </p>
                    <p className="mt-1 text-xs text-blue-100/70">
                      Care that puts you first
                    </p>
                  </div>
                </div>

                <div className="my-5 h-px bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <span className="text-sm text-blue-50">
                      Experienced specialists
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <span className="text-sm text-blue-50">
                      Flexible appointment options
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <span className="text-sm text-blue-50">
                      Convenient virtual consultations
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 left-2 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
                <div className="rounded-xl bg-cyan-400/20 p-2.5">
                  <Calendar className="h-6 w-6 text-cyan-200" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Start your care journey
                  </p>
                  <p className="mt-1 text-xs text-blue-100/70">
                    Find a specialist today
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search panel */}
          <div className="relative z-10 mx-auto mt-12 max-w-5xl rounded-3xl border border-white/60 bg-white p-3 shadow-[0_20px_70px_rgba(0,0,0,0.25)] lg:mt-16">

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search doctors or specialties..."
                  aria-label="Search doctors or specialties"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />

                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setQuery(query.trim())}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-8 font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:from-cyan-700 hover:to-emerald-700 active:scale-[0.98]"
              >
                <Search className="h-5 w-5" />
                Search Doctors
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          FILTER BAR
      ===================================== */}
      <section className="relative z-20 mx-auto -mt-7 max-w-7xl px-5 sm:px-8 lg:px-10">

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,45,80,0.08)] sm:p-6">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-50 p-2.5">
                <SlidersHorizontal className="h-5 w-5 text-cyan-700" />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Find your specialist
                </h2>
                <p className="text-xs text-slate-500">
                  Refine your search to find the right care.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <div className="relative">
                <select
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  aria-label="Filter by specialty"
                  className="h-11 min-w-[165px] appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-cyan-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50"
                >
                  <option value="all">All Specialties</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative">
                <select
                  value={filterFacility}
                  onChange={(e) => setFilterFacility(e.target.value)}
                  aria-label="Filter by facility"
                  className="h-11 min-w-[165px] appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-cyan-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50"
                >
                  <option value="all">All Facilities</option>
                  {facilities.map((fac) => (
                    <option key={fac} value={fac}>
                      {fac}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort doctors"
                  className="h-11 min-w-[165px] appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-cyan-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="available">Next Available</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {(query ||
                filterFacility !== "all" ||
                filterSpecialty !== "all") && (
                <button
                  onClick={clearFilters}
                  className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredDoctors.length}
              </span>{" "}
              doctors
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Trusted healthcare directory
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          DOCTORS SECTION
      ===================================== */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">

        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">
              Our Specialists
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#102752] sm:text-4xl">
              Meet our doctors
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Explore our network of healthcare professionals and choose
              a specialist who fits your needs.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                viewMode === "grid"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              Grid
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                viewMode === "list"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-28 shadow-sm">
            <div className="mb-5 rounded-2xl bg-cyan-50 p-4">
              <Loader2 className="h-9 w-9 animate-spin text-cyan-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              Loading doctors
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Connecting to MediCore database...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <RefreshCw className="h-7 w-7 text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Unable to load doctors
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              {error} Please check your backend connection and try again.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Doctors */}
        {!loading && !error && filteredDoctors.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-7 md:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-5"
            }
          >
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_5px_25px_rgba(15,45,80,0.045)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_18px_45px_rgba(15,75,110,0.12)] ${
                  viewMode === "list"
                    ? "flex flex-col md:flex-row"
                    : ""
                }`}
              >

                {/* Doctor image */}
                <div
                  className={`relative overflow-hidden bg-gradient-to-br from-cyan-50 to-emerald-50 ${
                    viewMode === "grid"
                      ? "h-64"
                      : "h-64 md:h-auto md:w-64 md:shrink-0"
                  }`}
                >
                  {doctor.avatar ? (
                    <img
                      src={doctor.avatar}
                      alt={doctor.name || "Doctor"}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full min-h-64 items-center justify-center">
                      <Stethoscope className="h-20 w-20 text-cyan-200" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                  {/* Verified badge */}
                  {doctor.verified && (
                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                      <BadgeCheckIcon />
                      Verified
                    </div>
                  )}

                  {/* Favorite */}
                  <button
                    onClick={() => toggleFavorite(doctor.id)}
                    aria-label={
                      favorites.includes(doctor.id)
                        ? `Remove ${doctor.name} from favorites`
                        : `Add ${doctor.name} to favorites`
                    }
                    className="absolute right-4 top-4 rounded-full border border-white/50 bg-white/90 p-2.5 text-slate-600 shadow-lg backdrop-blur transition hover:bg-white"
                  >
                    <Heart
                      className={`h-5 w-5 transition ${
                        favorites.includes(doctor.id)
                          ? "fill-red-500 text-red-500"
                          : "text-slate-600"
                      }`}
                    />
                  </button>

                  {/* Rating */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-extrabold text-slate-800">
                      {doctor.rating || "—"}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({doctor.reviews || 0})
                    </span>
                  </div>
                </div>

                {/* Doctor content */}
                <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">

                  <div className="mb-5">
                    <h3 className="truncate text-xl font-extrabold text-slate-800 transition group-hover:text-cyan-700">
                      {doctor.name}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-cyan-600">
                      {doctor.specialty || "Healthcare Specialist"}
                    </p>

                    {doctor.subSpecialty && (
                      <p className="mt-1 text-sm text-slate-500">
                        {doctor.subSpecialty}
                      </p>
                    )}
                  </div>

                  {/* Doctor information */}
                  <div className="mb-5 space-y-3">
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span className="line-clamp-2">
                        {doctor.facility || "MediCore Healthcare"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <GraduationCap className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>
                        {doctor.experience || 0} years experience
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="font-semibold text-emerald-700">
                        Next: {doctor.nextAvailable || "Contact for availability"}
                      </span>
                    </div>
                  </div>

                  {/* Languages */}
                  {Array.isArray(doctor.languages) &&
                    doctor.languages.length > 0 && (
                      <div className="mb-5 flex flex-wrap items-center gap-2">
                        <Languages className="h-4 w-4 text-slate-400" />

                        {doctor.languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* Fee and availability */}
                  <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50/80 to-emerald-50/60 p-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Consultation Fee
                      </p>

                      <p className="mt-1 text-lg font-extrabold text-slate-800">
                        {doctor.consultationFee || "Contact us"}
                      </p>
                    </div>

                    {doctor.acceptsNewPatients && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-center text-[10px] font-bold text-emerald-700 sm:text-xs">
                        Accepting Patients
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto space-y-3">

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          window.open(`tel:${doctor.phone}`, "_self")
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </button>

                      <button
                        onClick={() =>
                          navigate("/call-selection", {
                            state: { doctorId: doctor.id },
                          })
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <Video className="h-4 w-4" />
                        Video Call
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/doctor-profile/${doctor.id}`)
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100"
                    >
                      View Full Profile
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() =>
                        navigate("/appointment-booking", {
                          state: {
                            doctor: doctor,
                            source: "doctors-list",
                          },
                        })
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-600/15 transition hover:from-cyan-700 hover:to-emerald-700 active:scale-[0.99]"
                    >
                      <Calendar className="h-4 w-4" />
                      Book Appointment
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-24 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <SearchX className="h-9 w-9 text-slate-400" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-800">
              No doctors found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              We couldn't find a doctor matching your current search.
              Try another specialty or remove some filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
            >
              <RefreshCw className="h-4 w-4" />
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* =====================================
          CTA SECTION
      ===================================== */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b2147] via-[#123a68] to-[#087f8c] px-6 py-14 text-center shadow-2xl sm:px-12 lg:py-20">

          <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Heart className="h-7 w-7 fill-cyan-300 text-cyan-300" />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
              Your health, our priority
            </p>

            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Ready to find the right care?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-blue-100/80 sm:text-base">
              Explore specialists, discover healthcare facilities, or
              get in touch with our team for assistance.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setQuery("");
                  setFilterFacility("all");
                  setFilterSpecialty("all");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#0b6d91] shadow-lg transition hover:bg-cyan-50"
              >
                <Search className="h-4 w-4" />
                Find a Doctor
              </button>

              <button
                onClick={() => navigate("/facilities")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#0b2147]"
              >
                <Building2 className="h-4 w-4" />
                Explore Facilities
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Small reusable icon for the verified badge */
function BadgeCheckIcon() {
  return <ShieldCheck className="h-3.5 w-3.5" />;
}