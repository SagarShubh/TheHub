"use client";

import { useState, useEffect } from "react";
import styles from "./LoginGate.module.css";

export default function LoginGate({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSetupMode, setIsSetupMode] = useState(false);
    const [inputPin, setInputPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check session
        const sessionAuth = sessionStorage.getItem("isAuthenticated");
        if (sessionAuth === "true") {
            setIsAuthenticated(true);
            setLoading(false);
            return;
        }

        // Check if password exists
        const storedPin = localStorage.getItem("adminPin");
        if (!storedPin) {
            setIsSetupMode(true);
        }
        setLoading(false);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const storedPin = localStorage.getItem("adminPin");

        if (isSetupMode) {
            if (inputPin.length < 4) {
                setError("PIN must be at least 4 digits");
                return;
            }
            localStorage.setItem("adminPin", inputPin);
            sessionStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
        } else {
            if (inputPin === storedPin) {
                sessionStorage.setItem("isAuthenticated", "true");
                setIsAuthenticated(true);
            } else {
                setError("Incorrect PIN");
                setInputPin("");
            }
        }
    };

    if (loading) return null;

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={`glass-panel ${styles.lockCard}`}>
                    <h1 className={styles.title}>
                        {isSetupMode ? "Welcome to The Hub" : "Security Check"}
                    </h1>
                    <p className={styles.subtitle}>
                        {isSetupMode
                            ? "Set a secure PIN to protect your dashboard."
                            : "Enter your PIN to access."}
                    </p>

                    <form onSubmit={handleLogin} className={styles.form}>
                        <input
                            type="password"
                            value={inputPin}
                            onChange={(e) => {
                                setInputPin(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter PIN"
                            className={styles.input}
                            autoFocus
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.button}>
                            {isSetupMode ? "Set PIN" : "Unlock"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
