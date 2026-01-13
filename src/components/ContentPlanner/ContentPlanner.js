"use client";

import { useEffect, useState } from "react";
import { loadData, saveData, addSkillXP, logActivity } from "@/utils/localStorage";
import styles from "./ContentPlanner.module.css";

const PLATFORMS = {
    IG: { label: "Instagram", color: "#E1306C" },
    YT: { label: "YouTube", color: "#FF0000" },
    X: { label: "X / Twitter", color: "#1DA1F2" },
    M: { label: "Medium", color: "#00ab6c" },
};

const STATUSES = ["Idea", "To Do", "In Progress", "Done"];

export default function ContentPlanner() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("IG");

    useEffect(() => {
        const data = loadData();
        setTasks(data.tasks || []);

        // Listen for storage updates
        const handleStorage = () => {
            const fresh = loadData();
            setTasks(fresh.tasks || []);
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: Date.now(),
            title: newTask,
            platform: selectedPlatform,
            status: "Idea",
            createdAt: new Date().toISOString(),
        };

        const updatedTasks = [...tasks, task];
        setTasks(updatedTasks);
        setNewTask("");

        // Save
        const data = loadData();
        data.tasks = updatedTasks;
        saveData(data);
    };

    const moveTask = (taskId, newStatus) => {
        const updatedTasks = tasks.map(t => {
            if (t.id === taskId) {
                // If moving to Done, award XP
                if (newStatus === "Done" && t.status !== "Done") {
                    addSkillXP("content", 30);
                    logActivity("content", 1);
                    setTimeout(() => window.dispatchEvent(new Event("storage")), 100);
                }
                return { ...t, status: newStatus };
            }
            return t;
        });

        setTasks(updatedTasks);
        const data = loadData();
        data.tasks = updatedTasks;
        saveData(data);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Content Planner</h3>
                <button className={styles.filterBtn}>Filter ▾</button>
            </div>

            {/* Quick Add */}
            <form onSubmit={handleAddTask} className={styles.addForm}>
                <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className={styles.platformSelect}
                    style={{ borderColor: PLATFORMS[selectedPlatform].color }}
                >
                    {Object.entries(PLATFORMS).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New content idea..."
                    className={styles.addInput}
                />
                <button type="submit" className={styles.addBtn}>+</button>
            </form>

            {/* Kanban Board (Simplified List for small view, columns for large) */}
            <div className={styles.board}>
                {STATUSES.map(status => (
                    <div key={status} className={styles.column}>
                        <h4 className={styles.colTitle}>{status}</h4>
                        <div className={styles.colList}>
                            {tasks.filter(t => t.status === status).map(task => (
                                <div key={task.id} className={styles.taskCard} style={{ borderLeftColor: PLATFORMS[task.platform].color }}>
                                    <p className={styles.taskTitle}>{task.title}</p>
                                    <span className={styles.taskPlatform} style={{ color: PLATFORMS[task.platform].color }}>
                                        {PLATFORMS[task.platform].label}
                                    </span>

                                    <div className={styles.taskActions}>
                                        {status !== "Done" && (
                                            <button
                                                className={styles.moveBtn}
                                                onClick={() => moveTask(task.id, STATUSES[STATUSES.indexOf(status) + 1])}
                                            >
                                                →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.status === status).length === 0 && (
                                <div className={styles.emptyState}>Empty</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
