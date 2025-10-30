
import React from 'react';
import Card from './common/Card';

const Settings: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <Card>
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Application Settings</h2>
                <p className="text-gray-600">
                    This is a placeholder for future settings and configurations.
                    Potential features could include:
                </p>
                <ul className="mt-4 ml-5 space-y-2 text-gray-600 list-disc">
                    <li>API Key Management</li>
                    <li>Theme Customization (Light/Dark Mode)</li>
                    <li>Notification Preferences</li>
                    <li>Data Export Options</li>
                </ul>
            </Card>
             <Card>
                <h2 className="mb-4 text-xl font-semibold text-gray-700">About</h2>
                <p className="text-gray-600">
                    EU Transportation Policy AI Agent v1.0.0
                </p>
                 <p className="mt-2 text-gray-600">
                    Built with React, TypeScript, Tailwind CSS, and the Google Gemini API.
                </p>
            </Card>
        </div>
    );
};

export default Settings;
