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
                        options: { type: "standard"; theme: "outline"; size: "large"; width?: number; text?: "signin_with" | "signup_with" }
                    ) => void;
                };
            };
        };
    }
}

const GOOGLE_SCRIPT_ID = "google-identity-services";
let initializedClientId: string | null = null;
let activeCredentialHandler: ((response: GoogleCredentialResponse) => void) | null = null;

function initializeGoogleIdentity(clientId: string) {
    if (!window.google?.accounts?.id || initializedClientId === clientId) return;

    window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => activeCredentialHandler?.(response),
    });
    initializedClientId = clientId;
}

function getButtonWidth(parent: HTMLElement) {
    const width = parent.getBoundingClientRect().width || parent.parentElement?.getBoundingClientRect().width || 360;
    return Math.max(220, Math.floor(width));
}

function stretchRenderedButton(parent: HTMLElement, targetWidth: number) {
    const rendered = parent.firstElementChild as HTMLElement | null;
    if (!rendered) return;

    const sourceWidth = rendered.getBoundingClientRect().width || 400;
    const scaleX = targetWidth / sourceWidth;
    rendered.style.transformOrigin = "left center";
    rendered.style.transform = `scaleX(${scaleX})`;
    rendered.style.width = `${sourceWidth}px`;
    parent.style.height = `${rendered.getBoundingClientRect().height}px`;
}

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
    const configError = clientId ? "" : "Set NEXT_PUBLIC_GOOGLE_CLIENT_ID and restart the dev server.";

    useEffect(() => {
        if (!clientId) {
            return;
        }

        activeCredentialHandler = (response) => {
            if (response.credential) onCredential(response.credential);
        };

        const render = () => {
            if (!buttonRef.current || !window.google?.accounts?.id) return;
            initializeGoogleIdentity(clientId);
            const width = getButtonWidth(buttonRef.current);
            buttonRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(buttonRef.current, {
                type: "standard",
                theme: "outline",
                size: "large",
                width: Math.min(width, 400),
                text,
            });
            window.requestAnimationFrame(() => {
                if (buttonRef.current) stretchRenderedButton(buttonRef.current, width);
            });
        };

        let resizeFrame = 0;
        const resizeObserver = typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(() => {
                  window.cancelAnimationFrame(resizeFrame);
                  resizeFrame = window.requestAnimationFrame(render);
              });

        if (buttonRef.current) resizeObserver?.observe(buttonRef.current);

        const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
        if (existingScript) {
            if (window.google?.accounts?.id) render();
            else existingScript.addEventListener("load", render, { once: true });
            return () => {
                window.cancelAnimationFrame(resizeFrame);
                resizeObserver?.disconnect();
                existingScript.removeEventListener("load", render);
                if (activeCredentialHandler) activeCredentialHandler = null;
            };
        }

        const script = document.createElement("script");
        script.id = GOOGLE_SCRIPT_ID;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = render;
        script.onerror = () => setLoadError("Google sign in could not be loaded.");
        document.head.appendChild(script);

        return () => {
            window.cancelAnimationFrame(resizeFrame);
            resizeObserver?.disconnect();
            script.onload = null;
            script.onerror = null;
            if (activeCredentialHandler) activeCredentialHandler = null;
        };
    }, [clientId, onCredential, text]);

    const error = configError || loadError;

    if (error) {
        return (
            <div className="flex h-11 w-full items-center justify-center rounded-md border border-hairline-strong bg-surface px-4 text-center text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                {error}
            </div>
        );
    }

    return <div ref={buttonRef} className="min-h-11 w-full overflow-hidden" />;
}
