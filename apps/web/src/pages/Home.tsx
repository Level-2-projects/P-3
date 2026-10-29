import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import arMessages from '../../messages/ar.json';
import { getCenters, getPublishedArticles } from '../lib/api';

export const Home: React.FC = () => {
  const { header, hero, locator, awareness, chatbot, footer } = arMessages;

  const [selectedGov, setSelectedGov] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [selectedCenter, setSelectedCenter] = useState({
    name: locator.defaultSelectedName,
    desc: locator.defaultSelectedDesc,
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const centersQuery = useQuery({
    queryKey: ['public-centers', selectedGov, debouncedSearchQuery],
    queryFn: ({ signal }) =>
      getCenters(
        { governorate: selectedGov, search: debouncedSearchQuery },
        signal,
      ),
  });
  const articlesQuery = useQuery({
    queryKey: ['published-articles'],
    queryFn: ({ signal }) => getPublishedArticles(signal),
  });

  const centers = centersQuery.data ?? [];
  const articles = articlesQuery.data ?? [];

  const handleFocusOnMap = (name: string, lat: number, lng: number) => {
    setSelectedCenter({
      name,
      desc: `${locator.coordinatesPrefix} ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E - ${locator.connectedStatus}`,
    });
  };

  return (
    <div
      dir="rtl"
      lang="ar"
      className="bg-background font-body-md text-on-surface antialiased justify-start items-start flex flex-col min-h-screen w-full overflow-x-hidden"
    >
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <img
              alt={header.ministryCrestAlt}
              className="h-14 w-auto object-contain"
              src="/minstry.svg"
            />
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-tertiary-container tracking-wider">
                {header.ministryTitle}
              </span>
              <span className="font-title-md text-title-md text-on-surface font-headline-lg">
                {header.portalTitle}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-space-xs p-1 bg-surface-container-low rounded-xl">
            <a
              href="#centers-locator"
              className="px-space-md py-space-xs rounded-lg transition-all bg-surface-container text-primary font-bold"
            >
              {header.navCenters}
            </a>
            <a
              href="#health-awareness"
              className="px-space-md py-space-xs rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
            >
              {header.navArticles}
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {/* يظهر فقط في بيئة التطوير المحلية ويختفي تماماً في الإنتاج كخط دفاع أمني */}
            {import.meta.env.DEV && (
              <Link
                to="/login"
                className="text-xs font-bold text-secondary hover:text-primary transition-colors px-3 py-2 rounded-lg bg-surface-container-low border border-dashed border-outline-variant"
              >
                {header.devStaffLink}
              </Link>
            )}
            <img
              src="/logo.svg"
              alt={header.systemLogoAlt}
              className="h-10 w-auto object-contain drop-shadow"
            />
          </div>
        </div>
      </header>

      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="flex flex-col w-full">
          {/* 1. Hero Section & Psychological Reassurance Cards */}
          <section className="w-full relative overflow-hidden py-space-xl">
            <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg">
                <div className="flex flex-col gap-space-sm max-w-3xl">
                  <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant w-fit shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span className="font-label-lg text-label-lg">{hero.badge}</span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                    {hero.title}
                  </h1>
                  <p className="font-body-lg text-body-lg text-secondary">
                    {hero.subtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                    <a
                      className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary px-space-xl py-space-sm rounded-lg font-label-lg text-label-lg shadow-md hover:bg-primary transition-all transform active:scale-95"
                      href="#centers-locator"
                    >
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                      <span>{hero.ctaButton}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 4 Reassurance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {hero.cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-space-xs relative overflow-hidden group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface pt-space-xs font-bold">
                      {card.title}
                    </h3>
                    <p className="font-body-md text-body-md text-secondary">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Regional Centers Locator & Interactive Map Section */}
          <section className="w-full py-space-xl" id="centers-locator">
            <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary-container bg-tertiary-fixed/30 px-space-sm py-0.5 rounded-lg w-fit">
                    <span className="material-symbols-outlined text-[16px]">domain_verification</span>
                    <span>{locator.badge}</span>
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    {locator.title}
                  </h2>
                  <p className="font-body-md text-body-md text-secondary">
                    {locator.subtitle}
                  </p>
                </div>

                {/* Governorate Filter Dropdown */}
                <div className="relative min-w-[260px] self-start md:self-auto">
                  <select
                    value={selectedGov}
                    onChange={(e) => setSelectedGov(e.target.value)}
                    className="w-full bg-surface-container-lowest text-on-surface font-label-lg text-label-lg py-2.5 px-space-md pr-10 rounded-xl shadow-sm border border-outline-variant/40 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">{locator.governorates.all}</option>
                    <option value="alex">{locator.governorates.alex}</option>
                    <option value="cairo">{locator.governorates.cairo}</option>
                    <option value="giza">{locator.governorates.giza}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary">
                    <span className="material-symbols-outlined text-[20px]">location_city</span>
                  </div>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-secondary">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Split 2-Column: Centers List & Map Simulation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                {/* Centers List (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-space-md max-h-[720px] overflow-y-auto pr-1">
                  {centersQuery.isLoading && (
                    <p className="rounded-xl bg-surface-container-lowest p-space-md text-secondary">
                      {locator.loading}
                    </p>
                  )}
                  {centersQuery.isError && (
                    <p role="alert" className="rounded-xl bg-red-50 p-space-md text-red-800">
                      {locator.error}
                    </p>
                  )}
                  {!centersQuery.isLoading && !centersQuery.isError && centers.length === 0 && (
                    <p className="rounded-xl bg-surface-container-lowest p-space-md text-secondary">
                      {locator.empty}
                    </p>
                  )}
                  {centers.map((center) => (
                    <div
                      key={center.id}
                      className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-space-xs"
                    >
                      <div className="flex items-start justify-between gap-space-xs">
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-800 bg-emerald-100 px-space-sm py-0.5 rounded-full font-semibold">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>{center.badge}</span>
                        </span>
                      </div>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">
                        {center.name}
                      </h3>
                      <p className="font-body-md text-body-md text-secondary flex items-start gap-1">
                        <span className="material-symbols-outlined text-[18px] text-outline shrink-0 mt-0.5">
                          location_on
                        </span>
                        <span>{center.address}</span>
                      </p>
                      <div className="flex items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant pt-1">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            center.isEmergency ? 'text-primary font-bold' : ''
                            }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">schedule</span>{' '}
                          {center.schedule}
                        </span>
                        {center.extraInfo && (
                          <span className="inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              {center.extraIcon}
                            </span>
                            {center.extraInfo}
                          </span>
                        )}
                      </div>
                      <div className="pt-space-xs flex items-center gap-space-sm mt-1">
                        <button
                          type="button"
                          onClick={() => handleFocusOnMap(center.name, center.lat, center.lng)}
                          className="bg-surface-container text-on-surface py-2 px-space-md rounded-lg font-label-lg text-label-lg hover:bg-surface-container-high transition-all flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[18px]">directions</span>
                          <span>{locator.directionsBtn}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map Simulation Screen (7 cols) */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-3 flex flex-col gap-3 min-h-[520px] lg:h-[720px] relative overflow-hidden">
                  <div className="flex items-center justify-between gap-space-sm z-10 bg-surface-container-lowest/90 backdrop-blur-md p-space-sm rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        search
                      </span>
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none placeholder:text-outline"
                        placeholder={locator.searchPlaceholder}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="relative flex-1 w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    <svg
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                      preserveAspectRatio="none"
                      viewBox="0 0 800 600"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect fill="#e2edfd" height="600" width="800" />
                      <path
                        d="M 0,180 Q 250,140 500,210 T 800,190 L 800,600 L 0,600 Z"
                        fill="#f8fafc"
                      />
                      <path
                        d="M 120,600 L 120,240 Q 180,220 340,230 L 780,260"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="12"
                      />
                      <path d="M 340,230 L 340,600" fill="none" stroke="#cbd5e1" strokeWidth="10" />
                      <path
                        d="M 40,210 Q 200,240 420,330 T 780,520"
                        fill="none"
                        stroke="#fcd34d"
                        strokeWidth="5"
                      />
                    </svg>

                    {/* Active Info Card Overlay */}
                    <div className="absolute top-4 left-4 max-w-xs bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-xl shadow-lg border border-surface-container z-10 flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-label-sm text-label-sm text-primary font-bold">
                          {locator.selectedCenterLabel}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                          {locator.openNowBadge}
                        </span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface font-bold text-sm">
                        {selectedCenter.name}
                      </h4>
                      <p className="font-body-sm text-body-sm text-secondary text-xs">
                        {selectedCenter.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Approved Medical Articles Section */}
          <section className="w-full bg-surface-container-low py-space-xl" id="health-awareness">
            <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary-container bg-tertiary-fixed/30 px-space-sm py-0.5 rounded-lg w-fit">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>{awareness.badge}</span>
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    {awareness.title}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {articlesQuery.isLoading && (
                  <p className="md:col-span-3 rounded-xl bg-surface-container-lowest p-space-md text-secondary">
                    {awareness.loading}
                  </p>
                )}
                {articlesQuery.isError && (
                  <p role="alert" className="md:col-span-3 rounded-xl bg-red-50 p-space-md text-red-800">
                    {awareness.error}
                  </p>
                )}
                {!articlesQuery.isLoading && !articlesQuery.isError && articles.length === 0 && (
                  <p className="md:col-span-3 rounded-xl bg-surface-container-lowest p-space-md text-secondary">
                    {awareness.empty}
                  </p>
                )}
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col justify-between gap-space-md"
                  >
                    <div className="flex flex-col gap-space-xs">
                      <span className="text-xs font-bold text-primary">{article.category}</span>
                      <h3 className="font-title-lg text-title-lg text-on-surface font-bold">
                        {article.title}
                      </h3>
                      <p className="font-body-md text-body-md text-secondary">{article.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Chatbot Button (Fixed sizing & proportion) */}
      <aside className="fixed bottom-6 left-6 z-40">
        <button
          className="flex items-center justify-center w-14 h-14 bg-surface-container-lowest text-primary rounded-full shadow-lg border border-outline-variant/30 hover:bg-surface-container-low hover:scale-105 active:scale-95 transition-all"
          type="button"
          title={chatbot.buttonTitle}
          aria-label={chatbot.buttonTitle}
        >
          <img src="/chatbot.svg" alt={chatbot.alt} className="w-7 h-7 object-contain" />
        </button>
      </aside>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-space-xl">
        <div className="h-1 w-full bg-tertiary-fixed-dim/40" />
        <div className="max-w-7xl mx-auto px-margin py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-secondary">
          <p>{footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
};