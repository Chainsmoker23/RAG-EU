

import React, { useMemo } from 'react';
import type { UploadedFile, Report } from '../types';
import Card from './common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Fix: Correct 'ReportsIcon' to 'ReportIcon' and import other necessary icons.
import { KnowledgeBaseIcon, ReportIcon, AssistantIcon } from './icons/Icons';

interface DashboardProps {
    files: UploadedFile[];
    reports: Report[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-4">
        <div className="p-3 mr-4 text-eu-blue bg-blue-100 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
    </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ files, reports }) => {
    
    const fileTypeData = useMemo(() => {
        const counts = files.reduce((acc, file) => {
            const type = file.type.split('/')[1] || 'other';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, value]) => ({ name, count: value }));
    }, [files]);


    return (
        <div className="space-y-6 animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Documents in Knowledge Base" value={files.length} icon={<KnowledgeBaseIcon className="w-6 h-6" />} />
                {/* Fix: Use 'ReportIcon' as 'ReportsIcon' does not exist. */}
                <StatCard title="Generated Reports" value={reports.length} icon={<ReportIcon className="w-6 h-6" />} />
                <StatCard title="AI Assistant Available" value="Ready" icon={<AssistantIcon className="w-6 h-6" />} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <h2 className="mb-4 text-xl font-semibold text-gray-700">Document Types</h2>
                    {files.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={fileTypeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#003399" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                            Upload documents to see stats.
                        </div>
                    )}
                </Card>
                <Card>
                    <h2 className="mb-4 text-xl font-semibold text-gray-700">Recent Reports</h2>
                     {reports.length > 0 ? (
                        <ul className="space-y-3">
                            {reports.slice(-5).reverse().map(report => (
                                <li key={report.id} className="p-3 transition-colors duration-200 bg-gray-50 rounded-md hover:bg-gray-100">
                                    <p className="font-medium text-gray-800">{report.title}</p>
                                    <p className="text-sm text-gray-500">Generated: {report.generatedAt}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                           No reports generated yet.
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;