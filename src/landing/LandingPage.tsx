import { Button } from '../shared/ui/Button';
import { HalftoneBlock } from '../shared/ui/HalftoneBlock';
import { Tag } from '../shared/ui/Tag';
import { Wordmark } from '../shared/ui/Mark';
import { Reveal } from '../shared/ui/Reveal';
import { PrefsBar } from '../shared/ui/PrefsBar';
import { SEED_GARMENTS } from '../wardrobe/utils/seedWardrobe';
import { useI18n } from '../i18n/I18nProvider';
import { categoryLabel, seedLabel } from '../i18n/labels';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const { t } = useI18n();

  const stats = [
    { label: t('landing.statCloud'), value: '0' },
    { label: t('landing.statOnDevice'), value: '100%' },
    { label: t('landing.statAccounts'), value: t('landing.statAccountsValue') },
  ];

  const steps = [
    { n: '01', tag: t('landing.step1Tag'), title: t('landing.step1Title'), body: t('landing.step1Body') },
    { n: '02', tag: t('landing.step2Tag'), title: t('landing.step2Title'), body: t('landing.step2Body') },
    { n: '03', tag: t('landing.step3Tag'), title: t('landing.step3Title'), body: t('landing.step3Body') },
  ];

  const marquee = [
    t('landing.marquee.tops'),
    t('landing.marquee.bottoms'),
    t('landing.marquee.shoes'),
    t('landing.marquee.outers'),
    t('landing.marquee.accessories'),
    t('landing.marquee.local'),
    t('landing.marquee.webllm'),
    t('landing.marquee.pwa'),
  ];

  return (
    <div className="min-h-dvh overflow-x-hidden bg-canvas text-ink">
      <header className="px-4 pt-4 md:px-6 md:pt-6">
        <Reveal>
          <div className="mx-auto max-w-[1280px]">
            <nav className="flex items-center justify-between gap-3 rounded-pill bg-surface py-2 pr-2 pl-4">
              <Wordmark />
              <div className="flex items-center gap-1">
                <PrefsBar />
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex"
                  onClick={() => document.getElementById('como')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('nav.how')}
                </Button>
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex"
                  onClick={() => document.getElementById('looks')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('nav.looks')}
                </Button>
                <Button onClick={onEnter} className="anim-ember">
                  {t('nav.enter')}
                </Button>
              </div>
            </nav>
          </div>
        </Reveal>
      </header>

      <main className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 py-10 md:gap-20 md:px-6 md:py-16">
        <section className="grid items-end gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <Reveal>
              <Tag>{t('landing.tag')}</Tag>
            </Reveal>
            <Reveal delayMs={80}>
              <h1 className="mt-4 font-display text-display leading-display tracking-[0.02em] text-ink whitespace-pre-line">
                {t('landing.hero')}
              </h1>
            </Reveal>
            <Reveal delayMs={160}>
              <p className="mt-6 max-w-md font-dm-sans font-medium text-body leading-body">
                {t('landing.lede')}
              </p>
            </Reveal>
            <Reveal delayMs={240} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button onClick={onEnter} className="anim-ember">
                {t('landing.ctaArmario')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => document.getElementById('como')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('landing.ctaHow')}
              </Button>
            </Reveal>
          </div>

          <Reveal delayMs={180}>
            <HalftoneBlock className="aspect-[4/5] w-full md:aspect-[5/6]">
              <div className="flex h-full flex-col justify-end p-6 md:p-10">
                <p className="font-display text-heading-2xl leading-heading-2xl tracking-[0.02em] text-chalk">
                  PWA
                </p>
                <p className="mt-1 font-dm-sans font-medium text-body-sm leading-body-sm text-chalk/90">
                  {t('landing.halftoneKicker')}
                </p>
              </div>
            </HalftoneBlock>
          </Reveal>
        </section>

        <div className="overflow-hidden rounded-card border-[1.5px] border-dotted border-ink bg-surface py-4">
          <div className="marquee-track gap-8 px-6">
            {[...marquee, ...marquee].map((word, i) => (
              <span key={`${word}-${i}`} className="flex items-center gap-8">
                <span className="font-display text-heading tracking-[0.02em] text-ink">{word}</span>
                <span className="h-6 w-px border-l-[1.5px] border-dotted border-ink" aria-hidden />
              </span>
            ))}
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delayMs={i * 90}>
              <article className="rounded-card bg-ember p-6 text-chalk transition-transform duration-300 motion-safe:hover:-translate-y-1 md:p-10">
                <p className="font-dm-sans font-medium text-body-sm leading-body-sm">{stat.label}</p>
                <p className="mt-2 font-display text-heading-2xl leading-heading-2xl tracking-[0.02em]">
                  {stat.value}
                </p>
              </article>
            </Reveal>
          ))}
        </section>

        <section id="como" className="flex flex-col gap-4">
          <Reveal>
            <div className="border-t-[1.5px] border-dotted border-ink pt-10 md:pt-20">
              <h2 className="font-display text-heading-lg leading-heading-lg tracking-[0.02em]">
                {t('landing.stepsTitle')}
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.tag} delayMs={i * 100}>
                <article className="flex h-full flex-col gap-4 rounded-card bg-surface p-6 transition-transform duration-300 motion-safe:hover:-translate-y-1 md:p-10">
                  <div className="flex items-center justify-between gap-3">
                    <Tag>{step.tag}</Tag>
                    <span className="font-display text-heading tracking-[0.02em] text-ember">{step.n}</span>
                  </div>
                  <h3 className="font-display text-heading leading-heading tracking-[0.02em]">{step.title}</h3>
                  <p className="font-dm-sans font-medium text-body leading-body">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="looks" className="flex flex-col gap-4">
          <Reveal>
            <div className="border-t-[1.5px] border-dotted border-ink pt-10 md:pt-20">
              <h2 className="font-display text-heading-lg leading-heading-lg tracking-[0.02em]">
                {t('landing.looksTitle')}
              </h2>
              <p className="mt-3 max-w-lg font-dm-sans font-medium text-body leading-body">
                {t('landing.looksBody')}
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SEED_GARMENTS.map((garment, i) => (
              <Reveal key={garment.src} delayMs={(i % 4) * 70}>
                <article className="overflow-hidden rounded-card bg-surface transition-transform duration-300 motion-safe:hover:-translate-y-1">
                  <img
                    src={garment.src}
                    alt={seedLabel(garment.id)}
                    className="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-2 p-4">
                    <Tag>{categoryLabel(garment.category)}</Tag>
                    <h3 className="truncate font-display text-subheading leading-subheading tracking-[0.02em]">
                      {seedLabel(garment.id)}
                    </h3>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <section className="rounded-card bg-inverse p-6 text-on-inverse md:flex md:items-end md:justify-between md:gap-10 md:p-10">
            <div>
              <h2 className="font-display text-heading-lg leading-heading-lg tracking-[0.02em] whitespace-pre-line">
                {t('landing.ctaBandTitle')}
              </h2>
              <p className="mt-4 max-w-lg font-dm-sans font-medium text-body leading-body text-on-inverse/90">
                {t('landing.ctaBandBody')}
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:shrink-0">
              <Button onClick={onEnter} className="anim-ember">
                {t('landing.ctaBandButton')}
              </Button>
            </div>
          </section>
        </Reveal>
      </main>

      <footer className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 pb-10 md:flex-row md:items-center md:justify-between md:px-6 md:pb-16">
        <Wordmark />
        <p className="font-system text-caption leading-caption text-ink">{t('landing.footer')}</p>
      </footer>
    </div>
  );
}
