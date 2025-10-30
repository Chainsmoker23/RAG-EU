
import React, { useState, useCallback } from 'react';
import type { UploadedFile } from '../types';
import Card from './common/Card';
import { UploadCloudIcon, FileIcon, TrashIcon } from './icons/Icons';

interface KnowledgeBaseProps {
    uploadedFiles: UploadedFile[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ uploadedFiles, setUploadedFiles }) => {
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (!files) return;
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const newFile: UploadedFile = {
                    name: file.name,
                    type: file.type || 'unknown',
                    content,
                    size: file.size,
                };
                setUploadedFiles(prev => [...prev, newFile]);
            };
            reader.readAsText(file);
        });
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };
    
    const removeFile = (fileName: string) => {
        setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Knowledge Base</h1>
            <Card>
                <div 
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${dragging ? 'border-eu-blue bg-blue-50' : 'border-gray-300'}`}
                >
                    <UploadCloudIcon className="w-12 h-12 mx-auto text-gray-400"/>
                    <p className="mt-4 font-semibold text-gray-700">Drag & Drop files here</p>
                    <p className="text-sm text-gray-500">or</p>
                    <label htmlFor="file-upload" className="inline-block px-4 py-2 mt-2 font-medium text-white transition-colors duration-200 cursor-pointer bg-eu-blue rounded-md hover:bg-opacity-90">
                        Browse Files
                    </label>
                    <input id="file-upload" type="file" multiple className="hidden" accept=".txt,.md,.csv" onChange={(e) => handleFileChange(e.target.files)} />
                    <p className="mt-2 text-xs text-gray-400">Supported file types: .txt, .md, .csv</p>
                </div>
            </Card>

            <Card>
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Uploaded Documents</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 font-medium text-gray-600">File Name</th>
                                <th className="px-4 py-2 font-medium text-gray-600">Type</th>
                                <th className="px-4 py-2 font-medium text-gray-600">Size</th>
                                <th className="px-4 py-2 font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploadedFiles.length > 0 ? (
                                uploadedFiles.map(file => (
                                    <tr key={file.name} className="border-b hover:bg-gray-50">
                                        <td className="flex items-center px-4 py-2">
                                            <FileIcon className="w-5 h-5 mr-2 text-gray-500"/>
                                            <span className="font-medium text-gray-800">{file.name}</span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-600">{file.type}</td>
                                        <td className="px-4 py-2 text-gray-600">{(file.size / 1024).toFixed(2)} KB</td>
                                        <td className="px-4 py-2">
                                            <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500">No documents uploaded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default KnowledgeBase;
