import { LogoMark, LogoWordmark } from '../shared/components/Logo';

interface LandingPageProps {
  onEnterApp: () => void;
}

const STATS = [
  { label: 'Prendas offline', value: '∞' },
  { label: 'IA on-device', value: '0$' },
  { label: 'Privacidad', value: '100%' },
  { label: 'Instalable', value: 'PWA' },
];

const FEATURES = [
  {
    tag: 'Armario',
    title: 'Subí, filtrá y organizá tu ropa en un solo lugar',
    body: 'Fotos locales, categorías rápidas y búsqueda. Todo queda en tu dispositivo — sin cuentas ni nube.',
  },
  {
    tag: 'Outfits',
    title: 'Combiná al azar o dejá que la IA elija',
    body: 'Generá looks en un toque. Con WebGPU, el modelo corre en el navegador y nunca sale de tu teléfono.',
  },
  {
    tag: 'Favoritos',
    title: 'Guardá los looks que funcionan',
    body: 'Historial de outfits, notas de la IA y compartir como imagen cuando quieras lucirlo.',
  },
];

export function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="min-h-dvh bg-pumice text-obsidian">
      {/* Nav */}
      <header className="page-shell pt-4 md:pt-6 sticky top-0 z-40 bg-pumice/90 backdrop-blur-sm">
        <div className="nav-pill justify-between gap-3 flex-wrap">
          <LogoWordmark />
          <nav className="hidden sm:flex items-center gap-1">
            <a href="#features" className="btn-ghost">
              Features
            </a>
            <a href="#stats" className="btn-ghost">
              Stats
            </a>
            <a href="#cta" className="btn-ghost">
              Empezar
            </a>
          </nav>
          <button type="button" onClick={onEnterApp} className="btn-primary shrink-0">
            Abrir app
          </button>
        </div>
      </header>

      <main>
        {/* Hero — brand first, one headline, one support, one CTA, halftone */}
        <section className="page-shell pt-10 md:pt-16 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6 animate-rise">
              <div className="inline-flex items-center gap-2">
                <LogoMark className="w-8 h-8" />
                <span className="tag-sulfur">Mobile-first · Offline</span>
              </div>

              <h1 className="font-display text-display-fluid text-obsidian">
                WARDROBE
              </h1>

              <p className="font-body text-body md:text-[18px] leading-[1.55] max-w-md text-obsidian/80">
                Tu armario inteligente en el bolsillo. Forjá outfits con calor
                gráfico Caldera — plano, naranja y tipografía a escala de cartel.
              </p>

              <div className="flex flex-wrap items-center gap-3 animate-rise-delay">
                <button type="button" onClick={onEnterApp} className="btn-primary">
                  Entrar al armario
                </button>
                <a href="#features" className="btn-secondary">
                  Ver cómo funciona
                </a>
              </div>
            </div>

            <div
              className="halftone-block animate-rise-delay-2 min-h-[280px] md:min-h-[420px] w-full relative"
              aria-hidden="true"
            >
              <div className="absolute inset-0 animate-halftone opacity-90 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #fc5000 1.1px, transparent 1.35px)',
                  backgroundSize: '6px 6px',
                  maskImage:
                    'linear-gradient(135deg, transparent 0%, black 40%, black 100%)',
                }}
              />
              <div className="relative z-10 flex h-full min-h-[280px] md:min-h-[420px] items-end p-8 md:p-10">
                <p className="font-display text-[48px] md:text-[80px] leading-[1.05] tracking-[0.02em] text-chalk">
                  FORGE
                  <br />
                  YOUR LOOK
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats — Ember feature cards */}
        <section id="stats" className="page-shell pb-16 md:pb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
            {STATS.map((stat) => (
              <article key={stat.label} className="card-ember !p-6 md:!p-10">
                <p className="font-body text-body-sm text-chalk/90 mb-2">{stat.label}</p>
                <p className="font-display text-[48px] md:text-[80px] leading-[1.1] tracking-[0.02em] text-chalk">
                  {stat.value}
                </p>
              </article>
            ))}
          </div>
        </section>

        <hr className="divider-dotted page-shell mb-16 md:mb-20" />

        {/* Features */}
        <section id="features" className="page-shell pb-16 md:pb-24 space-y-10">
          <div className="max-w-xl space-y-3">
            <span className="tag-sulfur">Qué hace</span>
            <h2 className="font-display text-heading-fluid text-obsidian">
              TRES MOVES. UN LOOK.
            </h2>
            <p className="font-body text-body text-obsidian/75">
              Armario, generador y favoritos — la misma superficie de piedra caliza
              y embers en cada pantalla.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {FEATURES.map((feature, index) => (
              <article key={feature.tag} className="card-limestone flex flex-col gap-4 !p-6 md:!p-10">
                <div
                  className={`h-28 md:h-36 rounded-[20px] overflow-hidden ${
                    index === 1 ? 'card-plasma' : 'bg-ember'
                  }`}
                >
                  {index === 1 && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle, #fc5000 1.1px, transparent 1.35px)',
                        backgroundSize: '5px 5px',
                        opacity: 0.9,
                      }}
                    />
                  )}
                </div>
                <span className="tag-sulfur w-fit">{feature.tag}</span>
                <h3 className="font-display text-[26px] md:text-[32px] leading-[1.05] tracking-[0.64px] text-obsidian">
                  {feature.title}
                </h3>
                <p className="font-body text-body-sm md:text-body text-obsidian/70 leading-[1.5]">
                  {feature.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Dark CTA */}
        <section id="cta" className="page-shell pb-20 md:pb-28">
          <div className="rounded-[40px] bg-obsidian text-chalk p-8 md:p-16 space-y-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="font-display text-[48px] md:text-[80px] leading-[1.05] tracking-[0.02em]">
                LISTO PARA
                <br />
                EL CALOR
              </h2>
              <p className="font-body text-body text-chalk/75 max-w-md">
                Abrí la app, cargá tus prendas y generá el próximo outfit.
                Funciona como PWA en el home screen de tu móvil.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <button type="button" onClick={onEnterApp} className="btn-primary w-full sm:w-auto">
                Abrir Wardrobe
              </button>
              <p className="font-caption text-chalk/50 sm:pl-2">
                Sin registro · Datos locales · WebLLM opcional
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="page-shell pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t-[1.5px] border-dotted border-obsidian">
          <LogoWordmark />
          <p className="font-caption text-obsidian/60">
            Diseño Caldera · forge fire on warm limestone
          </p>
        </div>
      </footer>
    </div>
  );
}
