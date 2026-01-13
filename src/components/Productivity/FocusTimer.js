"use client";

import { useState, useEffect } from "react";
import { loadData, saveData, addSkillXP, logActivity } from "@/utils/localStorage";
import styles from "./FocusTimer.module.css";

const MODES = {
    WORK: { label: "Focus", minutes: 25, color: "var(--text-primary)" },
    BREAK: { label: "Break", minutes: 5, color: "var(--accent-success)" },
};

export default function FocusTimer() {
    const [mode, setMode] = useState("WORK");
    const [timeLeft, setTimeLeft] = useState(MODES.WORK.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].minutes * 60);
    };

    const switchMode = () => {
        const newMode = mode === "WORK" ? "BREAK" : "WORK";
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(MODES[newMode].minutes * 60);
    };

    const handleComplete = () => {
        const audio = new Audio("/sounds/bell.mp3"); // TODO: Add sound later
        // For now just alert or visual

        if (mode === "WORK") {
            // Award XP
            addSkillXP("consistency", 25); // 25 XP for consistency
            logActivity("focus", 25);
            window.dispatchEvent(new Event("storage"));

            // Could log stats here
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleFocusMode = () => {
        setIsFocusMode(!isFocusMode);
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Focus Timer</h3>
                    <button
                        className={`${styles.focusModeBtn} ${isFocusMode ? styles.active : ''}`}
                        onClick={toggleFocusMode}
                        title="Toggle Focus Mode"
                    >
                        👁️
                    </button>
                </div>

                <div className={styles.timerDisplay} style={{ color: MODES[mode].color }}>
                    {formatTime(timeLeft)}
                </div>

                <p className={styles.modeLabel}>{MODES[mode].label}</p>

                <div className={styles.controls}>
                    <button className={styles.mainBtn} onClick={toggleTimer}>
                        {isActive ? "Pause" : "Start"}
                    </button>
                    <button className={styles.secondaryBtn} onClick={resetTimer}>
                        Reset
                    </button>
                    <button className={styles.secondaryBtn} onClick={switchMode}>
                        {mode === "WORK" ? "Break" : "Work"}
                    </button>
                </div>
            </div>

            {/* Focus Mode Overlay */}
            {isFocusMode && (
                <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                        <h1 className={styles.overlayTime}>{formatTime(timeLeft)}</h1>
                        <p className={styles.overlayLabel}>Focusing...</p>
                        <button className={styles.exitBtn} onClick={toggleFocusMode}>Exit Focus Mode</button>
                    </div>
                </div>
            )}
        </>
    );
}
