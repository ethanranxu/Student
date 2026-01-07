import GradeTable from '@/components/GradeTable';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />

      <div className="relative z-10 w-full max-w-7xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            2024届学生成绩展示
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400">
            实时查看班级学生的各项科目成绩及总分排名
          </p>
        </div>

        <GradeTable />

        <footer className="pt-8 text-center text-slate-500 text-sm">
          &copy; 2024 高端成绩管理系统. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
