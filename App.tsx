

import React, { useState, useEffect, createContext, useContext } from 'react';
// Fix: Add Variants to framer-motion import to fix type errors.
import { motion, useScroll, useSpring, AnimatePresence, Variants } from 'framer-motion';

// Main App Components
import Dashboard from './components/Dashboard';
import KnowledgeBase from './components/KnowledgeBase';
import Assistant from './components/Assistant';
import Reports from './components/Reports';
import Settings from './components/Settings';

// Types & Constants
import type { UploadedFile, Report } from './types';
import { Page } from './types';
import { NAV_ITEMS } from './constants';

// Icons
import { 
    LogoIcon, SunIcon, MoonIcon, AnalyzeIcon, GenerateIcon, ReportIcon, ArrowRightIcon, TwitterIcon, 
    LinkedInIcon, MenuIcon, XIcon
} from './components/icons/Icons';


// --- THEME PROVIDER ---
const ThemeContext = createContext<{ theme: string; toggleTheme: () => void; }>({ theme: 'light', toggleTheme: () => {} });
const useTheme = () => useContext(ThemeContext);

// Fix: Removed React.FC to improve type inference for component props.
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedTheme = window.localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        window.localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// --- LANDING PAGE COMPONENTS ---

// Fix: Add Variants type to fix type inference issue with the 'ease' property in framer-motion transitions.
const sectionVariant: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Fix: Removed React.FC to improve type inference for component props.
const Header = ({ onNavigateToApp }: { onNavigateToApp: () => void }) => {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const NavLinks = () => (
         <>
            <a href="#features" onClick={() => setIsOpen(false)} className="hover:text-eu-gold transition-colors">Features</a>
            <a href="#demo" onClick={() => setIsOpen(false)} className="hover:text-eu-gold transition-colors">Demo</a>
            <button onClick={onNavigateToApp} className="bg-eu-blue px-4 py-2 rounded-md text-white hover:bg-opacity-80 transition-opacity">Get Started</button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
        </>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <LogoIcon className="w-8 h-8 text-eu-blue" />
                    <span className="font-display font-bold text-lg">EU Transport AI</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 font-medium">
                    <NavLinks />
                </nav>
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>
             <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-dark-bg"
                    >
                        <nav className="flex flex-col items-center gap-4 py-4">
                            <NavLinks />
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

// Fix: Removed React.FC to improve type inference for component props.
const HeroSection = ({ onNavigateToApp }: { onNavigateToApp: () => void }) => (
    <section className="relative min-h-screen flex items-center justify-center bg-eu-blue text-white overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-eu-blue to-dark-bg opacity-80"></div>
        <motion.div 
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
        >
             {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-eu-gold"
                    style={{
                        width: Math.random() * 3,
                        height: Math.random() * 3,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        x: (Math.random() - 0.5) * 50,
                        y: (Math.random() - 0.5) * 50,
                    }}
                    transition={{
                        duration: Math.random() * 10 + 5,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </motion.div>
        <div className="container mx-auto px-6 text-center z-10">
            <motion.h1 
                className="text-4xl md:text-6xl font-extrabold font-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Empowering Sustainable Mobility
            </motion.h1>
            <motion.p 
                className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Leveraging AI & Policy Intelligence for a Greener European Future.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8"
            >
                <button onClick={onNavigateToApp} className="inline-flex items-center gap-2 bg-eu-gold text-eu-blue font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300">
                    Explore the App <ArrowRightIcon className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    </section>
);

const AboutSection = () => (
    <motion.section 
        className="py-20 bg-white dark:bg-dark-bg"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
    >
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold font-display text-eu-blue dark:text-white">AI-Driven Policy Insights for European Transport</h2>
            <p className="mt-4 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                Our platform transforms complex EU transportation documents and data into actionable intelligence. We empower policymakers, researchers, and industry leaders to make faster, smarter, and more sustainable decisions.
            </p>
        </div>
    </motion.section>
);

const FeaturesSection = () => (
    <motion.section 
        id="features" 
        className="py-20 bg-eu-light-gray dark:bg-dark-card"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
        <div className="container mx-auto px-6">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-display text-eu-blue dark:text-white">Key Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div whileHover={{ y: -10 }} className="bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
                    <AnalyzeIcon className="w-12 h-12 text-eu-blue"/>
                    <h3 className="mt-4 text-xl font-semibold">Data-driven Insights</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Unlock trends from vast datasets with our powerful analytics engine.</p>
                </motion.div>
                 <motion.div whileHover={{ y: -10 }} className="bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
                    <GenerateIcon className="w-12 h-12 text-eu-blue"/>
                    <h3 className="mt-4 text-xl font-semibold">Automated Drafting</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Generate high-quality drafts of policy documents and recommendations.</p>
                </motion.div>
                 <motion.div whileHover={{ y: -10 }} className="bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
                    <ReportIcon className="w-12 h-12 text-eu-blue"/>
                    <h3 className="mt-4 text-xl font-semibold">Smart Reports</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Export findings into professionally formatted, data-rich PDF reports.</p>
                </motion.div>
            </div>
        </div>
    </motion.section>
);

const DemoSection = () => (
    <motion.section 
        id="demo" 
        className="py-20 bg-white dark:bg-dark-bg"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold font-display text-eu-blue dark:text-white">See It in Action</h2>
             <p className="mt-2 mb-12 text-gray-600 dark:text-gray-300">A glimpse into the powerful and intuitive interface.</p>
            <motion.div 
                className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-2"
                 initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                <div className="flex gap-1.5 p-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <img src="https://storage.googleapis.com/maker-studio-project-images-prod/programming_projects/2405/e7317769-e0d5-4a25-992d-5b7b629431e5" alt="Dashboard Preview" className="rounded-b-md"/>
            </motion.div>
        </div>
    </motion.section>
);

// Fix: Removed React.FC to improve type inference for component props.
const CTASection = ({ onNavigateToApp }: { onNavigateToApp: () => void }) => (
    <motion.section 
        id="cta"
        className="py-20 bg-eu-blue text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
    >
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display">Join Europe’s Next Mobility Revolution</h2>
            <p className="mt-4 max-w-2xl mx-auto">
                Be at the forefront of transportation innovation. Get access to the platform and start building a sustainable future today.
            </p>
            <motion.button 
                onClick={onNavigateToApp}
                className="mt-8 inline-block bg-eu-gold text-eu-blue font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px #FFD700" }}
            >
                Launch the Agent
            </motion.button>
        </div>
    </motion.section>
);

const Footer = () => (
    <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-6 text-center">
             <div className="flex justify-center items-center gap-2">
                <LogoIcon className="w-8 h-8 text-white" />
                <span className="font-display font-bold text-lg text-white">EU Transportation Intelligence Agent</span>
            </div>
            <div className="flex justify-center gap-6 my-6">
                <a href="#" className="hover:text-eu-gold transition-colors"><TwitterIcon className="w-6 h-6"/></a>
                <a href="#" className="hover:text-eu-gold transition-colors"><LinkedInIcon className="w-6 h-6"/></a>
            </div>
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} EU Transportation Intelligence Agent. All rights reserved.</p>
        </div>
    </footer>
);


// Fix: Removed React.FC to improve type inference for component props.
const LandingPage = ({ onNavigateToApp }: { onNavigateToApp: () => void }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-200">
             <motion.div className="progress-bar" style={{ scaleX }} />
             <Header onNavigateToApp={onNavigateToApp} />
             <main>
                <HeroSection onNavigateToApp={onNavigateToApp} />
                <AboutSection />
                <FeaturesSection />
                <DemoSection />
                <CTASection onNavigateToApp={onNavigateToApp} />
             </main>
             <Footer />
        </div>
    );
};

// --- MAIN APPLICATION ---

// Fix: Removed React.FC to improve type inference for component props.
const MainApplication = ({ onNavigateToLanding }: { onNavigateToLanding: () => void }) => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const addReport = (report: Report) => {
        setReports(prev => [...prev, report]);
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case Page.Dashboard:
                return <Dashboard files={uploadedFiles} reports={reports} />;
            case Page.KnowledgeBase:
                return <KnowledgeBase uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />;
            case Page.Assistant:
                return <Assistant knowledgeBase={uploadedFiles} />;
            case Page.Reports:
                return <Reports knowledgeBase={uploadedFiles} reports={reports} addReport={addReport} />;
            case Page.Settings:
                return <Settings />;
            default:
                return <Dashboard files={uploadedFiles} reports={reports} />;
        }
    };

    return (
        <div className="relative min-h-screen md:flex bg-eu-light-gray dark:bg-dark-bg text-gray-800 dark:text-gray-200 font-sans">
             {/* Overlay for mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-30 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
            
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-dark-card shadow-lg flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-20 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 px-4">
                     <div className="flex items-center gap-2">
                        <LogoIcon className="w-8 h-8 text-eu-blue" />
                        <span className="font-display font-bold text-lg">EU Transport AI</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 -mr-2">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.name}
                            onClick={() => {
                                setCurrentPage(item.page);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-sm ${
                                currentPage === item.page
                                    ? 'bg-eu-blue text-white shadow-md'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-semibold">{item.name}</span>
                        </button>
                    ))}
                </nav>
                 <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onNavigateToLanding}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowRightIcon className="w-5 h-5 transform rotate-180" />
                        <span className="font-medium">Back to Home</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 mb-4 bg-white dark:bg-dark-card rounded-md shadow-md"
                    aria-label="Open sidebar"
                >
                    <MenuIcon className="w-6 h-6"/>
                </button>
                {renderCurrentPage()}
            </main>
        </div>
    );
};


// --- APP SWITCHER ---
// Fix: Removed React.FC to improve type inference for component props.
const App = () => {
    const [view, setView] = useState<'landing' | 'app'>('landing');

    return (
        <ThemeProvider>
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                >
                    {view === 'landing' ? (
                        <LandingPage onNavigateToApp={() => setView('app')} />
                    ) : (
                        <MainApplication onNavigateToLanding={() => setView('landing')} />
                    )}
                </motion.div>
            </AnimatePresence>
        </ThemeProvider>
    );
};

export default App;