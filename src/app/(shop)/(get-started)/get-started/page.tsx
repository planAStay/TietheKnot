'use client'

import { Logo } from '@/app/logo'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { useTheme } from '@/lib/theme-context'
import Link from 'next/link'
import { useEffect } from 'react'

export default function GetStartedPage() {
  const { setTheme } = useTheme()

  // Force light theme on this page
  useEffect(() => {
    setTheme('light')
  }, [setTheme])
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-text">
      {/* Modern Mesh Gradient Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary to-rose-50" />
        
        {/* Aurora-like animated gradients */}
        <div 
          className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 55%, transparent) 0%, color-mix(in srgb, var(--color-accent) 30%, transparent) 40%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute -right-1/4 top-1/4 h-[600px] w-[600px] rounded-full opacity-35"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 45%, transparent) 0%, color-mix(in srgb, var(--color-primary) 25%, transparent) 50%, transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        <div 
          className="absolute -bottom-1/4 left-1/3 h-[700px] w-[700px] rounded-full opacity-25"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 45%, transparent) 0%, color-mix(in srgb, var(--color-rose-400) 30%, transparent) 45%, transparent 70%)',
            animation: 'float 22s ease-in-out infinite',
            animationDelay: '-5s',
          }}
        />
        
        {/* Noise texture overlay for depth */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient mesh lines */}
        <div className="absolute inset-0 opacity-[0.08]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--color-background)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating orbs with glow */}
        <div 
          className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-secondary shadow-[0_0_20px_8px_color-mix(in_srgb,var(--color-secondary)_30%,transparent)]"
          style={{ animation: 'pulse 4s ease-in-out infinite' }}
        />
        <div 
          className="absolute right-[20%] top-[35%] h-3 w-3 rounded-full bg-accent shadow-[0_0_25px_10px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]"
          style={{ animation: 'pulse 5s ease-in-out infinite', animationDelay: '-2s' }}
        />
        <div 
          className="absolute left-[25%] bottom-[30%] h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_20px_8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]"
          style={{ animation: 'pulse 4.5s ease-in-out infinite', animationDelay: '-1s' }}
        />
        <div 
          className="absolute right-[30%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-blush shadow-[0_0_15px_6px_color-mix(in_srgb,var(--color-blush)_30%,transparent)]"
          style={{ animation: 'pulse 3.5s ease-in-out infinite', animationDelay: '-3s' }}
        />
        <div 
          className="absolute left-[10%] bottom-[10%] h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_8px_color-mix(in_srgb,var(--color-accent)_30%,transparent)]"
          style={{ animation: 'pulse 4.2s ease-in-out infinite', animationDelay: '-1.5s' }}
        />
        <div 
          className="absolute right-[12%] top-[18%] h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_22px_9px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]"
          style={{ animation: 'pulse 4.8s ease-in-out infinite', animationDelay: '-0.8s' }}
        />
        <div 
          className="absolute left-[38%] top-[12%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_16px_7px_color-mix(in_srgb,var(--color-white)_25%,transparent)]"
          style={{ animation: 'pulse 3.8s ease-in-out infinite', animationDelay: '-2.2s' }}
        />
        <div 
          className="absolute right-[40%] bottom-[12%] h-2 w-2 rounded-full bg-secondary shadow-[0_0_18px_8px_color-mix(in_srgb,var(--color-secondary)_35%,transparent)]"
          style={{ animation: 'pulse 4.6s ease-in-out infinite', animationDelay: '-0.4s' }}
        />
        
        {/* Subtle light beams */}
        <div 
          className="absolute left-0 top-0 h-full w-1/2 opacity-15"
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-background) 20%, transparent) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
        {/* Glassmorphism Card */}
        <div className="relative max-w-3xl rounded-3xl border border-accent/30 bg-white/85 p-12 text-center text-text shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-16 md:p-20">
          {/* Card glow effect */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-primary/25 via-transparent to-transparent opacity-60" />
          
          <div className="relative">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/40 px-4 py-2 backdrop-blur-sm text-text">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
                Coming This Year
              </span>
            </div>

            {/* Main Logo/Title */}
            <Heading level={1} className="sr-only">
              TieTheKnot
            </Heading>
            <div className="mb-8 flex justify-center">
              <Logo
                priority
                className="h-16 w-auto drop-shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:h-20"
              />
            </div>

            {/* Tagline */}
            <div className="mb-8">
              <Text className="text-xl font-light tracking-wide text-text/85 sm:text-2xl">
                From <span className="font-medium text-accent">Yes</span> to <span className="font-medium text-accent">I Do</span>
          </Text>
        </div>

            {/* Decorative divider */}
            <div className="mx-auto mb-8 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/50" />
              <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/50" />
        </div>

            {/* Description */}
            <Text className="mx-auto mb-10 max-w-md text-base leading-relaxed text-text/80 sm:text-lg">
              Reimagining how weddings are planned in Sri Lanka. Your dream wedding, simplified.
            </Text>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="https://www.figma.com/deck/VqAu4SOUOfqVOJchXZNmnm/TieTheKnot"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-accent/50 bg-gradient-to-r from-primary to-rose-50 px-8 py-4 text-sm font-semibold text-text shadow-xl shadow-accent/20 transition-all duration-500 hover:shadow-accent/40 hover:scale-[1.02] sm:px-10 sm:py-5 sm:text-base"
                aria-label="Check our portfolio on Instagram"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Profile</span>
                <svg
                  className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5l4 0 0 4M5 19h10a4 4 0 0 0 4-4V9" />
                </svg>
              </Link>

              <Link
                href="https://api.whatsapp.com/send/?phone=94701045483&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-accent/50 bg-gradient-to-r from-primary to-rose-50 px-8 py-4 text-sm font-semibold text-text shadow-xl shadow-accent/20 transition-all duration-500 hover:shadow-accent/40 hover:scale-[1.02] sm:px-10 sm:py-5 sm:text-base"
              >
                {/* Button shine effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                
                <span className="relative">Get in Touch</span>
                <svg 
                  className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Email hint */}
            <div className="mt-8">
              <Text className="text-sm text-text/60">
                tietheknot.lk@gmail.lk
              </Text>
            </div>

            {/* Social Links */}
            <div className="mt-10 flex items-center justify-center gap-4">
              {[
                { 
                  name: 'Instagram', 
                  href: 'https://www.instagram.com/tietheknot.lk/',
                  icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                }
          
              ].map((social) => (
          <Link
                  key={social.name}
                  href={social.href}
            target="_blank"
            rel="noopener noreferrer"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-accent/50 bg-white/80 text-text/70 shadow-md shadow-accent/10 backdrop-blur-sm transition-all duration-300 hover:border-secondary/60 hover:bg-primary/70 hover:text-text"
                  aria-label={social.name}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon}
            </svg>
          </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <Text className="text-xs font-medium uppercase tracking-[0.3em] text-text/60">
            Sri Lanka's Premier Wedding Platform
          </Text>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}
