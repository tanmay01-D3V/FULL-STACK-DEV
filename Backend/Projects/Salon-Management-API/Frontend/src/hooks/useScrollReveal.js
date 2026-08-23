import { useGSAP, gsap, prefersReducedMotion } from "../utils/gsap";

/**
 * Reveals every element carrying [data-reveal] inside `scopeRef`
 * as it scrolls into view. Re-runs when `deps` change (e.g. data loads).
 */
export default function useScrollReveal(scopeRef, deps = []) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    },
    { scope: scopeRef, dependencies: deps }
  );
}
