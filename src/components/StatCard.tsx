import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    color: "blue" | "green" | "purple" | "orange";
}

const colorMap = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
};

export default function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
    return (
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl", colorMap[color])}>
                    <Icon size={24} />
                </div>
                <span className={cn(
                    "text-sm font-medium",
                    trend === "up" ? "text-green-500" : "text-red-500"
                )}>
                    {change}
                </span>
            </div>
            <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {title}
                </h3>
                <p className="text-3xl font-bold mt-1 text-zinc-900 dark:text-white">
                    {value}
                </p>
            </div>
        </div>
    );
}
