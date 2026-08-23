import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { listServices } from "../api/serviceApi";
import { getApiError } from "../api/client";
import ServiceCard from "../components/ServiceCard";
import useAuth from "../hooks/useAuth";
import useScrollReveal from "../hooks/useScrollReveal";
import { gsap, useGSAP, prefersReducedMotion } from "../utils/gsap";
import heroImg from "../assets/salon-hero.jpg";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const rootRef = useRef(null);
  const heroRef = useRef(null);

  /* Entrance timeline + hero parallax */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-img-layer", { autoAlpha: 0, scale: 1.08, duration: 1.4, ease: "power2.out" }, 0)
        .from(".hero-badge", { y: 16, autoAlpha: 0, duration: 0.5 }, 0.2)
        .from(".hero-line", { yPercent: 110, duration: 0.9, stagger: 0.12 }, "-=0.3")
        .from(".hero-sub", { y: 18, autoAlpha: 0, duration: 0.6 }, "-=0.5")
        .from(".hero-cta", { y: 18, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, "-=0.4")
        .from(".hero-stat", { y: 14, autoAlpha: 0, duration: 0.45, stagger: 0.06 }, "-=0.35")
        .from(".float-card", { y: 28, autoAlpha: 0, duration: 0.7, stagger: 0.15 }, "-=0.6");

      gsap.to(".hero-img-layer", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: rootRef }
  );

  /* Scroll reveals (re-run once data is rendered) */
  useScrollReveal(rootRef, [loading]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listServices();
        if (!cancelled) setServices(data.slice(0, 5));
      } catch (error) {
        if (!cancelled) {
          toast.error(getApiError(error, "Could not load featured services."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-brand-50">
        {/* Faded image layer */}
        <div className="hero-img-layer absolute inset-0" aria-hidden="true">
          <img
            src={heroImg}
            alt=""
            className="h-full w-full scale-105 object-cover object-center"
          />
          {/* horizontal fade so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/90 to-stone-50/10 sm:via-stone-50/75 lg:to-transparent" />
          {/* vertical fades blending into page */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-50 to-transparent" />
          {/* blush tint over the photo */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-100/60 via-transparent to-plum-700/10" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:min-h-[88vh] lg:grid-cols-2 lg:py-32">
          <div>
            <span className="hero-badge inline-flex items-center rounded-full border border-brand-200 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 shadow-sm backdrop-blur">
              Salon Management System
            </span>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              <span className="block overflow-hidden pb-1">
                <span className="hero-line block">Look beautiful.</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-line block bg-gradient-to-r from-brand-600 to-plum-700 bg-clip-text text-transparent">
                  Feel effortless.
                </span>
              </span>
            </h1>

            <p className="hero-sub mt-5 max-w-lg text-base leading-relaxed text-stone-600 sm:text-lg">
              Discover signature treatments — from precision cuts to restorative
              rituals — and manage your salon's full service menu in one calm,
              beautiful place.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/services" className="btn-primary hero-cta !px-7 !py-3 !text-base">
                Browse services
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn-secondary hero-cta !px-7 !py-3 !text-base">
                  Create an account
                </Link>
              )}
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[
                ["5★", "Treatments"],
                ["60 min", "Avg. session"],
                ["100%", "Care"],
              ].map(([value, label]) => (
                <div key={label} className="hero-stat">
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-display text-2xl font-semibold text-brand-800">{value}</dd>
                  <dd className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Floating accent cards (desktop) */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="float-card card ml-auto max-w-sm rotate-2 p-8 backdrop-blur-md transition-transform duration-500 hover:rotate-0">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Today's ritual</p>
              <p className="mt-3 font-display text-3xl font-semibold text-stone-900">
                Rose Quartz Glow Facial
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                75 minutes of pure calm. Crushed rose quartz, cold-pressed oils
                and a lymphatic massage that leaves skin luminous.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-bold text-brand-800">₹2,400</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-plum-700 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2c1.1 3 2.9 4.8 5.9 5.9C14.9 9 13.1 10.8 12 13.8 10.9 10.8 9.1 9 6.1 7.9 9.1 6.8 10.9 5 12 2z"/></svg>
                </span>
              </div>
            </div>

            <div className="float-card card absolute -bottom-10 left-0 -rotate-3 p-5 backdrop-blur-md transition-transform duration-500 hover:rotate-0">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Walk-ins</p>
              <p className="mt-1 font-display text-xl font-semibold text-stone-900">Welcome daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
              Featured treatments
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              A hand-picked taste of our most-loved services.
            </p>
          </div>
          <Link to="/services" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="h-28 animate-pulse bg-gradient-to-br from-brand-100 to-brand-50" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-3 w-full animate-pulse rounded-full bg-stone-100" />
                  <div className="h-3 w-4/5 animate-pulse rounded-full bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <div key={service.id} data-reveal>
                <ServiceCard service={service} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
