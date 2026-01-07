"use client";

import React from "react";
import {
    LayoutDashboard,
    Users,
    Settings,
    BarChart3,
    Inbox,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "仪表盘", active: true },
    { icon: BarChart3, label: "统计分析", active: false },
    { icon: Users, label: "用户管理", active: false },
    { icon: Inbox, label: "消息通知", active: false },
    { icon: Settings, label: "系统设置", active: false },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <>
            <button
                className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-lg lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 transform lg:translate-x-0",
                !isOpen && "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Premium Dash
                        </h2>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href="#"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                                    item.active
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                                )}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="p-4 mt-auto border-t border-zinc-200 dark:border-zinc-800">
                        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-zinc-600 hover:text-red-500 transition-colors">
                            <LogOut size={18} />
                            退出登录
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
