"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 p-3 rounded-full glass hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-yellow-400 animate-in spin-in-180 duration-500" />
            ) : (
                <Moon className="w-6 h-6 text-slate-700 animate-in spin-in-180 duration-500" />
            )}
        </button>
    );
};
