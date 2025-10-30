// Fix: Add missing React import for FC and SVGProps types.
import type { FC, SVGProps } from 'react';

export enum Page {
    Dashboard = 'Dashboard',
    KnowledgeBase = 'Knowledge Base',
    Assistant = 'Q&A Assistant',
    Reports = 'Reports',
    Settings = 'Settings',
}

export interface NavItem {
    name: string;
    page: Page;
    icon: FC<SVGProps<SVGSVGElement>>;
}

export interface UploadedFile {
    name: string;
    type: string;
    content: string;
    size: number;
}

export interface Report {
    id: string;
    title: string;
    generatedAt: string;
    content: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    sources?: GroundingSource[];
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export type AssistantMode = 'policy' | 'web' | 'maps' | 'image' | 'chat';