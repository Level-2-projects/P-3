import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import enMessages from '../../messages/en.json';
import { login } from '../lib/api';

export const Login: React.FC = () => {
  const { common, auth } = enMessages;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useMutation({ mutationFn: login });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div
      dir="ltr"
      lang="en"
      className="min-h-screen bg-[#E5E7EB] text-[#1E293B] antialiased flex flex-col justify-between selection:bg-[#991b1b] selection:text-white"
    >
      {/* Header */}
      <header className="w-full bg-[#F8FAFC] border-b border-[#CBD5E1]/60 px-6 py-3.5 flex items-center justify-between shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-dashed border-[#991b1b]/60 bg-[#FEF2F2] flex items-center justify-center p-1.5 shrink-0">
            <img src="/logo.svg" alt={common.logoAlt} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#0F172A]">
                {common.brandName}
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#64748B]">
              {common.serviceSubtitle}
            </span>
          </div>
        </div>

        <div className="w-12 h-12">
          <img
            src="/minstry.svg"
            alt={common.ministryEmblemAlt}
            className="w-full h-full object-contain"
          />
        </div>
      </header>

      {/* Main Centered Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 my-auto">
        <div className="w-full max-w-[440px] flex flex-col items-center gap-4">
          {/* Minimalist Clinical Card */}
          <section className="w-full bg-[#F8FAFC] border border-[#94A3B8]/60 rounded-xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)] p-8">
            {/* Card Header */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-9 h-9 rounded-lg bg-[#991b1b] flex items-center justify-center text-white shadow-sm ring-2 ring-[#991b1b]/20">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
                  {common.brandName}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                {auth.portalSubtitle}
              </p>
            </div>

            {/* Authentication Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Institutional Email Field */}
              <div>
                <label
                  htmlFor="institutional-email"
                  className="block text-xs font-bold uppercase tracking-wider text-[#334155] mb-1.5"
                >
                  {auth.emailLabel}
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="institutional-email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    className="block w-full rounded-lg border-2 border-[#991b1b] bg-white py-3 pl-10 pr-3 text-sm text-[#0F172A] placeholder-[#94A3B8] shadow-sm ring-4 ring-[#991b1b]/10 focus:outline-none focus:ring-4 focus:ring-[#991b1b]/15 transition-all font-medium"
                    placeholder={auth.emailPlaceholder}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="staff-password"
                    className="block text-xs font-bold uppercase tracking-wider text-[#334155]"
                  >
                    {auth.passwordLabel}
                  </label>
                </div>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="staff-password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-[#CBD5E1] bg-white py-3 pl-10 pr-10 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#991b1b] focus:outline-none focus:ring-2 focus:ring-[#991b1b]/20 transition-all font-medium"
                    placeholder={auth.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={auth.togglePasswordAria}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#64748B] hover:text-[#334155] focus:outline-none"
                    title={auth.togglePasswordTitle}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Lockout Alert Area */}
              <div className="rounded-lg bg-[#FEF2F2] border border-[#FCA5A5]/60 p-3 text-xs leading-relaxed text-[#991B1B] flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-bold">{auth.lockoutTitle}</p>
                  <p className="text-[11px] text-[#7F1D1D] mt-0.5">{auth.lockoutMessage}</p>
                </div>
              </div>
              {loginMutation.isError && (
                <p role="alert" className="text-sm text-[#991B1B]">
                  {auth.signInError}
                </p>
              )}
              {loginMutation.isSuccess && (
                <p role="status" className="text-sm text-[#166534]">
                  {auth.signInSuccess}
                </p>
              )}

              {/* Primary Sign In Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loginMutation.isPending || !email || !password}
                  aria-busy={loginMutation.isPending}
                  className="group w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#991b1b] hover:bg-[#7f1d1d] active:bg-[#681717] text-white text-sm font-bold tracking-wide shadow-sm hover:shadow transition-all focus:outline-none focus:ring-4 focus:ring-[#991b1b]/25"
                >
                  <span>{loginMutation.isPending ? auth.signingIn : auth.signInButton}</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-normal uppercase bg-white/20 text-white px-1.5 py-0.5 rounded border border-white/20 group-hover:bg-white/30 transition-colors">
                    <span>{auth.enterKeyHint}</span>
                    <span className="text-xs">↵</span>
                  </span>
                </button>
              </div>
            </form>
          </section>

          <p className="text-xs text-[#64748B]">
            {auth.donorPrompt}{' '}
            <Link to="/" className="font-semibold text-[#0F172A] underline hover:text-[#991b1b]">
              {auth.donorPortalLink}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};