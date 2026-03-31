import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  primary: "#a4c93b",
  primaryDark: "#8ab52e",
  secondary: "#d2a4f3",
  secondaryDark: "#b87de0",
  bg: "#ffffff",
  bgSoft: "#faf9f7",
  bgWarm: "#f5f3ef",
  text: "#1a1a1a",
  textMuted: "#6b6b6b",
  textLight: "#9a9a9a",
  border: "#e8e5e0",
};

const FONT = "'League Spartan', sans-serif";

// ─── ICONS ───
const Icons = {
  Cart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  User: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
  ),
  Star: ({ filled }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#f5c518" : "none"} stroke="#f5c518" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Play: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  ),
  Book: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  ),
  Fire: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
  ),
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Gift: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
  ),
};

// ─── DATA ───
const PRODUCTS = [
  { id: 1, name: "Colágeno Beauty Glow", price: 149900, oldPrice: 179900, img: "🌸", tag: "Más Vendido", category: "Colágeno", rating: 4.8, reviews: 234 },
  { id: 2, name: "Greens Superfood Mix", price: 129900, img: "🥬", tag: "Nuevo", category: "Superfoods", rating: 4.7, reviews: 189 },
  { id: 3, name: "Vitamina D3 + K2", price: 89900, img: "☀️", category: "Vitaminas", rating: 4.9, reviews: 312 },
  { id: 4, name: "Probióticos Mujer", price: 119900, oldPrice: 139900, img: "🦠", tag: "Oferta", category: "Digestión", rating: 4.6, reviews: 156 },
  { id: 5, name: "Magnesio + Zinc", price: 79900, img: "✨", category: "Minerales", rating: 4.8, reviews: 278 },
  { id: 6, name: "Ashwagandha Calm", price: 99900, img: "🌿", tag: "Trending", category: "Adaptógenos", rating: 4.7, reviews: 201 },
  { id: 7, name: "Omega 3 Premium", price: 109900, img: "🐟", category: "Ácidos Grasos", rating: 4.5, reviews: 167 },
  { id: 8, name: "Bundle Bienestar Total", price: 299900, oldPrice: 389900, img: "🎁", tag: "Bundle", category: "Bundles", rating: 4.9, reviews: 89 },
];

const BESTSELLERS = [PRODUCTS[0], PRODUCTS[7], PRODUCTS[3], PRODUCTS[5]];

const STORIES = [
  { id: 1, emoji: "🧘‍♀️", title: "Ritual AM", subtitle: "Tu mañana ideal", gradient: "linear-gradient(135deg, #a4c93b33, #d2a4f333)" },
  { id: 2, emoji: "🥗", title: "Receta Detox", subtitle: "Smoothie verde", gradient: "linear-gradient(135deg, #a4c93b55, #e8f5c8)" },
  { id: 3, emoji: "💆‍♀️", title: "Self Care", subtitle: "Noche de spa", gradient: "linear-gradient(135deg, #d2a4f344, #f3e8ff)" },
  { id: 4, emoji: "🏃‍♀️", title: "Energía", subtitle: "Pre-workout", gradient: "linear-gradient(135deg, #a4c93b33, #d4edaa)" },
  { id: 5, emoji: "🌙", title: "Sleep Well", subtitle: "Rutina PM", gradient: "linear-gradient(135deg, #d2a4f355, #e8d5f7)" },
  { id: 6, emoji: "💪", title: "Fuerza", subtitle: "Post-gym", gradient: "linear-gradient(135deg, #a4c93b44, #c8e68a)" },
];

const DIGITAL_PRODUCTS = [
  { id: 1, title: "Guía de Bienestar Femenino", type: "PDF · 45 páginas", price: 0, emoji: "📖", tag: "Gratis", desc: "Todo lo que necesitas saber sobre suplementación consciente" },
  { id: 2, title: "Recetario Saludable Vol. 1", type: "PDF · 30 recetas", price: 29900, emoji: "🍽️", desc: "Recetas nutritivas y deliciosas para cada momento del día" },
  { id: 3, title: "Masterclass: Equilibrio Hormonal", type: "Video · 90 min", price: 49900, emoji: "🎬", desc: "Aprende a balancear tus hormonas de forma natural" },
  { id: 4, title: "Planificador de Bienestar 2026", type: "PDF interactivo", price: 19900, emoji: "📅", tag: "Nuevo", desc: "Organiza tu rutina de bienestar mes a mes" },
];

