"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown, Edit2, Trash2, X, Check, Loader2, Search, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Student } from '@/lib/mockData';
import { supabase } from '@/lib/supabaseClient';


type SortConfig = {
    key: keyof Student;
    direction: 'asc' | 'desc';
};

const GradeTable: React.FC = () => {
    const [data, setData] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching students:', error);
        } else {
            setData(data as Student[]);
        }
        setLoading(false);
    };

    // 1. Filter data based on search term (ID or Name)
    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return data.filter(student => {
            return student.id.toLowerCase().includes(term) ||
                student.name.toLowerCase().includes(term);
        });
    }, [data, searchTerm]);

    // 2. Sort filtered data
    const sortedData = useMemo(() => {
        const sortableItems = [...filteredData];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [filteredData, sortConfig]);

    // 3. Paginate sorted data
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

    // Reset pagination when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const requestSort = (key: keyof Student) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;

        setIsUpdating(true);
        const { id, name, total, ...scores } = editingStudent;

        const { error } = await supabase
            .from('students')
            .update(scores)
            .eq('id', id);

        if (error) {
            alert('更新失败: ' + error.message);
        } else {
            await fetchStudents();
            setEditingStudent(null);
        }
        setIsUpdating(false);
    };

    const handleDelete = async () => {
        if (!deletingStudent) return;

        setIsDeleting(true);
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', deletingStudent.id);

        if (error) {
            alert('删除失败: ' + error.message);
        } else {
            // Remove from local state
            setData(prev => prev.filter(s => s.id !== deletingStudent.id));
            setDeletingStudent(null);
        }
        setIsDeleting(false);
    };

    const getSortIcon = (key: keyof Student) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />;
        return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400" />;
    };

    const headers = [
        { key: 'id' as const, label: '学号' },
        { key: 'name' as const, label: '姓名' },
        { key: 'chinese' as const, label: '语文' },
        { key: 'math' as const, label: '数学' },
        { key: 'english' as const, label: '英语' },
        { key: 'physics' as const, label: '物理' },
        { key: 'chemistry' as const, label: '化学' },
        { key: 'total' as const, label: '总分' },
    ];

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center glass rounded-2xl border-[var(--glass-border)]">
                <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full">
            {/* Search Bar */}
            <div className="relative group max-w-2xl mx-auto w-full transition-all">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                <input
                    type="text"
                    placeholder="输入学号或姓名查询..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full glass border-[var(--glass-border)] hover:border-[var(--primary)]/40 focus:border-[var(--primary)] rounded-xl py-3 pl-12 pr-4 text-[var(--foreground)] outline-none transition-all shadow-lg focus:shadow-[var(--primary)]/10"
                />
            </div>

            {/* Table Container */}
            <div className="w-full overflow-hidden rounded-2xl border-[var(--glass-border)] glass shadow-2xl transition-all">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                {headers.map((header) => (
                                    <th
                                        key={header.key}
                                        onClick={() => requestSort(header.key)}
                                        className="px-6 py-4 cursor-pointer group hover:bg-[var(--glass-bg)] transition-colors"
                                    >
                                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] opacity-80">
                                            {header.label}
                                            {getSortIcon(header.key)}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)] opacity-80">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {paginatedData.map((student, index) => (
                                <tr
                                    key={student.id}
                                    className="hover:bg-[var(--glass-bg)] border-b border-[var(--glass-border)] transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                                    style={{ animationDelay: `${index * 10}ms` }}
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-[var(--foreground)]">{student.id}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--foreground)] opacity-80">{student.name}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{student.chinese}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{student.math}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{student.english}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{student.physics}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{student.chemistry}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-[var(--primary)]">{student.total}</td>
                                    <td className="px-6 py-4 flex gap-1">
                                        <button
                                            onClick={() => setEditingStudent(student)}
                                            className="p-2 hover:bg-[var(--primary)]/10 rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--primary)]"
                                            title="编辑"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeletingStudent(student)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-[var(--text-muted)] hover:text-red-500"
                                            title="删除"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-[var(--text-muted)] italic">
                                        未找到匹配的学生记录
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 bg-[var(--glass-bg)] border-t border-[var(--glass-border)] flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-[var(--text-muted)]">
                            显示 {Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)} - {Math.min(filteredData.length, currentPage * pageSize)}，共 {filteredData.length} 条记录
                        </p>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] bg-[var(--glass-bg)] rounded-lg px-2 py-1 border border-[var(--glass-border)]">
                            <span>每页显示</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-transparent text-[var(--foreground)] outline-none cursor-pointer font-medium"
                            >
                                {[5, 10, 20, 50].map(size => (
                                    <option key={size} value={size} className="bg-[var(--card)] text-[var(--foreground)]">{size}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--primary)]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[var(--foreground)] border border-[var(--glass-border)]"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all border ${currentPage === page
                                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20'
                                        : 'bg-[var(--glass-bg)] text-[var(--text-muted)] border-[var(--glass-border)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--primary)]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[var(--foreground)] border border-[var(--glass-border)]"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-[var(--card)] border border-[var(--glass-border)] rounded-2xl shadow-2xl p-6 space-y-6 transition-all">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[var(--foreground)]">修改成绩 - {editingStudent.name}</h2>
                            <button onClick={() => setEditingStudent(null)} className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
                            {['chinese', 'math', 'english', 'physics', 'chemistry'].map((subject) => (
                                <div key={subject} className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-muted)] capitalize">
                                        {headers.find(h => h.key === subject)?.label}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={['chinese', 'math', 'english'].includes(subject) ? 150 : 100}
                                        value={(editingStudent as any)[subject]}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, [subject]: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-[var(--background)] border border-[var(--glass-border)] focus:border-[var(--primary)] rounded-lg px-4 py-2 text-[var(--foreground)] outline-none transition-all shadow-inner"
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingStudent(null)}
                                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--background)] hover:bg-[var(--glass-bg)] text-[var(--foreground)] font-medium transition-colors border border-[var(--glass-border)]"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 text-white font-medium transition-all shadow-lg shadow-[var(--primary)]/20 flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    保存修改
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-[var(--card)] border border-red-500/20 rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200 transition-all">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center shadow-inner">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-[var(--foreground)]">确认删除？</h2>
                                <p className="text-[var(--text-muted)] text-sm">
                                    您确定要删除学生 <span className="text-[var(--foreground)] font-semibold">{deletingStudent.name}</span> (学号: {deletingStudent.id}) 的所有成绩吗？此操作不可撤销。
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingStudent(null)}
                                className="flex-1 px-4 py-2 rounded-lg bg-[var(--background)] hover:bg-[var(--glass-bg)] text-[var(--foreground)] font-medium transition-colors border border-[var(--glass-border)]"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeTable;
