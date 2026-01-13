"use client";

import { useEffect, useState } from "react";
import { loadData } from "@/utils/localStorage";
import styles from "./ProductivityChart.module.css";

export default function ProductivityChart() {
    const [stats, setStats] = useState([]);
    const [todayScore, setTodayScore] = useState(0);

    useEffect(() => {
        const refresh = () => {
            const data = loadData();
            const daily = data.analytics?.dailyStats || {};

            // Generate last 7 days keys
            const days = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const yyyymmdd = d.toISOString().split("T")[0];
                const dayName = d.toLocaleDateString("en-US", { weekday: 'short' });

                const stat = daily[yyyymmdd];
                days.push({
                    date: yyyymmdd,
                    day: dayName,
                    score: stat ? stat.score : 0,
                    isToday: i === 0
                });
            }

            setStats(days);
            setTodayScore(days[days.length - 1].score);
        };

        refresh();
        window.addEventListener("storage", refresh);
        return () => window.removeEventListener("storage", refresh);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Productivity Score</h3>
                    <p className={styles.subtitle}>Daily Performance</p>
                </div>
                <div className={styles.scoreBig}>
                    {todayScore}<span className={styles.percent}>/100</span>
                </div>
            </div>

            <div className={styles.chart}>
                {stats.map((day) => (
                    <div key={day.date} className={styles.barGroup}>
                        <div className={styles.barTrack}>
                            <div
                                className={styles.barFill}
                                style={{
                                    height: `${day.score}%`,
                                    backgroundColor: day.isToday ? 'var(--text-primary)' : 'var(--text-muted)'
                                }}
                            />
                        </div>
                        <span className={styles.barLabel} style={{ color: day.isToday ? 'var(--text-primary)' : '' }}>
                            {day.day}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