const QUIZ_QUESTIONS = [
  {
    question: "¿Cuál es tu principal objetivo de bienestar?",
    options: ["Más energía en el día", "Mejorar mi piel y cabello", "Fortalecer mis defensas", "Mejorar mi digestión"],
  },
  {
    question: "¿Cómo describirías tu nivel de estrés?",
    options: ["Bajo, me siento tranquila", "Moderado, algunos días difíciles", "Alto, me cuesta relajarme", "Muy alto, necesito ayuda"],
  },
  {
    question: "¿Cómo es tu alimentación?",
    options: ["Muy balanceada y variada", "Buena pero podría mejorar", "Irregular, como lo que puedo", "Tengo restricciones alimentarias"],
  },
];

const QUIZ_RESULTS = {
  energia: { title: "Pack Energía Natural", products: [PRODUCTS[4], PRODUCTS[2]], emoji: "⚡" },
  belleza: { title: "Ritual de Belleza", products: [PRODUCTS[0], PRODUCTS[5]], emoji: "✨" },
  defensas: { title: "Escudo Inmunológico", products: [PRODUCTS[2], PRODUCTS[6]], emoji: "🛡️" },
  digestion: { title: "Equilibrio Digestivo", products: [PRODUCTS[3], PRODUCTS[1]], emoji: "🌿" },
};

// ─── HELPERS ───
const formatPrice = (p) => `$${(p / 100).toLocaleString("es-CO")}`;

// ─── COMPONENTS ───

