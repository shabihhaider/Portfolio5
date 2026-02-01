"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface DemoCredentialsProps {
    email: string;
    password: string;
}

export function DemoCredentials({ email, password }: DemoCredentialsProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="mt-4 p-4 rounded-lg bg-brand/5 border border-brand/20 backdrop-blur-sm">
            <div className="text-xs font-mono text-brand mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                DEMO ACCESS
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-gray-500 flex-shrink-0">Email:</span>
                        <code className="text-sm text-gray-300 font-mono truncate">{email}</code>
                    </div>
                    <button
                        onClick={() => copyToClipboard(email, "email")}
                        className="flex-shrink-0 p-1.5 hover:bg-brand/10 rounded transition-colors"
                        aria-label="Copy email"
                    >
                        {copiedField === "email" ? (
                            <Check className="w-3 h-3 text-brand" />
                        ) : (
                            <Copy className="w-3 h-3 text-gray-500" />
                        )}
                    </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-gray-500 flex-shrink-0">Pass:</span>
                        <code className="text-sm text-gray-300 font-mono truncate">{password}</code>
                    </div>
                    <button
                        onClick={() => copyToClipboard(password, "password")}
                        className="flex-shrink-0 p-1.5 hover:bg-brand/10 rounded transition-colors"
                        aria-label="Copy password"
                    >
                        {copiedField === "password" ? (
                            <Check className="w-3 h-3 text-brand" />
                        ) : (
                            <Copy className="w-3 h-3 text-gray-500" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
