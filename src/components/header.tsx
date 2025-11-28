"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Version */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 relative"
              >
                <rect width="32" height="32" rx="8" fill="#FF6309" />
                <path
                  d="M8 10h16v2H8v-2zm0 5h12v2H8v-2zm0 5h8v2H8v-2z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              FACEIT <span className="text-orange-500">Insights</span>
            </span>
            <Badge
              variant="secondary"
              className="bg-slate-800 text-slate-400 border-slate-700 text-xs font-medium"
            >
              0.2.2
            </Badge>
          </Link>

          {/* GitHub Link */}
          <a
            href="https://github.com/berkayburakm/faceit-insights"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            aria-label="View on GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
