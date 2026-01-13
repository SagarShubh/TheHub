"use client";

import LoginGate from "@/components/Auth/LoginGate";
import BentoGrid, { BentoCard } from "@/components/Dashboard/BentoGrid";
import GrowthEngine from "@/components/Growth/GrowthEngine";
import MediumTracker from "@/components/MediumTracker/MediumTracker";
import ContentPlanner from "@/components/ContentPlanner/ContentPlanner";
import PokerTracker from "@/components/PokerTracker/PokerTracker";
import SmartSuggestions from "@/components/AI/SmartSuggestions";
import FocusTimer from "@/components/Productivity/FocusTimer";
import GodMode from "@/components/Analytics/GodMode";
import CloudSync from "@/components/Auth/CloudSync";

export default function Home() {
  return (
    <LoginGate>
      <main style={{ padding: "40px 0", minHeight: "100vh" }}>
        <header style={{
          maxWidth: "1400px",
          margin: "0 auto 40px",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="The Hub Logo" className="w-12 h-12 rounded-xl shadow-lg" />
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                The Hub
              </h1>
              <p className="text-zinc-400 font-medium">
                Welcome back, Creator. Let&apos;s kill it today.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <CloudSync />
            <div className="glass-panel px-4 py-2 rounded-full border border-slate-200 bg-white/50">
              <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                Beta v1.0
              </span>
            </div>
          </div>
        </header>

        <BentoGrid>
          {/* God Mode Activity - Large */}
          <BentoCard size="large">
            <GodMode />
          </BentoCard>

          {/* Growth Engine - Large */}
          <BentoCard size="large">
            <GrowthEngine />
          </BentoCard>

          {/* AI Suggestions - Tall (Right Stack) - Replaces Medium for layout, moving Medium down */}
          <BentoCard size="tall">
            <SmartSuggestions />
          </BentoCard>

          {/* Medium Tracker - Medium */}
          <BentoCard size="medium">
            <MediumTracker />
          </BentoCard>

          {/* Content Planner - Large (Tall) */}
          <BentoCard size="tall">
            <ContentPlanner />
          </BentoCard>

          {/* Poker Tracker - Medium */}
          <BentoCard size="medium">
            <PokerTracker />
          </BentoCard>

          {/* Focus Timer - Small */}
          <BentoCard size="small">
            <FocusTimer />
          </BentoCard>

        </BentoGrid>
      </main>
    </LoginGate>
  );
}
