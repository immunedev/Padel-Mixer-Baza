'use client';

import { useApp } from '@/context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';

export default function Header() {
    const { t, locale, setLocale } = useApp();

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-navy-950/80 border-b border-navy-700/30">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-8 md:h-10 transition-transform group-hover:scale-105">
                        <Image
                            src="/baza-padel-logo.png"
                            alt="Baza Padel Club"
                            width={160}
                            height={40}
                            className="h-full w-auto object-contain"
                        />
                    </div>
                </Link>

                <div className="flex items-center">
                    <div className="flex rounded-full bg-navy-800/80 border border-navy-600/30 p-0.5 gap-0.5">
                        <button
                            onClick={() => setLocale('pl')}
                            className={`relative px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${locale === 'pl'
                                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/30'
                                : 'text-navy-400 hover:text-navy-200'
                                }`}
                        >
                            PL
                        </button>
                        <button
                            onClick={() => setLocale('en')}
                            className={`relative px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${locale === 'en'
                                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/30'
                                : 'text-navy-400 hover:text-navy-200'
                                }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLocale('de')}
                            className={`relative px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${locale === 'de'
                                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/30'
                                : 'text-navy-400 hover:text-navy-200'
                                }`}
                        >
                            DE
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
