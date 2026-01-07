"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown, Edit2, Trash2, X, Check, Loader2, Search, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Student } from '@/lib/mockData';
import { supabase } from '@/lib/supabaseClient';

const ITEMS_PER_PAGE = 10;

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
    const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedData.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedData, currentPage]);

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
            <div className="w-full h-96 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full">
            {/* Search Bar */}
            <div className="relative group max-w-2xl mx-auto w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                <input
                    type="text"
                    placeholder="输入学号或姓名查询..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 hover:border-white/40 focus:border-blue-500 rounded-xl py-3 pl-12 pr-4 text-white outline-none transition-all backdrop-blur-sm"
                />
            </div>

            {/* Table Container */}
            <div className="w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                {headers.map((header) => (
                                    <th
                                        key={header.key}
                                        onClick={() => requestSort(header.key)}
                                        className="px-6 py-4 cursor-pointer group hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                                            {header.label}
                                            {getSortIcon(header.key)}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-sm font-semibold text-white/80">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {paginatedData.map((student, index) => (
                                <tr
                                    key={student.id}
                                    className="hover:bg-white/5 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                                    style={{ animationDelay: `${index * 10}ms` }}
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-white/90">{student.id}</td>
                                    <td className="px-6 py-4 text-sm text-white/80">{student.name}</td>
                                    <td className="px-6 py-4 text-sm text-white/70">{student.chinese}</td>
                                    <td className="px-6 py-4 text-sm text-white/70">{student.math}</td>
                                    <td className="px-6 py-4 text-sm text-white/70">{student.english}</td>
                                    <td className="px-6 py-4 text-sm text-white/70">{student.physics}</td>
                                    <td className="px-6 py-4 text-sm text-white/70">{student.chemistry}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-blue-300">{student.total}</td>
                                    <td className="px-6 py-4 flex gap-1">
                                        <button
                                            onClick={() => setEditingStudent(student)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-blue-400"
                                            title="编辑"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeletingStudent(student)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-red-400"
                                            title="删除"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-white/40 italic">
                                        未找到匹配的学生记录
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
                    <p className="text-sm text-white/60">
                        显示 {Math.min(filteredData.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(filteredData.length, currentPage * ITEMS_PER_PAGE)}，共 {filteredData.length} 条记录
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-slate-900 border border-white/20 rounded-2xl shadow-2xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">修改成绩 - {editingStudent.name}</h2>
                            <button onClick={() => setEditingStudent(null)} className="text-white/60 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
                            {['chinese', 'math', 'english', 'physics', 'chemistry'].map((subject) => (
                                <div key={subject} className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 capitalize">
                                        {headers.find(h => h.key === subject)?.label}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={['chinese', 'math', 'english'].includes(subject) ? 150 : 100}
                                        value={(editingStudent as any)[subject]}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, [subject]: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-lg px-4 py-2 text-white outline-none transition-colors"
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingStudent(null)}
                                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium transition-colors flex items-center justify-center gap-2"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-slate-900 border border-red-500/20 rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-white">确认删除？</h2>
                                <p className="text-white/60 text-sm">
                                    您确定要删除学生 <span className="text-white font-semibold">{deletingStudent.name}</span> (学号: {deletingStudent.id}) 的所有成绩吗？此操作不可撤销。
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingStudent(null)}
                                className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white font-medium transition-colors flex items-center justify-center gap-2"
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
