
'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

interface Settings {
    id: string;
    autoPublish: boolean;
    postingSchedule: string;
    contentTopics: string[];
    aiTone: string;
    includeCodeExamples: boolean;
    minWordCount: number;
    maxWordCount: number;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [topicInput, setTopicInput] = useState('');

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                alert('Settings saved successfully');
            } else {
                alert('Failed to save settings');
            }
        } catch (e) {
            alert('Error saving settings');
        }
        setSaving(false);
    };

    const addTopic = () => {
        if (topicInput && settings) {
            setSettings({
                ...settings,
                contentTopics: [...settings.contentTopics, topicInput]
            });
            setTopicInput('');
        }
    };

    const removeTopic = (topic: string) => {
        if (settings) {
            setSettings({
                ...settings,
                contentTopics: settings.contentTopics.filter(t => t !== topic)
            });
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!settings) return <div className="p-8 text-white">Error loading settings</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 font-heading">System Configuration</h1>

            <div className="space-y-8">
                {/* Automation Settings */}
                <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        🤖 Automation Control
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                            <div>
                                <div className="font-bold text-white">Auto-Publish</div>
                                <div className="text-sm text-gray-400">Automatically publish generated posts</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.autoPublish}
                                    onChange={e => setSettings({ ...settings, autoPublish: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(var(--brand))]"></div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Publishing Schedule</label>
                            <select
                                value={settings.postingSchedule}
                                onChange={e => setSettings({ ...settings, postingSchedule: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[rgb(var(--brand))] focus:outline-none"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Content Settings */}
                <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">📝 Content Generation</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">AI Tone & Style</label>
                            <input
                                type="text"
                                value={settings.aiTone}
                                onChange={e => setSettings({ ...settings, aiTone: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[rgb(var(--brand))] focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Min Words</label>
                                <input
                                    type="number"
                                    value={settings.minWordCount}
                                    onChange={e => setSettings({ ...settings, minWordCount: parseInt(e.target.value) })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[rgb(var(--brand))] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Max Words</label>
                                <input
                                    type="number"
                                    value={settings.maxWordCount}
                                    onChange={e => setSettings({ ...settings, maxWordCount: parseInt(e.target.value) })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[rgb(var(--brand))] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={settings.includeCodeExamples}
                                onChange={e => setSettings({ ...settings, includeCodeExamples: e.target.checked })}
                                id="code_examples"
                                className="rounded bg-black/50 border-white/10 text-[rgb(var(--brand))] focus:ring-[rgb(var(--brand))]"
                            />
                            <label htmlFor="code_examples" className="text-white">Include Code Examples when relevant</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Topics of Interest</label>
                            <div className="flex gap-2 mb-2 flex-wrap">
                                {settings.contentTopics?.map(topic => (
                                    <span key={topic} className="px-3 py-1 bg-[rgb(var(--brand))]/10 text-[rgb(var(--brand))] rounded-full text-sm flex items-center gap-2">
                                        {topic}
                                        <button onClick={() => removeTopic(topic)} className="hover:text-white">&times;</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={topicInput}
                                    onChange={e => setTopicInput(e.target.value)}
                                    placeholder="Add a new topic..."
                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[rgb(var(--brand))] focus:outline-none"
                                    onKeyDown={e => e.key === 'Enter' && addTopic()}
                                />
                                <button onClick={addTopic} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white">Add</button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[rgb(var(--brand))] hover:bg-[rgb(var(--brand))]/90 text-black font-bold py-3 px-8 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
