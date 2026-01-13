"use client";

import { useEffect, useState } from "react";
import { loadData, saveData, addSkillXP, logActivity } from "@/utils/localStorage";
import styles from "./PokerTracker.module.css";

export default function PokerTracker() {
    const [matches, setMatches] = useState([]);
    const [bankroll, setBankroll] = useState(0);
    const [isRegistering, setIsRegistering] = useState(false);
    const [buyInInput, setBuyInInput] = useState("");
    const [isCashingOut, setIsCashingOut] = useState(null); // ID of match
    const [cashOutInput, setCashOutInput] = useState("");

    useEffect(() => {
        const data = loadData();
        setMatches(data.pokerMatches || []);
        const total = (data.pokerMatches || []).reduce((acc, match) => {
            return acc - (match.buyIn || 0) + (match.cashOut || 0);
        }, 0);
        setBankroll(total);
    }, []);

    const handleRegister = (e) => {
        e.preventDefault();
        if (!buyInInput) return;

        const newMatch = {
            id: Date.now(),
            date: new Date().toISOString(),
            platform: "PokerStars",
            buyIn: Number(buyInInput),
            cashOut: 0,
            status: "Registered"
        };

        const updated = [newMatch, ...matches];
        setMatches(updated);

        const data = loadData();
        data.pokerMatches = updated;
        saveData(data);

        // Recalculate bankroll
        const total = updated.reduce((acc, match) => acc - (match.buyIn || 0) + (match.cashOut || 0), 0);
        setBankroll(total);

        addSkillXP("poker", 10);
        window.dispatchEvent(new Event("storage"));

        setIsRegistering(false);
        setBuyInInput("");
    };

    const handleCashOut = (e) => {
        e.preventDefault();
        if (!cashOutInput || !isCashingOut) return;

        const updated = matches.map(m => {
            if (m.id === isCashingOut) {
                return { ...m, cashOut: Number(cashOutInput), status: "Finished" };
            }
            return m;
        });

        setMatches(updated);

        const data = loadData();
        data.pokerMatches = updated;
        saveData(data);

        const total = updated.reduce((acc, match) => acc - (match.buyIn || 0) + (match.cashOut || 0), 0);
        setBankroll(total);

        addSkillXP("poker", 50);
        logActivity("poker", 1);
        window.dispatchEvent(new Event("storage"));

        setIsCashingOut(null);
        setCashOutInput("");
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Poker Tracker</h3>
                <div className={`${styles.bankrollBadge} ${bankroll >= 0 ? styles.positive : styles.negative}`}>
                    ${bankroll.toFixed(2)}
                </div>
            </div>

            <div className={styles.upcomingSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Active & Upcoming</span>
                    {!isRegistering && (
                        <button className={styles.addBtn} onClick={() => setIsRegistering(true)}>+ Register</button>
                    )}
                </div>

                {isRegistering && (
                    <form onSubmit={handleRegister} className={styles.inlineForm}>
                        <input
                            type="number"
                            autoFocus
                            placeholder="Buy-in ($)"
                            value={buyInInput}
                            onChange={(e) => setBuyInInput(e.target.value)}
                            className={styles.input}
                        />
                        <button type="submit" className={styles.confirmBtn}>Confirm</button>
                        <button type="button" className={styles.cancelBtn} onClick={() => setIsRegistering(false)}>✕</button>
                    </form>
                )}

                <div className={styles.matchList}>
                    {matches.filter(m => m.status !== "Finished").map(match => (
                        <div key={match.id} className={styles.matchRow}>
                            <div className={styles.matchInfo}>
                                <span className={styles.platform}>{match.platform}</span>
                                <span className={styles.buyIn}>${match.buyIn}</span>
                            </div>

                            {isCashingOut === match.id ? (
                                <form onSubmit={handleCashOut} className={styles.cashOutForm}>
                                    <input
                                        type="number"
                                        autoFocus
                                        placeholder="Amount"
                                        value={cashOutInput}
                                        onChange={(e) => setCashOutInput(e.target.value)}
                                        className={styles.miniInput}
                                    />
                                    <button type="submit" className={styles.miniBtn}>✓</button>
                                    <button type="button" className={styles.miniCancel} onClick={() => setIsCashingOut(null)}>✕</button>
                                </form>
                            ) : (
                                <button className={styles.finishBtn} onClick={() => setIsCashingOut(match.id)}>
                                    Cash Out
                                </button>
                            )}
                        </div>
                    ))}
                    {matches.filter(m => m.status !== "Finished").length === 0 && !isRegistering && (
                        <p className={styles.empty}>No active tournaments.</p>
                    )}
                </div>
            </div>

            <div className={styles.historyPreview}>
                <span className={styles.label}>Recent History</span>
                <div className={styles.miniList}>
                    {matches.filter(m => m.status === "Finished").slice(0, 3).map(m => (
                        <div key={m.id} className={styles.miniRow}>
                            <span>{new Date(m.date).toLocaleDateString()}</span>
                            <span style={{ color: m.cashOut > m.buyIn ? "var(--accent-success)" : "var(--text-muted)" }}>
                                {m.cashOut > m.buyIn ? "+" : ""}{m.cashOut - m.buyIn}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
