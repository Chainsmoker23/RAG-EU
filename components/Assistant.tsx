
import React, { useState, useRef, useEffect } from 'react';
import type { UploadedFile, ChatMessage, GroundingSource, AssistantMode } from '../types';
import { generatePolicyResponse, generateGroundedResponse, editImageWithPrompt, getChatResponse } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { SendIcon, ExternalLinkIcon } from './icons/Icons';

interface AssistantProps {
    knowledgeBase: UploadedFile[];
}

const Assistant: React.FC<AssistantProps> = ({ knowledgeBase }) => {
    const [mode, setMode] = useState<AssistantMode>('policy');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Image Editor State
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalImageType, setOriginalImageType] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        // Reset state when mode changes
        setMessages([]);
        setInput('');
        setError(null);
        setOriginalImage(null);
        setEditedImage(null);
    }, [mode]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setOriginalImage(event.target?.result as string);
                setOriginalImageType(file.type);
                setEditedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            let modelResponse: { text: string; sources?: GroundingSource[] } = { text: '' };
            if (mode === 'policy') {
                 if (knowledgeBase.length === 0) {
                    throw new Error("Please upload documents to the Knowledge Base to use this mode.");
                }
                const responseText = await generatePolicyResponse(input, knowledgeBase);
                modelResponse = { text: responseText };
            } else if (mode === 'web' || mode === 'maps') {
                let location;
                if (mode === 'maps') {
                    try {
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject);
                        });
                        location = position.coords;
                    } catch (geoError) {
                        throw new Error("Could not get location. Please enable location services.");
                    }
                }
                modelResponse = await generateGroundedResponse(input, mode === 'maps', location);
            } else if (mode === 'image') {
                if (!originalImage || !originalImageType) {
                    throw new Error("Please upload an image to edit.");
                }
                const base64Data = originalImage.split(',')[1];
                const newImageBase64 = await editImageWithPrompt(base64Data, originalImageType, input);
                setEditedImage(`data:${originalImageType};base64,${newImageBase64}`);
                modelResponse = { text: "Here is the edited image." };
            } else if (mode === 'chat') {
                const responseText = await getChatResponse(input);
                modelResponse = { text: responseText };
            }
            
            if (mode !== 'image') {
              const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', ...modelResponse };
              setMessages(prev => [...prev, botMessage]);
            }

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: `Error: ${err.message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderMessageContent = (text: string) => {
        // Simple markdown-like replacement
        const formattedText = text
            .replace(/\[Source: (.*?)\]/g, '<span class="text-xs font-semibold text-eu-blue bg-blue-100 py-0.5 px-1.5 rounded-md ml-1">$1</span>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
        return <p dangerouslySetInnerHTML={{ __html: formattedText }} />;
    };

    const ModeButton = ({ id, label }: { id: AssistantMode, label: string }) => (
        <button
            onClick={() => setMode(id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                mode === id ? 'bg-eu-blue text-white shadow' : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );
    
    const getModeInfo = () => {
        switch(mode) {
            case 'policy': return "Ask questions about your uploaded documents. Uses Gemini 2.5 Pro with Thinking Mode.";
            case 'web': return "Get up-to-date answers from the web using Google Search grounding.";
            case 'maps': return "Find places and get location-based info with Google Maps grounding.";
            case 'image': return "Upload an image and use a text prompt to edit it with Gemini 2.5 Flash Image.";
            case 'chat': return "Have a general conversation with the Gemini 2.5 Flash model.";
        }
    }

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
            <h1 className="text-3xl font-bold text-gray-800">Q&A Assistant</h1>
            <Card className="my-4">
                <div className="flex flex-wrap gap-2">
                    <ModeButton id="policy" label="Policy Q&A" />
                    <ModeButton id="web" label="Web Search" />
                    <ModeButton id="maps" label="Maps Search" />
                    <ModeButton id="image" label="Image Editor" />
                    <ModeButton id="chat" label="General Chat" />
                </div>
                <p className="mt-3 text-sm text-gray-600">{getModeInfo()}</p>
            </Card>

            {mode === 'image' ? (
                <div className="flex-1 overflow-y-auto space-y-4 p-1">
                    <Card>
                        <h3 className="font-semibold mb-2">1. Upload Image</h3>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-eu-blue hover:file:bg-blue-100"/>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <h3 className="font-semibold mb-2 text-center">Original</h3>
                            {originalImage ? <img src={originalImage} alt="Original" className="rounded-md object-contain h-64 w-full" /> : <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Upload an image</div>}
                        </Card>
                         <Card>
                            <h3 className="font-semibold mb-2 text-center">Edited</h3>
                            {isLoading && mode === 'image' && <div className="h-64 rounded-md flex items-center justify-center"><Spinner className="w-12 h-12"/></div>}
                            {!isLoading && editedImage && <img src={editedImage} alt="Edited" className="rounded-md object-contain h-64 w-full" />}
                            {!isLoading && !editedImage && <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Edited image will appear here</div>}
                        </Card>
                    </div>
                </div>
            ) : (
                 <div className="flex-1 overflow-y-auto p-1 bg-white rounded-lg shadow-inner">
                    <div className="p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl px-4 py-2 rounded-lg shadow ${msg.role === 'user' ? 'bg-eu-blue text-white' : 'bg-gray-100 text-gray-800'}`}>
                                {renderMessageContent(msg.text)}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-300">
                                        <h4 className="text-xs font-bold mb-1">Sources:</h4>
                                        <ul className="space-y-1">
                                            {msg.sources.map((source, i) => (
                                                <li key={i} className="text-xs">
                                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                                        {source.title}
                                                        <ExternalLinkIcon className="w-3 h-3 ml-1"/>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                    </div>
                </div>
            )}
            
            <div className="mt-4">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === 'image' ? 'Describe your edit... (e.g., add a retro filter)' : 'Ask a question...'}
                        className="w-full py-3 pl-4 pr-12 text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-eu-blue"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-white bg-eu-blue rounded-r-full disabled:bg-gray-400 hover:bg-opacity-90 transition-colors">
                        {isLoading ? <Spinner className="w-5 h-5" /> : <SendIcon className="w-5 h-5"/>}
                    </button>
                </form>
                 {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default Assistant;
