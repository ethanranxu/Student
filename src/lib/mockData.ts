export type Student = {
    id: string;
    name: string;
    chinese: number;
    math: number;
    english: number;
    physics: number;
    chemistry: number;
    total: number;
};

const firstNames = ["张", "王", "李", "赵", "刘", "陈", "杨", "黄", "周", "吴"];
const lastNames = ["伟", "芳", "娜", "秀英", "敏", "静", "丽", "强", "磊", "军"];

export const generateMockData = (count: number = 50): Student[] => {
    return Array.from({ length: count }, (_, i) => {
        const chinese = Math.floor(Math.random() * 41) + 60; // 60-100
        const math = Math.floor(Math.random() * 41) + 60;
        const english = Math.floor(Math.random() * 41) + 60;
        const physics = Math.floor(Math.random() * 31) + 70; // 70-100
        const chemistry = Math.floor(Math.random() * 31) + 70;

        return {
            id: `2024${(i + 1).toString().padStart(3, '0')}`,
            name: firstNames[Math.floor(Math.random() * firstNames.length)] + lastNames[Math.floor(Math.random() * lastNames.length)],
            chinese,
            math,
            english,
            physics,
            chemistry,
            total: chinese + math + english + physics + chemistry,
        };
    });
};
