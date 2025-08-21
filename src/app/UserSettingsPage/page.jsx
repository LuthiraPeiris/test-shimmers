'use client';

import React, { useState, useEffect } from 'react';
import '../../app/globals.css';
import UserSettingsHeader from '../components/UserSettingsPage/UserSettingsHeader';
import UserSettingsForm from '../components/UserSettingsPage/UserSettingsForm';

const UserSettingsPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user settings (simulate with API)
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const res = await fetch('/api/UserSettings');
            const data = await res.json();
            setUser(data.user || {});
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleSave = async (formData) => {
        await fetch('/api/UserSettings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        alert('Settings saved successfully!');
    };

    const handleCancel = () => {
        // Optionally refetch or reset form
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <UserSettingsHeader />
            <main className="container mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold mb-4">Update Your Information</h2>
                    {loading ? (
                        <div className="text-center text-gray-500 py-10">Loading...</div>
                    ) : (
                        <UserSettingsForm userData={user} onSave={handleSave} onCancel={handleCancel} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserSettingsPage;
