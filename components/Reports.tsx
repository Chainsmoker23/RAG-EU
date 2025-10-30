
import React, { useState } from 'react';
import type { UploadedFile, Report } from '../types';
import { generatePolicyReport } from '../services/geminiService';
import { generatePdfFromHtml, createReportHtml } from '../services/pdfService';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface ReportsProps {
    knowledgeBase: UploadedFile[];
    reports: Report[];
    addReport: (report: Report) => void;
}

const Reports: React.FC<ReportsProps> = ({ knowledgeBase, reports, addReport }) => {
    const [topic, setTopic] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        if (!topic.trim() || knowledgeBase.length === 0) {
            setError("Please enter a topic and ensure documents are uploaded to the Knowledge Base.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedContent('');
        try {
            const content = await generatePolicyReport(topic, knowledgeBase);
            setGeneratedContent(content);
            const newReport: Report = {
                id: `rep-${Date.now()}`,
                title: topic,
                generatedAt: new Date().toLocaleString(),
                content: content,
            };
            addReport(newReport);
        } catch (err: any) {
            setError(err.message || "Failed to generate report.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadPdf = () => {
        if (!generatedContent) return;
        const html = createReportHtml(topic, generatedContent);
        generatePdfFromHtml(html, topic);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="flex flex-col">
                    <h2 className="mb-4 text-xl font-semibold text-gray-700">Generate New Report</h2>
                    <div className="flex-1 space-y-4">
                        <p className="text-sm text-gray-600">
                            Define a topic for your policy brief. The AI will use the documents in your Knowledge Base to draft a report.
                            This uses Gemini 2.5 Pro with Thinking Mode for high-quality, structured output.
                        </p>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., EU goals for zero-emission freight by 2035"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eu-blue"
                        />
                         <textarea
                            value={generatedContent}
                            readOnly
                            placeholder="Generated report content will appear here..."
                            className="w-full h-64 p-3 font-mono text-sm bg-gray-50 border border-gray-200 rounded-md resize-none"
                        />
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={handleGenerateReport}
                            disabled={isLoading || !topic.trim()}
                            className="flex items-center justify-center px-4 py-2 font-medium text-white transition-colors duration-200 rounded-md bg-eu-blue hover:bg-opacity-90 disabled:bg-gray-400"
                        >
                            {isLoading && <Spinner className="w-5 h-5 mr-2" />}
                            {isLoading ? 'Generating...' : 'Generate Report'}
                        </button>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={!generatedContent}
                            className="px-4 py-2 font-medium text-eu-blue border border-eu-blue rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Download as PDF
                        </button>
                    </div>
                </Card>
                <Card>
                    <h2 className="mb-4 text-xl font-semibold text-gray-700">Generated Reports History</h2>
                    {reports.length > 0 ? (
                        <ul className="space-y-3">
                            {reports.slice().reverse().map(report => (
                                <li key={report.id} className="p-3 transition-colors duration-200 bg-gray-50 rounded-md hover:bg-gray-100">
                                    <p className="font-medium text-gray-800">{report.title}</p>
                                    <p className="text-sm text-gray-500">Generated: {report.generatedAt}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                           No reports generated yet.
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Reports;
