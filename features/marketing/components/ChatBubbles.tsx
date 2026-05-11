"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CHAT = [
    { id: 0, who: "founder", text: "Hi! I want to register my startup as a Private Limited company. Where do I start?" },
    { id: 1, who: "ca",      text: "Great choice! We need 2 directors and a unique company name to begin." },
    { id: 2, who: "founder", text: "How long does the whole registration take?" },
    { id: 3, who: "ca",      text: "Typically 7 to 10 working days once all your documents are in order." },
    { id: 4, who: "founder", text: "What documents do I need to provide?" },
    { id: 5, who: "ca",      text: "PAN, Aadhaar, address proof, and a registered office address for each director." },
    { id: 6, who: "founder", text: "Can I use my home address as the registered office?" },
    { id: 7, who: "ca",      text: "Absolutely! A home address is perfectly valid under MCA guidelines." },
    { id: 8, who: "founder", text: "What about GST? Do I need it right away?" },
    { id: 9, who: "ca",      text: "Only if turnover crosses Rs. 20L or you sell across states. We handle it all!" },
] as const;

const MAX_VISIBLE = 5;
const STEP_MS     = 3000;

let _uid = 0;
interface Bubble { uid: number; chatId: number }

export function ChatBubbles() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const chatIdxRef            = useRef(0);

    useEffect(() => {
        function addNext() {
            const chatId = chatIdxRef.current % CHAT.length;
            chatIdxRef.current++;

            setBubbles(prev => {
                const next = [...prev, { uid: _uid++, chatId }];
                // Drop the oldest once we exceed the visible limit
                return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
            });
        }

        addNext();
        const interval = setInterval(addNext, STEP_MS);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col justify-end gap-3 h-full overflow-hidden px-4 pt-5 pb-2">
            <AnimatePresence mode="popLayout">
                {bubbles.map(bubble => {
                    const msg       = CHAT[bubble.chatId];
                    const isFounder = msg.who === "founder";

                    return (
                        <motion.div
                            key={bubble.uid}
                            layout
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } }}
                            transition={{
                                layout:  { type: "spring", stiffness: 320, damping: 32, mass: 0.8 },
                                opacity: { duration: 0.45, ease: [0.0, 0.0, 0.2, 1] },
                                y:       { duration: 0.45, ease: [0.0, 0.0, 0.2, 1] },
                            }}
                            className={`flex items-end gap-2 ${isFounder ? "" : "flex-row-reverse"}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0 ${
                                    isFounder
                                        ? "bg-coral/40 text-coral"
                                        : "bg-white/90 text-dark-navy"
                                }`}
                            >
                                {isFounder ? "F" : "CA"}
                            </div>

                            {/* Bubble */}
                            <div
                                className={`max-w-[78%] px-3.5 py-2.5 text-[11px] leading-relaxed ${
                                    isFounder
                                        ? "bg-white/92 border border-white/20 text-ink rounded-2xl rounded-bl-sm"
                                        : "bg-white/20 text-white rounded-2xl rounded-br-sm"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
