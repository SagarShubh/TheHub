"use client";

import { useEffect, useState } from "react";
import { loadData, saveData, addSkillXP, logActivity } from "@/utils/localStorage";
import styles from "./MediumTracker.module.css";

export default function MediumTracker() {
    const [streak, setStreak] = useState(0);
    const [lastCheckIn, setLastCheckIn] = useState(null);
    const [checkedToday, setCheckedToday] = useState(false);

    useEffect(() => {
        const data = loadData();
        // Assuming we store medium analytics in data.analytics.medium for now or just generic tasks
        // For specific Medium tracking, let's look at last tasks
        // Ideally we'd store a dedicated 'mediumStreak' in data.streaks if we had that detailed schema yet
        // For V1 MVP, simplified:

        // Check if we have a stored streak for medium
        // If not, default to 0
        // for MVP logic let's keep it local state simulated from data if needed, or simple direct storage
        const mData = localStorage.getItem("medium_tracker_v1");
        if (mData) {
            const parsed = JSON.parse(mData);
            setStreak(parsed.streak || 0);
            setLastCheckIn(parsed.lastCheckIn);

            if (parsed.lastCheckIn) {
                const today = new Date().toDateString();
                const last = new Date(parsed.lastCheckIn).toDateString();
                if (today === last) setCheckedToday(true);
            }
        }
    }, []);

    const handleCheckIn = () => {
        if (checkedToday) return;

        const newStreak = streak + 1;
        setStreak(newStreak);
        setCheckedToday(true);
        const now = new Date().toISOString();
        setLastCheckIn(now);

        // Persist tracker specific data
        localStorage.setItem("medium_tracker_v1", JSON.stringify({
            streak: newStreak,
            lastCheckIn: now
        }));

        // GROWTH ENGINE INTEGRATION: Add XP to Writing Skill
        addSkillXP("writing", 50); // 50 XP for a writing session
        logActivity("medium", 1);

        // Trigger a window event so GrowthEngine updates immediately (simple event bus)
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Medium Tracker</h3>
                <div className={styles.streakBadge}>
                    🔥 {streak} Day Streak
                </div>
            </div>

            <div className={styles.mainAction}>
                {checkedToday ? (
                    <div className={styles.successMessage}>
                        <h3>Great Work! ✍️</h3>
                        <p>You&apos;ve built momentum today.</p>
                        <p className={styles.xpText}>+50 Writing XP Gained</p>
                    </div>
                ) : (
                    <button className={styles.checkInButton} onClick={handleCheckIn}>
                        Did you write today?
                    </button>
                )}
            </div>

            <div className={styles.footer}>
                <div className={styles.stat}>
                    <span className={styles.label}>Frequency</span>
                    <span className={styles.value}>Daily</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.label}>Next Due</span>
                    <span className={styles.value}>Today</span>
                </div>
            </div>
        </div>
    );
}