function PromoBar() {
  const [time, setTime] = useState({ d: 5, h: 12, m: 34, s: 56 });
  useEffect(() => {
    const t = setInterval(() => setTime(prev => {
      let { d, h, m, s } = prev;
      s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; d--; } if (d < 0) d = 0;
      return { d, h, m, s };
    }), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: COLORS.primary, color: "#fff", textAlign: "center", padding: "10px 16px", fontFamily: FONT, fontSize: 13, fontWeight: 600, letterSpacing: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
      <span>✨ VENTA ESPECIAL — HASTA 30% OFF</span>
      <div style={{ display: "flex", gap: 6 }}>
        {[["d", time.d], ["h", time.h], ["m", time.m], ["s", time.s]].map(([l, v]) => (
          <span key={l} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 6, padding: "3px 8px", fontSize: 12, minWidth: 32, textAlign: "center" }}>
            {String(v).padStart(2, "0")}<span style={{ fontSize: 9, opacity: 0.7 }}>{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Header({ activeSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);

  const navItems = [
    { id: "landing", label: "Inicio" },
    { id: "tienda", label: "Tienda" },
    { id: "bestsellers", label: "Más Vendidos" },
    { id: "aprende", label: "Aprende con Nosotros" },
    { id: "quiz", label: "Aprende a Conocerte" },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
      borderBottom: `1px solid ${COLORS.border}`, backdropFilter: "blur(12px)",
      transition: "all 0.3s ease", boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: COLORS.primary, letterSpacing: -1, cursor: "pointer" }} onClick={() => onNavigate("landing")}>
          Saluva
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)} style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 600, color: activeSection === item.id ? COLORS.primary : COLORS.text,
              background: activeSection === item.id ? `${COLORS.primary}12` : "transparent",
              border: "none", padding: "8px 14px", borderRadius: 24, cursor: "pointer",
              transition: "all 0.2s", letterSpacing: 0.3,
            }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.text, opacity: 0.7 }}><Icons.Search /></button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.text, opacity: 0.7 }}><Icons.User /></button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.text, position: "relative" }}>
            <Icons.Cart />
            <span style={{ position: "absolute", top: -4, right: -6, background: COLORS.secondary, color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── LANDING SECTION ───
function LandingSection() {
  const [activeStory, setActiveStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);

  useEffect(() => {
    if (activeStory === null) return;
    setStoryProgress(0);
    const interval = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          setActiveStory(null);
          return 0;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [activeStory]);

  return (
    <section id="landing" style={{ fontFamily: FONT }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15, ${COLORS.bgSoft})`,
        padding: "60px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -100, right: -100, width: 400, height: 400,
          background: `radial-gradient(circle, ${COLORS.primary}20, transparent 70%)`, borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -60, width: 300, height: 300,
          background: `radial-gradient(circle, ${COLORS.secondary}20, transparent 70%)`, borderRadius: "50%",
        }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 60 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-block", background: `${COLORS.primary}18`, color: COLORS.primary, fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 20, marginBottom: 20, letterSpacing: 1 }}>
              BIENESTAR FEMENINO NATURAL
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 800, color: COLORS.text, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1.5 }}>
              Tu cuerpo merece{" "}
              <span style={{ color: COLORS.primary }}>lo mejor</span>
              <span style={{ color: COLORS.secondary }}>.</span>
            </h1>
            <p style={{ fontSize: 18, color: COLORS.textMuted, lineHeight: 1.6, maxWidth: 480, margin: "0 0 32px" }}>
              Suplementos naturales diseñados especialmente para el bienestar de la mujer. Descubre tu versión más saludable.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{
                fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff", background: COLORS.primary,
                border: "none", padding: "14px 32px", borderRadius: 30, cursor: "pointer",
                boxShadow: `0 4px 16px ${COLORS.primary}40`, transition: "all 0.3s",
              }}>
                Explorar Tienda
              </button>
              <button style={{
                fontFamily: FONT, fontSize: 15, fontWeight: 700, color: COLORS.text,
                background: "transparent", border: `2px solid ${COLORS.border}`,
                padding: "14px 32px", borderRadius: 30, cursor: "pointer",
              }}>
                Hacer el Quiz
              </button>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 380, height: 380, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.primary}25, ${COLORS.secondary}25)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120,
              boxShadow: `0 20px 60px ${COLORS.primary}15`,
            }}>
              🌿
            </div>
          </div>
        </div>
      </div>

      {/* Stories */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 20px" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 2, marginBottom: 20, textTransform: "uppercase" }}>
          📱 Descubre Nuestro Mundo
        </h3>
        <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 12 }}>
          {STORIES.map((story, i) => (
            <div key={story.id} onClick={() => setActiveStory(i)} style={{
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: story.gradient, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, border: `3px solid ${COLORS.primary}`,
                boxShadow: `0 4px 12px ${COLORS.primary}20`, transition: "transform 0.2s",
              }}>
                {story.emoji}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{story.title}</span>
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginTop: -4 }}>{story.subtitle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Overlay */}
      {activeStory !== null && (
        <div onClick={() => setActiveStory(null)} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 360, height: 640, borderRadius: 20, overflow: "hidden", position: "relative",
            background: STORIES[activeStory].gradient,
          }}>
            <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", gap: 4 }}>
              {STORIES.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.3)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", background: "#fff", borderRadius: 2,
                    width: i < activeStory ? "100%" : i === activeStory ? `${storyProgress}%` : "0%",
                    transition: "width 0.06s linear",
                  }} />
                </div>
              ))}
            </div>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              height: "100%", gap: 16, padding: 32,
            }}>
              <span style={{ fontSize: 80 }}>{STORIES[activeStory].emoji}</span>
              <h2 style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: COLORS.text, textAlign: "center" }}>
                {STORIES[activeStory].title}
              </h2>
              <p style={{ fontSize: 16, color: COLORS.textMuted, textAlign: "center" }}>
                {STORIES[activeStory].subtitle}
              </p>
              <button style={{
                fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#fff",
                background: COLORS.primary, border: "none", padding: "12px 28px",
                borderRadius: 24, cursor: "pointer", marginTop: 16,
              }}>
                Ver más →
              </button>
            </div>
            <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 24 }}>
              <button onClick={(e) => { e.stopPropagation(); setActiveStory(prev => Math.max(0, prev - 1)); }}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#333", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>
                ‹
              </button>
              <button onClick={(e) => { e.stopPropagation(); activeStory < STORIES.length - 1 ? setActiveStory(prev => prev + 1) : setActiveStory(null); }}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#333", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 50px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {[
            ["🌱", "100% Natural"],
            ["🧪", "Clínicamente Probado"],
            ["🇨🇴", "Hecho en Colombia"],
            ["📦", "Envío Gratis +$80K"],
          ].map(([emoji, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRODUCT CARD ───
function ProductCard({ product, featured }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 16, overflow: "hidden",
        border: `1px solid ${hovered ? COLORS.primary + "40" : COLORS.border}`,
        transition: "all 0.3s", cursor: "pointer",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 12px 32px ${COLORS.primary}15` : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{
        height: featured ? 240 : 200, background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.secondary}10)`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: featured ? 72 : 56,
        position: "relative",
      }}>
        {product.tag && (
          <span style={{
            position: "absolute", top: 12, left: 12, fontSize: 10, fontWeight: 700, fontFamily: FONT,
            background: product.tag === "Oferta" || product.tag === "Bundle" ? COLORS.secondary : COLORS.primary,
            color: "#fff", padding: "4px 12px", borderRadius: 12, letterSpacing: 0.5,
          }}>
            {product.tag}
          </span>
        )}
        <span style={{ transition: "transform 0.3s", transform: hovered ? "scale(1.15)" : "scale(1)" }}>
          {product.img}
        </span>
        {hovered && (
          <div style={{
            position: "absolute", bottom: 12, right: 12, display: "flex", gap: 6,
          }}>
            <button style={{
              width: 36, height: 36, borderRadius: "50%", background: "#fff",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}>
              <Icons.Heart />
            </button>
          </div>
        )}
      </div>
      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
          {[1, 2, 3, 4, 5].map(s => <Icons.Star key={s} filled={s <= Math.floor(product.rating)} />)}
          <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 4 }}>({product.reviews})</span>
        </div>
        <p style={{ fontSize: 11, color: COLORS.primary, fontWeight: 700, marginBottom: 4, letterSpacing: 0.5 }}>
          {product.category}
        </p>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, margin: "0 0 8px", fontFamily: FONT, lineHeight: 1.3 }}>
          {product.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span style={{ fontSize: 13, color: COLORS.textLight, textDecoration: "line-through" }}>
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <button style={{
          fontFamily: FONT, width: "100%", marginTop: 12, padding: "11px 0", fontSize: 13, fontWeight: 700,
          color: hovered ? "#fff" : COLORS.primary, background: hovered ? COLORS.primary : `${COLORS.primary}12`,
          border: "none", borderRadius: 10, cursor: "pointer", transition: "all 0.3s", letterSpacing: 0.5,
        }}>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

// ─── TIENDA SECTION ───
function TiendaSection() {
  const [filter, setFilter] = useState("Todos");
  const categories = ["Todos", "Colágeno", "Superfoods", "Vitaminas", "Digestión", "Minerales", "Adaptógenos", "Bundles"];
  const filtered = filter === "Todos" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return (
    <section id="tienda" style={{ fontFamily: FONT, padding: "70px 24px", background: COLORS.bgSoft }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, letterSpacing: 2, display: "block", marginBottom: 8 }}>
            NUESTRA TIENDA
          </span>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: COLORS.text, margin: 0, letterSpacing: -1 }}>
            Explora Nuestros Productos
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 20,
              border: "none", cursor: "pointer", transition: "all 0.2s",
              background: filter === cat ? COLORS.primary : "#fff",
              color: filter === cat ? "#fff" : COLORS.textMuted,
              boxShadow: filter === cat ? `0 4px 12px ${COLORS.primary}30` : "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

// ─── BESTSELLERS SECTION ───
function BestsellersSection() {
  return (
    <section id="bestsellers" style={{ fontFamily: FONT, padding: "70px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icons.Fire />
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, letterSpacing: 2 }}>
                MÁS VENDIDOS
              </span>
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: COLORS.text, margin: 0, letterSpacing: -1 }}>
              Lo Que Más Aman<br />Nuestras Clientas
            </h2>
          </div>
          <button style={{
            fontFamily: FONT, fontSize: 14, fontWeight: 700, color: COLORS.primary, background: "none",
            border: `2px solid ${COLORS.primary}`, padding: "10px 24px", borderRadius: 24, cursor: "pointer",
          }}>
            Ver Todos →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {BESTSELLERS.map(p => <ProductCard key={p.id} product={p} featured />)}
        </div>

        {/* Social Proof */}
        <div style={{
          marginTop: 48, padding: 32, borderRadius: 20,
          background: `linear-gradient(135deg, ${COLORS.primary}08, ${COLORS.secondary}08)`,
          border: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-around", textAlign: "center",
        }}>
          {[
            ["12K+", "Clientas Felices"],
            ["4.8★", "Calificación Promedio"],
            ["98%", "Recomendarían Saluva"],
            ["100%", "Ingredientes Naturales"],
          ].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.primary }}>{num}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 600, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── APRENDE SECTION ───
function AprendeSection() {
  return (
    <section id="aprende" style={{ fontFamily: FONT, padding: "70px 24px", background: COLORS.bgSoft }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.secondary, letterSpacing: 2, display: "block", marginBottom: 8 }}>
            📚 APRENDE CON NOSOTROS
          </span>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: COLORS.text, margin: "0 0 12px", letterSpacing: -1 }}>
            Recursos Para Tu Bienestar
          </h2>
          <p style={{ fontSize: 16, color: COLORS.textMuted, maxWidth: 520, margin: "0 auto" }}>
            Guías, recetarios, masterclasses y más. Aprende a cuidarte desde adentro.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {DIGITAL_PRODUCTS.map(dp => (
            <DigitalProductCard key={dp.id} product={dp} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DigitalProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 16, padding: 28, display: "flex", gap: 20,
        border: `1px solid ${hovered ? COLORS.secondary + "40" : COLORS.border}`,
        transition: "all 0.3s", cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 8px 24px ${COLORS.secondary}15` : "none",
      }}
    >
      <div style={{
        width: 80, height: 80, borderRadius: 16, flexShrink: 0,
        background: `linear-gradient(135deg, ${COLORS.secondary}20, ${COLORS.primary}10)`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
      }}>
        {product.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          {product.tag && (
            <span style={{
              fontSize: 10, fontWeight: 700, background: product.price === 0 ? COLORS.primary : COLORS.secondary,
              color: "#fff", padding: "3px 10px", borderRadius: 8, letterSpacing: 0.5,
            }}>
              {product.tag}
            </span>
          )}
          <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600 }}>{product.type}</span>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, margin: "0 0 6px", fontFamily: FONT }}>
          {product.title}
        </h3>
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 12px", lineHeight: 1.5 }}>
          {product.desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: product.price === 0 ? COLORS.primary : COLORS.text }}>
            {product.price === 0 ? "Gratis" : formatPrice(product.price)}
          </span>
          <button style={{
            fontFamily: FONT, fontSize: 12, fontWeight: 700,
            color: "#fff", background: product.price === 0 ? COLORS.primary : COLORS.secondary,
            border: "none", padding: "8px 20px", borderRadius: 20, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {product.price === 0 ? "Descargar" : "Comprar"} <Icons.Arrow />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ SECTION ───
function QuizSection() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleAnswer = (idx) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const keys = Object.keys(QUIZ_RESULTS);
      setResult(QUIZ_RESULTS[keys[newAnswers[0]] || keys[0]]);
    }
  };

  const reset = () => { setStarted(false); setCurrentQ(0); setAnswers([]); setResult(null); };

  return (
    <section id="quiz" style={{ fontFamily: FONT, padding: "70px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {!started ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 120, height: 120, borderRadius: "50%", margin: "0 auto 24px",
              background: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.secondary}20)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56,
            }}>
              🔮
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.secondary, letterSpacing: 2, display: "block", marginBottom: 8 }}>
              APRENDE A CONOCERTE
            </span>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: COLORS.text, margin: "0 0 16px", letterSpacing: -1 }}>
              Descubre Tu Rutina Ideal
            </h2>
            <p style={{ fontSize: 16, color: COLORS.textMuted, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Responde unas preguntas rápidas y te recomendaremos los productos perfectos para ti.
            </p>
            <button onClick={() => setStarted(true)} style={{
              fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#fff",
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
              border: "none", padding: "16px 40px", borderRadius: 30, cursor: "pointer",
              boxShadow: `0 6px 20px ${COLORS.primary}40`,
            }}>
              Comenzar Quiz ✨
            </button>
          </div>
        ) : result ? (
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 64, display: "block", marginBottom: 16 }}>{result.emoji}</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.text, margin: "0 0 8px" }}>
              ¡Tu Match Perfecto!
            </h2>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: COLORS.primary, margin: "0 0 32px" }}>
              {result.title}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 600, margin: "0 auto 32px" }}>
              {result.products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <button onClick={reset} style={{
              fontFamily: FONT, fontSize: 14, fontWeight: 700, color: COLORS.primary,
              background: `${COLORS.primary}12`, border: "none", padding: "12px 28px",
              borderRadius: 24, cursor: "pointer",
            }}>
              Volver a Intentar
            </button>
          </div>
        ) : (
          <div>
            {/* Progress */}
            <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
              {QUIZ_QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: i <= currentQ ? COLORS.primary : COLORS.border,
                  transition: "all 0.4s",
                }} />
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, display: "block", marginBottom: 12 }}>
                Pregunta {currentQ + 1} de {QUIZ_QUESTIONS.length}
              </span>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, margin: "0 0 32px", lineHeight: 1.3 }}>
                {QUIZ_QUESTIONS[currentQ].question}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 600, margin: "0 auto" }}>
                {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
                  <QuizOption key={i} text={opt} onClick={() => handleAnswer(i)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function QuizOption({ text, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: FONT, fontSize: 15, fontWeight: 600, color: hovered ? "#fff" : COLORS.text,
        background: hovered ? COLORS.primary : "#fff",
        border: `2px solid ${hovered ? COLORS.primary : COLORS.border}`,
        padding: "18px 20px", borderRadius: 14, cursor: "pointer",
        transition: "all 0.2s", textAlign: "left",
        boxShadow: hovered ? `0 4px 16px ${COLORS.primary}30` : "none",
      }}
    >
      {text}
    </button>
  );
}

