"use client";

import { useEffect, useState } from "react";
import { loadData } from "@/utils/localStorage";
import styles from "./GrowthEngine.module.css";

export default function GrowthEngine() {
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(loadData());
    }, []);

    if (!data) return <div className="glass-panel">Loading Growth...</div>;

    const { skills } = data;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Growth Engine</h3>
                <span className={styles.levelBadge}>Creator Lvl {data.profile.level}</span>
            </div>

            {/* Skill Radar (Simplified as bars for V1) */}
            <div className={styles.skillsGrid}>
                <SkillBar name="Writing" skill={skills.writing} color="var(--accent-medium)" />
                <SkillBar name="Poker" skill={skills.poker} color="var(--accent-poker)" />
                <SkillBar name="Content" skill={skills.content} color="var(--accent-content)" />
            </div>

            {/* Actionable Feedback */}
            <div className={styles.feedbackSection}>
                <h4 className={styles.subtitle}>Improvement Zone</h4>
                <div className={styles.challengeCard}>
                    <p className={styles.challengeText}>
                        🎯 <strong>Challenge:</strong> Write 2 Medium articles this week to reach
                        <span style={{ color: "var(--accent-medium)" }}> Writing Lvl {skills.writing.level + 1}</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}

function SkillBar({ name, skill, color }) {
    const progress = (skill.xp / (skill.level * 100)) * 100;

    return (
        <div className={styles.skillRow}>
            <div className={styles.skillInfo}>
                <span className={styles.skillName}>{name}</span>
                <span className={styles.skillLevel}>Lvl {skill.level}</span>
            </div>
            <div className={styles.progressBarBg}>
                <div
                    className={styles.progressBarFill}
                    style={{ width: `${progress}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}
