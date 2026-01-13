"use client";

import styles from "./BentoGrid.module.css";

export default function BentoGrid({ children }) {
    return <div className={styles.grid}>{children}</div>;
}

export function BentoCard({ children, size = "small", className = "" }) {
    return (
        <div
            className={`glass-panel ${styles.card} ${styles[size]} ${className}`}
        >
            {children}
        </div>
    );
}
