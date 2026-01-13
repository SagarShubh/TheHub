"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { syncEngine } from '@/utils/syncEngine';
import Modal from '@/components/UI/Modal';

export default function CloudSync() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) syncEngine.pull();
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });
        setLoading(false);
        setIsModalOpen(false);

        if (error) alert(error.message);
        else alert("Check your email for the login link!");
    };

    const handleSync = async () => {
        setStatus('syncing');
        await syncEngine.push();
        setTimeout(() => setStatus('success'), 1000);
        setTimeout(() => setStatus('idle'), 3000);
    };

    if (!user) {
        return (
            <>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-all shadow-sm"
                >
                    Enable Cloud Sync
                </button>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cloud Sync Login">
                    <p className="text-sm text-zinc-500 mb-4">
                        Enter your email to sync your data across devices. We'll send you a magic link.
                    </p>
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 shadow-md"
                        >
                            {loading ? 'Sending Link...' : 'Send Magic Link'}
                        </button>
                    </form>
                </Modal>
            </>
        );
    }

    return (
        <button
            onClick={handleSync}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-2 shadow-sm ${status === 'success'
                ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
                }`}
        >
            <div className={`w-2 h-2 rounded-full ${status === 'syncing' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
            {status === 'syncing' ? 'Syncing...' : status === 'success' ? 'Synced' : 'Cloud Active'}
        </button>
    );
}
