"use client";

import { useEffect, useState } from "react";
import { loadData } from "@/utils/localStorage";
import styles from "./GodMode.module.css";

// Helper to get day level based on score (0-4)
const getLevel = (score) => {
    if (!score || score === 0) return 0;
    if (score < 30) return 1;
    if (score < 60) return 2;
    if (score < 90) return 3;
    return 4;
};

export default function GodMode() {
    const [stats, setStats] = useState({});
    const [totalActiveDays, setTotalActiveDays] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [hoveredDay, setHoveredDay] = useState(null);

    useEffect(() => {
        // Load data on mount and listen for updates
        const updateData = () => {
            const data = loadData();
            const daily = data.analytics?.dailyStats || {};
            setStats(daily);
            calculateStreaks(daily);
        };

        updateData();
        window.addEventListener("storage", updateData);
        return () => window.removeEventListener("storage", updateData);
    }, []);

    const calculateStreaks = (daily) => {
        const dates = Object.keys(daily).sort();
        let current = 0;
        let max = 0;
        let active = 0;
        let streak = 0;

        // Calculate active days
        active = dates.filter(d => daily[d].score > 0).length;

        // Calculate streaks (simplified logic)
        // In a real app, need to handle gaps. For now, checking explicit dates.
        const today = new Date().toISOString().split('T')[0];

        // Simple iteration for max streak
        // (A robust solution would iterate every day of the year, but this is a lite version)
        // ... (Logic omitted for brevity in V1, utilizing total active for now)

        setTotalActiveDays(active);
        // setMaxStreak(max); // TODO: Implement robust calendar streak logic later
    };

    // Generate last 365 days
    const generateCalendar = () => {
        const days = [];
        const today = new Date();
        // Start 52 weeks ago (approx 364 days)
        // Simplify: Just show last 140 days (20 weeks) for cleaner UI on desktop
        const totalDays = 140;

        for (let i = totalDays; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            days.push({
                date: dateStr,
                data: stats[dateStr] || { score: 0, medium: 0, content: 0, poker: 0, focusMinutes: 0 }
            });
        }
        return days;
    };

    const calendar = generateCalendar();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>God Mode Activity</h3>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{totalActiveDays}</span>
                        <span className={styles.statLabel}>Active Days</span>
                    </div>
                </div>
            </div>

            <div className={styles.heatmap}>
                {calendar.map((day) => (
                    <div
                        key={day.date}
                        className={styles.day}
                        data-level={getLevel(day.data.score)}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                    />
                ))}

                {/* Tooltip */}
                {hoveredDay && (
                    <div className={styles.tooltip}>
                        <div className={styles.tooltipHeader}>{hoveredDay.date}</div>
                        <div className={styles.tooltipRow}>Score: <span className={styles.highlight}>{hoveredDay.data.score}</span></div>
                        {hoveredDay.data.medium > 0 && <div>📝 Medium: {hoveredDay.data.medium}</div>}
                        {hoveredDay.data.content > 0 && <div>🎬 Content: {hoveredDay.data.content}</div>}
                        {hoveredDay.data.poker > 0 && <div>♠️ Poker: {hoveredDay.data.poker}</div>}
                        {hoveredDay.data.focusMinutes > 0 && <div>⏱️ Focus: {hoveredDay.data.focusMinutes}m</div>}
                    </div>
                )}
            </div>

            <div className={styles.legend}>
                <span>Less</span>
                <div className={styles.day} data-level="0"></div>
                <div className={styles.day} data-level="1"></div>
                <div className={styles.day} data-level="2"></div>
                <div className={styles.day} data-level="3"></div>
                <div className={styles.day} data-level="4"></div>
                <span>More</span>
            </div>
        </div>
    );
}
