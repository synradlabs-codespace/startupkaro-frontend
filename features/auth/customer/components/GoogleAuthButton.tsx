"use client";

import { useEffect, useRef, useState } from "react";

type GoogleCredentialResponse = {
    credential?: string;
};

declare global {
    interface Window {
        google?: {
            accounts?: {
                id?: {
                    initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
                    renderButton: (
                        parent: HTMLElement,
                        options: { type: "standard"; theme: "outline"; size: "large"; width?: string; text?: "signin_with" | "signup_with" }
                    ) => void;
                };
            };
        };
    }
}

const GOOGLE_SCRIPT_ID = "google-identity-services";

export function GoogleAuthButton({
    text = "signin_with",
    onCredential,
}: {
    text?: "signin_with" | "signup_with";
    onCredential: (idToken: string) => void;
}) {
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const [loadError, setLoadError] = useState("");
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const configError = clientId ? "" : "Google sign in is not configured.";

    useEffect(() => {
        if (!clientId) {
            return;
        }

        const render = () => {
            if (!buttonRef.current || !window.google?.accounts?.id) return;
            buttonRef.current.innerHTML = "";
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => {
                    if (response.credential) onCredential(response.credential);
                },
            });
            window.google.accounts.id.renderButton(buttonRef.current, {
                type: "standard",
                theme: "outline",
                size: "large",
                width: "100%",
                text,
            });
        };

        const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
        if (existingScript) {
            if (window.google?.accounts?.id) render();
            else existingScript.addEventListener("load", render, { once: true });
            return;
        }

        const script = document.createElement("script");
        script.id = GOOGLE_SCRIPT_ID;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = render;
        script.onerror = () => setLoadError("Google sign in could not be loaded.");
        document.head.appendChild(script);
    }, [clientId, onCredential, text]);

    const error = configError || loadError;

    if (error) {
        return (
            <div className="flex h-11 w-full items-center justify-center rounded-md border border-hairline-strong bg-surface px-4 text-center text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                {error}
            </div>
        );
    }

    return <div ref={buttonRef} className="min-h-11 w-full" />;
}
