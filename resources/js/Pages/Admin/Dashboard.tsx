import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    User,
    Users,
    GraduationCap,
    BookOpen,
    BookText,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Footer from '@/Components/Footer';
type DashboardProps = {
    etudiantsCount: number;
    professeursCount: number;
    filieresCount: number;
    uesCount: number;
    matieresCount: number;
};

const StatCard = ({
    title,
    count,
    icon: Icon,
    href,
}: {
    title: string;
    count: number;
    icon: React.ElementType;
    href: string;
}) => (
    <Link
        href={href}
        className="bg-white border border-[#87b790] hover:border-[#729c6e] shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl p-6"
    >
        <div className="flex items-center space-x-4">
            <div className="bg-[#87b790]/10 text-[#87b790] p-3 rounded-full">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-[#48704f]">{title}</h2>
                <p className="text-2xl font-bold text-[#355c3e]">{count}</p>
            </div>
        </div>
    </Link>
);

export default function Dashboard({
    etudiantsCount,
    professeursCount,
    filieresCount,
    uesCount,
    matieresCount,
}: DashboardProps) {
    const data = [
        { name: 'Étudiants', value: etudiantsCount },
        { name: 'Professeurs', value: professeursCount },
        { name: 'Filières', value: filieresCount },
        { name: 'UE', value: uesCount },
        { name: 'Matières', value: matieresCount },
    ];

    // Palette déclinée autour de #87b790
    const COLORS = ['#87b790', '#729c6e', '#5d865a', '#477344', '#355c3e'];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Head title="Tableau de bord administrateur" />
            <h1 className="text-4xl font-bold mb-10 text-[#87b790]">Tableau de bord administrateur</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <StatCard
                    title="Étudiants"
                    count={etudiantsCount}
                    icon={User}
                    href={route('admin.users.index')}
                />
                <StatCard
                    title="Professeurs"
                    count={professeursCount}
                    icon={Users}
                    href={route('admin.users.index')}
                />
                <StatCard
                    title="Filières"
                    count={filieresCount}
                    icon={GraduationCap}
                    href={route('admin.filieres.index')}
                />
                <StatCard
                    title="UE"
                    count={uesCount}
                    icon={BookOpen}
                    href={route('admin.ues.index')}
                />
                <StatCard
                    title="Matières"
                    count={matieresCount}
                    icon={BookText}
                    href={route('admin.matieres.index')}
                />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-[#87b790]">
                <h2 className="text-2xl font-semibold text-[#48704f] mb-6">Répartition des éléments</h2>
                <div className="w-full h-96">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name }) => name}
                                outerRadius={120}
                                fill="#87b790"
                                dataKey="value"
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <Footer />
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
