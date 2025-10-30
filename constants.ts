

import type { NavItem } from './types';
import { Page } from './types';
// Fix: Import existing 'ReportIcon' instead of non-existent 'ReportsIcon' and add other missing icon imports.
import { DashboardIcon, KnowledgeBaseIcon, AssistantIcon, ReportIcon, SettingsIcon } from './components/icons/Icons';

export const NAV_ITEMS: NavItem[] = [
    { name: 'Dashboard', page: Page.Dashboard, icon: DashboardIcon },
    { name: 'Knowledge Base', page: Page.KnowledgeBase, icon: KnowledgeBaseIcon },
    { name: 'Q&A Assistant', page: Page.Assistant, icon: AssistantIcon },
    // Fix: Use 'ReportIcon' as 'ReportsIcon' is not defined.
    { name: 'Reports', page: Page.Reports, icon: ReportIcon },
    { name: 'Settings', page: Page.Settings, icon: SettingsIcon },
];