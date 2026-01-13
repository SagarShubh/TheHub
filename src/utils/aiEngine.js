import { loadData } from "./localStorage";

export const generateSuggestions = () => {
    const data = loadData();
    const suggestions = [];

    // 1. Time-based Context
    const hour = new Date().getHours();
    let timeContext = "";
    if (hour < 12) timeContext = "morning";
    else if (hour < 18) timeContext = "afternoon";
    else timeContext = "evening";

    // 2. Streak Protection (Medium)
    // Check if we have written today
    // We need to check the actual storage key for medium tracker since it has its own logic in the component
    // In a real app we'd unify this state better, but we can read the specific key here
    try {
        const mData = localStorage.getItem("medium_tracker_v1");
        let mediumWrittenToday = false;
        if (mData) {
            const parsed = JSON.parse(mData);
            if (parsed.lastCheckIn) {
                const last = new Date(parsed.lastCheckIn).toDateString();
                const today = new Date().toDateString();
                if (last === today) mediumWrittenToday = true;
            }
        }

        if (!mediumWrittenToday) {
            if (hour > 18) {
                suggestions.push({
                    type: "urgent",
                    text: "⚠️ Writing streak at risk! Write a detailed article now.",
                    action: "medium"
                });
            } else if (hour < 10) {
                suggestions.push({
                    type: "tip",
                    text: "☀️ Morning is the best time to write. Start your day with words.",
                    action: "medium"
                });
            } else {
                suggestions.push({
                    type: "suggestion",
                    text: "Don't forget to write your daily article.",
                    action: "medium"
                });
            }
        }
    } catch (e) {
        console.warn("AI Engine: Failed to check medium streak", e);
    }

    // 3. Bottleneck Detection (Content)
    const tasks = data.tasks || [];
    const todoCount = tasks.filter(t => t.status === "To Do").length;
    const inProgressCount = tasks.filter(t => t.status === "In Progress").length;

    if (inProgressCount > 3) {
        suggestions.push({
            type: "warning",
            text: `🚧 Bottleneck: You have ${inProgressCount} tasks "In Progress". Finish one before starting new ones.`,
            action: "content"
        });
    } else if (todoCount > 5) {
        suggestions.push({
            type: "suggestion",
            text: `You have ${todoCount} ideas waiting. Pick one to start today.`,
            action: "content"
        });
    }

    // 4. Poker Improvements
    const matches = data.pokerMatches || [];
    const matchesThisWeek = matches.filter(m => {
        const d = new Date(m.date);
        const now = new Date();
        return (now - d) < (7 * 24 * 60 * 60 * 1000);
    });

    if (matchesThisWeek.length < 2) {
        suggestions.push({
            type: "suggestion",
            text: "♠️ Poker Volume: You're below target this week. Play a tournament tonight?",
            action: "poker"
        });
    }

    // 5. General Productivity
    if (suggestions.length === 0) {
        suggestions.push({
            type: "insight",
            text: "✨ All caught up! Use this time to Brain Dump new ideas or learn a new skill.",
            action: "growth"
        });
    }

    return suggestions.slice(0, 3); // Return top 3
};
