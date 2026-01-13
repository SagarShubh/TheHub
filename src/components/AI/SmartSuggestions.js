"use client";

import { useEffect, useState } from "react";
import { generateSuggestions } from "@/utils/aiEngine";
import styles from "./SmartSuggestions.module.css";

export default function SmartSuggestions() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAI = async () => {
        setLoading(true);
        try {
            // 1. Gather Context locally
            const localData = JSON.parse(localStorage.getItem("the_hub_data_v1") || "{}");
            const context = {
                profile: localData.profile,
                dailyStats: localData.analytics?.dailyStats?.[new Date().toISOString().split('T')[0]] || {},
                tasks: localData.tasks?.filter(t => t.status === "In Progress" || t.status === "To Do")?.slice(0, 5),
                recentPoker: localData.pokerMatches?.slice(0, 3)
            };

            // 2. Call API
            const res = await fetch("/api/ai/suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ context }),
            });

            if (!res.ok) throw new Error("API Failed");

            const data = await res.json();
            if (data.suggestions) {
                setSuggestions(data.suggestions);
            } else {
                // Fallback if format wrong
                setSuggestions(generateSuggestions());
            }

        } catch (e) {
            console.warn("AI Offline, using local engine", e);
            setSuggestions(generateSuggestions());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAI();

        // Refresh on storage updates (debounced ideally, but simple for now)
        window.addEventListener("storage", fetchAI);

        // Refresh every 5 mins to save API calls, not 1 min
        const interval = setInterval(fetchAI, 300000);

        return () => {
            window.removeEventListener("storage", fetchAI);
            clearInterval(interval);
        };
    }, []);

    if (!suggestions.length && !loading) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.aiIcon}>{loading ? "🔄" : "✨"}</div>
                <h3 className={styles.title}>
                    {loading ? "Aligning Neural Net..." : "AI Insights"}
                </h3>
            </div>

            <div className={styles.list}>
                {suggestions.map((item, i) => (
                    <div key={i} className={`${styles.item} ${styles[item.type]}`}>
                        <p className={styles.text}>{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