// ─── FOOTER ───
function Footer() {
  return (
    <footer style={{
      fontFamily: FONT, background: COLORS.text, color: "#fff", padding: "60px 24px 30px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.primary, marginBottom: 16 }}>Saluva</div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 300 }}>
              Bienestar natural diseñado para la mujer moderna. Suplementos que tu cuerpo agradece.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["𝕏", "f", "📷"].map((icon, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer",
                }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
          {[
            { title: "Tienda", items: ["Todos los Productos", "Colágeno", "Superfoods", "Vitaminas", "Bundles"] },
            { title: "Recursos", items: ["Blog", "Guías Gratis", "Recetarios", "Masterclasses", "Quiz de Bienestar"] },
            { title: "Soporte", items: ["Contacto", "FAQ", "Envíos y Devoluciones", "Términos de Servicio", "Política de Privacidad"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, letterSpacing: 0.5 }}>{col.title}</h4>
              {col.items.map(item => (
                <p key={item} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 10px", cursor: "pointer" }}>
                  {item}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            © 2026 Saluva. Todos los derechos reservados.
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {["VISA", "MC", "PSE"].map(m => (
              <span key={m} style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 4 }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN APP ───
export default function SaluvaApp() {
  const [activeSection, setActiveSection] = useState("landing");

  const onNavigate = useCallback((id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const sections = ["landing", "tienda", "bestsellers", "aprende", "quiz"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: FONT, background: COLORS.bg, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <PromoBar />
      <Header activeSection={activeSection} onNavigate={onNavigate} />
      <LandingSection />
      <TiendaSection />
      <BestsellersSection />
      <AprendeSection />
      <QuizSection />
      <Footer />
    </div>
  );
}
