import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import hero from "@/assets/hero.jpg";
import city from "@/assets/world-city.jpg";
import forest from "@/assets/world-forest.jpg";
import moon from "@/assets/world-moon.jpg";

const TITLE = "ANIME WORLD — Original Cinematic Fantasy Realms";
const DESC =
  "Step into ANIME WORLD: original anime-inspired fantasy realms, luminous characters and cinematic stories crafted from imagination.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

// Replace with your real contact address / social URLs.
const CONTACT_EMAIL = "hello@example.com";
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "X", href: "https://x.com/" },
  { label: "YouTube", href: "https://youtube.com/" },
  { label: "Discord", href: "https://discord.com/" },
];

const NAV = [
  { id: "worlds", label: "Worlds" },
  { id: "explore", label: "Explore" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const WORLDS = [
  { img: city, name: "Nimbus Arcadia", tag: "Sky City", text: "A neon metropolis drifting above endless storm clouds, where airships hum through the rain." },
  { img: forest, name: "Lumen Hollow", tag: "Spirit Forest", text: "A bioluminescent wood guarded by Aurel, the crystal stag who remembers every traveler." },
  { img: moon, name: "Violet Tide", tag: "Moon Coast", text: "Kaien the wanderer waits on the cliffs where a violet moon pulls the cyan sea skyward." },
];

const EXPLORE = [
  { k: "01", t: "Lore Archives", d: "Histories, myths and maps of every realm, written by our story team." },
  { k: "02", t: "Character Codex", d: "Original heroes, spirits and rivals — their powers, bonds and secrets." },
  { k: "03", t: "Art Studio", d: "Concept paintings and process notes behind each cinematic frame." },
  { k: "04", t: "Soundscapes", d: "Ambient scores composed to match the mood of each world." },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Particles() {
  const [dots, setDots] = useState<{ l: number; s: number; d: number; dl: number }[]>([]);
  useEffect(() => {
    setDots(Array.from({ length: 28 }, () => ({ l: Math.random() * 100, s: 1 + Math.random() * 3, d: 10 + Math.random() * 14, dl: -Math.random() * 20 })));
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((p, i) => (
        <span key={i} className="particle" style={{ left: `${p.l}%`, bottom: "-10px", width: p.s, height: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.dl}s` }} />
      ))}
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open ? "glass border-b" : ""}`}>
      <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="#top" className="font-display text-lg font-extrabold tracking-wider">
          ANIME <span className="text-gradient">WORLD</span>
        </a>
        <ul className="hidden gap-8 md:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="text-sm text-muted-foreground transition-colors hover:text-primary">{n.label}</a>
            </li>
          ))}
        </ul>
        <a href="#worlds" className="hidden rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 md:inline-block">
          Enter
        </a>
        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden className="block h-0.5 w-6 bg-foreground transition-transform" style={{ transform: open ? "translateY(6px) rotate(45deg)" : "" }} />
          <span aria-hidden className={`mt-1.5 block h-0.5 w-6 bg-foreground ${open ? "opacity-0" : ""}`} />
          <span aria-hidden className="mt-1.5 block h-0.5 w-6 bg-foreground transition-transform" style={{ transform: open ? "translateY(-10px) rotate(-45deg)" : "" }} />
        </button>
      </nav>
      {open && (
        <ul id="mobile-menu" className="border-t px-5 pb-6 pt-2 md:hidden">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block py-3 font-display text-lg hover:text-primary">{n.label}</a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

function TiltCard({ w }: { w: (typeof WORLDS)[number] }) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const leave = () => ref.current && (ref.current.style.transform = "");
  return (
    <div className="scene reveal">
      <article ref={ref} onMouseMove={move} onMouseLeave={leave} className="card-3d group relative overflow-hidden rounded-2xl border bg-card hover:shadow-glow-accent">
        <img src={w.img} alt={`${w.name}, ${w.tag.toLowerCase()} concept art`} loading="lazy" decoding="async" width={768} height={1024} className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: "translateZ(40px)" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{w.tag}</p>
          <h3 className="mt-2 font-display text-2xl font-bold">{w.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
        </div>
      </article>
    </div>
  );
}

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"" | "ok" | "err">("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const errs: Errors = {};
    if (!name) errs.name = "Please enter your name.";
    else if (name.length > 100) errs.name = "Name must be under 100 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email address.";
    if (message.length < 10) errs.message = "Message must be at least 10 characters.";
    else if (message.length > 1000) errs.message = "Message must be under 1000 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("err");
      const first = Object.keys(errs)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const subject = encodeURIComponent(`ANIME WORLD inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("ok");
  };
  const field = "mt-2 w-full rounded-lg border bg-input/20 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none aria-[invalid=true]:border-destructive";
  return (
    <form noValidate onSubmit={submit} className="reveal space-y-5 rounded-2xl border bg-card/70 p-6 md:p-8">
      {(["name", "email"] as const).map((k) => (
        <div key={k}>
          <label htmlFor={k} className="text-sm font-medium capitalize">{k}</label>
          <input id={k} name={k} type={k === "email" ? "email" : "text"} autoComplete={k} maxLength={k === "name" ? 100 : 255} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined} className={field} />
          {errors[k] && <p id={`${k}-err`} className="mt-1 text-sm text-destructive">{errors[k]}</p>}
        </div>
      ))}
      <div>
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <textarea id="message" name="message" rows={5} maxLength={1000} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} className={field} />
        {errors.message && <p id="message-err" className="mt-1 text-sm text-destructive">{errors.message}</p>}
      </div>
      <button type="submit" className="w-full rounded-full bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]">
        Open in email app
      </button>
      <p role="status" aria-live="polite" className="text-sm">
        {status === "ok" && <span className="text-success">Your email app should now open with the message ready. Nothing is sent until you press send there.</span>}
        {status === "err" && <span className="text-destructive">Please fix the highlighted fields.</span>}
      </p>
      <p className="text-xs text-muted-foreground">This form has no server — it drafts an email to {CONTACT_EMAIL} using your own mail app.</p>
    </form>
  );
}

function Index() {
  useReveal();
  return (
    <div id="top" className="relative overflow-x-hidden">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <Nav />
      <main id="main">
        <section aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden">
          <img src={hero} alt="" width={1600} height={912} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
          <div className="aurora absolute inset-0" />
          <Particles />
          <div className="relative mx-auto w-full max-w-7xl px-5 pt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Original realms · Cinematic stories</p>
            <h1 id="hero-title" className="floaty mt-6 font-display text-6xl font-extrabold leading-[0.9] tracking-tight sm:text-8xl lg:text-9xl">
              ANIME<br /><span className="text-gradient">WORLD</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              Drift between floating islands, spirit forests and moonlit seas — a universe of original characters, painted in light.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#worlds" className="rounded-full bg-gradient-brand px-8 py-4 font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105">Explore the worlds</a>
              <a href="#about" className="rounded-full border px-8 py-4 font-semibold transition-colors hover:border-primary hover:text-primary">Our story</a>
            </div>
          </div>
        </section>

        <section id="worlds" aria-labelledby="worlds-title" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-28">
          <div className="reveal max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Featured realms</p>
            <h2 id="worlds-title" className="mt-4 font-display text-4xl font-bold md:text-5xl">Three worlds, one sky.</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {WORLDS.map((w) => <TiltCard key={w.name} w={w} />)}
          </div>
        </section>

        <section id="explore" aria-labelledby="explore-title" className="relative scroll-mt-20 border-y bg-secondary/40 py-28">
          <div className="aurora absolute inset-0 opacity-40" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5">
            <h2 id="explore-title" className="reveal font-display text-4xl font-bold md:text-5xl">Discover <span className="text-gradient">deeper</span></h2>
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {EXPLORE.map((x) => (
                <li key={x.k} className="reveal rounded-2xl border bg-card/60 p-6 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow">
                  <span className="font-display text-3xl font-bold text-gradient">{x.k}</span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{x.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
                </li>
              ))}
            </ul>
            <p className="reveal mt-8 text-sm text-muted-foreground">Full archives are in production — reach out below to hear when they open.</p>
          </div>
        </section>

        <section id="about" aria-labelledby="about-title" className="mx-auto grid max-w-7xl scroll-mt-20 items-center gap-12 px-5 py-28 md:grid-cols-2">
          <div className="reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">About</p>
            <h2 id="about-title" className="mt-4 font-display text-4xl font-bold md:text-5xl">Built from imagination, frame by frame.</h2>
          </div>
          <div className="reveal space-y-4 text-lg text-muted-foreground">
            <p>ANIME WORLD is an independent creative universe. Every realm, character and story here is original — inspired by the craft of anime, owned by no franchise.</p>
            <p>We blend painterly concept art, cinematic lighting and quiet storytelling to build places you'll want to return to.</p>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title" className="mx-auto grid max-w-7xl scroll-mt-20 gap-12 px-5 pb-28 md:grid-cols-2">
          <div className="reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Contact</p>
            <h2 id="contact-title" className="mt-4 font-display text-4xl font-bold md:text-5xl">Send a signal.</h2>
            <p className="mt-6 text-lg text-muted-foreground">Collaborations, commissions or just saying hi — we read everything.</p>
          </div>
          <Contact />
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row">
          <p className="font-display font-bold">ANIME <span className="text-gradient">WORLD</span></p>
          <ul className="flex gap-6" aria-label="Social links">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">{s.label}</a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ANIME WORLD. Original artwork.</p>
        </div>
      </footer>
    </div>
  );
}
