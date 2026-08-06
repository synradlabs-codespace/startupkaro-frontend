"use client";

// features/customers/components/ui/RequestQuoteDialog.tsx
//
// In-panel replacement for sending a logged-in customer out to the public
// /contact page for quote-priced services. Prefills from the customer's
// profile and submits straight to the same /customer/inquiry endpoint,
// tagged with serviceId so admins see which service the quote is for.

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneField } from "@/components/custom/PhoneField";
import { useCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { useSubmitInquiry } from "@/features/customers/hooks/useSubmitInquiry";
import { validators, validatePhoneDigits, buildPhone, formatNameInput } from "@/lib/validations/common.schema";
import { Send } from "lucide-react";

function digitsFromPhone(phone?: string) {
    if (!phone) return "";
    return phone.replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10);
}

type Service = { id?: string; name: string };
type Profile = { name: string; email: string; phone?: string; mobile?: string } | undefined;

type RequestQuoteDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service: Service;
};

export function RequestQuoteDialog({ open, onOpenChange, service }: RequestQuoteDialogProps) {
    // Bumped only from the user's own open action (not an effect), so the
    // form below remounts with fresh prefilled state each time it's opened -
    // without ever calling setState from inside a useEffect.
    const [sessionKey, setSessionKey] = useState(0);

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (next) setSessionKey((key) => key + 1);
                onOpenChange(next);
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Request a Quote</DialogTitle>
                    <DialogDescription>
                        Tell us a bit more about {service.name} and an advisor will follow up with pricing.
                    </DialogDescription>
                </DialogHeader>
                {open && <RequestQuoteForm key={sessionKey} service={service} onDone={() => onOpenChange(false)} />}
            </DialogContent>
        </Dialog>
    );
}

function RequestQuoteForm({ service, onDone }: { service: Service; onDone: () => void }) {
    const profileQuery = useCustomerProfile();
    const profile: Profile = profileQuery.data;
    const submitInquiry = useSubmitInquiry();

    const [name, setName] = useState(profile?.name ?? "");
    const [email, setEmail] = useState(profile?.email ?? "");
    const [phoneDigits, setPhoneDigits] = useState(digitsFromPhone(profile?.phone ?? profile?.mobile));
    const [message, setMessage] = useState(`I would like a quote for ${service.name}.`);
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});

    const handleSubmit = async () => {
        const nextErrors = {
            name: validators.name(name) ?? undefined,
            email: validators.email(email) ?? undefined,
            phone: validatePhoneDigits(phoneDigits, true) || undefined,
            message: message.trim().length < 10 ? "Message must be at least 10 characters" : undefined,
        };
        if (Object.values(nextErrors).some(Boolean)) {
            setErrors(nextErrors);
            return;
        }

        try {
            await submitInquiry.mutateAsync({
                name: name.trim(),
                email,
                phone: buildPhone(phoneDigits),
                subject: `Quote request: ${service.name}`,
                message,
                serviceId: service.id,
            });
            onDone();
        } catch {
            // useSubmitInquiry already surfaced a toast.
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div>
                    <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-graphite">Full Name</Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(formatNameInput(e.target.value))}
                        className={errors.name ? "border-error-brand" : ""}
                    />
                    {errors.name && <p className="mt-1 text-xs text-error-brand">{errors.name}</p>}
                </div>

                <div>
                    <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-graphite">Email</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? "border-error-brand" : ""}
                    />
                    {errors.email && <p className="mt-1 text-xs text-error-brand">{errors.email}</p>}
                </div>

                <div>
                    <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-graphite">Mobile Number</Label>
                    <PhoneField value={phoneDigits} onChange={setPhoneDigits} error={!!errors.phone} />
                    {errors.phone && <p className="mt-1 text-xs text-error-brand">{errors.phone}</p>}
                </div>

                <div>
                    <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-graphite">Message</Label>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className={errors.message ? "border-error-brand" : ""}
                    />
                    {errors.message && <p className="mt-1 text-xs text-error-brand">{errors.message}</p>}
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onDone}>
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitInquiry.isPending}
                    className="gap-2 bg-primary-brand text-white hover:bg-primary-brand/90"
                >
                    <Send className="h-4 w-4" />
                    {submitInquiry.isPending ? "Sending..." : "Send Request"}
                </Button>
            </DialogFooter>
        </>
    );
}
