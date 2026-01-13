"use client";

// Initial schema for a new user
const INITIAL_DATA = {
    // User Profile
    profile: {
        level: 1,
        xp: 0,
        joinDate: new Date().toISOString(),
    },

    // Growth Engine
    skills: {
        writing: { level: 1, xp: 0, history: [] },
        content: { level: 1, xp: 0, history: [] },
        poker: { level: 1, xp: 0, history: [] },
        design: { level: 1, xp: 0, history: [] },
        consistency: { level: 1, xp: 0, history: [] },
    },

    // Trackers
    tasks: [], // Medium and Content tasks
    pokerMatches: [],

    // Improvement System
    analytics: {
        dailyStats: {}, // YYYY-MM-DD: { focusTime, tasksCompleted, ... }
    },

    settings: {
        theme: "dark",
    }
};

const DB_KEY = "the_hub_data_v1";

export const loadData = () => {
    if (typeof window === "undefined") return INITIAL_DATA;

    const stored = localStorage.getItem(DB_KEY);
    if (!stored) {
        saveData(INITIAL_DATA);
        return INITIAL_DATA;
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse data", e);
        return INITIAL_DATA;
    }
};

export const saveData = (data) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// Helper: Add XP to a specific skill
export const addSkillXP = (skillName, amount) => {
    const data = loadData();
    const skill = data.skills[skillName];

    if (!skill) return data; // Invalid skill

    skill.xp += amount;

    // Simple leveling curve: Level * 100 XP needed for next level
    const xpNeeded = skill.level * 100;
    if (skill.xp >= xpNeeded) {
        skill.level += 1;
        skill.xp -= xpNeeded;
        // You could trigger a level-up toast here
    }

    saveData(data);
    return data;
};

// Helper: Log daily activity for analytics
export const logActivity = (type, value = 1) => {
    const data = loadData();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (!data.analytics) data.analytics = {};
    if (!data.analytics.dailyStats) data.analytics.dailyStats = {};

    if (!data.analytics.dailyStats[today]) {
        data.analytics.dailyStats[today] = {
            medium: 0,
            content: 0,
            poker: 0,
            focusMinutes: 0,
            score: 0
        };
    }

    const stats = data.analytics.dailyStats[today];

    if (type === "medium") stats.medium += value;
    if (type === "content") stats.content += value;
    if (type === "poker") stats.poker += value;
    if (type === "focus") stats.focusMinutes += value;

    // Calculate simple productivity score (0-100)
    // Weight: Medium=30, Content=20, Poker=20, Focus=1min=1pt (max 30)
    let score = 0;
    score += (stats.medium > 0 ? 30 : 0);
    score += (Math.min(stats.content, 3) * 10); // Max 30 for content
    score += (stats.poker > 0 ? 20 : 0);
    score += Math.min(stats.focusMinutes, 60) * 0.5; // Max 30 for 60m focus

    stats.score = Math.min(Math.round(score), 100);

    saveData(data);
    window.dispatchEvent(new Event("storage"));
    return data;
};
