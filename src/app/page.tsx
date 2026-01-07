import GradeTable from '@/components/GradeTable';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--background)] transition-colors duration-300">
      <ThemeToggle />

      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] dark:bg-blue-600/20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] dark:bg-purple-600/20" />

      <div className="relative z-10 w-full max-w-7xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl transition-colors">
            2024届学生成绩展示
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-[var(--text-muted)] transition-colors">
            实时查看班级学生的各项科目成绩及总分排名
          </p>
        </div>

        <GradeTable />

        <footer className="pt-8 text-center text-[var(--text-muted)] text-sm transition-colors">
          &copy; 2024 高端成绩管理系统. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
