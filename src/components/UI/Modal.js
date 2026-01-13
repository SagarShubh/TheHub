"use client";
import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                style={{
                    background: "var(--bg-card)",
                    boxShadow: "0 0 40px rgba(0,0,0,0.5)"
                }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
