"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck, LockKeyhole, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/custom/PasswordField";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { GoogleRegistrationStep } from "./GoogleRegistrationStep";
import { useCustomerLogin } from "../hooks/useCustomerAuth";
import { buildAuthRouteWithNext, useRedirectIfAuthenticated } from "@/features/auth/shared/hooks/useAuthRedirect";
import { formatEmailInput, validators } from "@/lib/validations/common.schema";

export function CustomerLoginForm() {
    useRedirectIfAuthenticated();
    const { login, continueWithGoogle, completeRegistration, loading, error } = useCustomerLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
    const [googleRegistration, setGoogleRegistration] = useState<{ token: string; name?: string } | null>(null);
    const [registerHref, setRegisterHref] = useState("/customer/register");

    const clearFieldError = (key: keyof typeof fieldErrors) =>
        setFieldErrors((f) => ({ ...f, [key]: "" }));

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setRegisterHref(buildAuthRouteWithNext("/customer/register", "customer", searchParams.get("next")));
    }, []);

    const validate = () => {
        const errors = {
            email: validators.email(email) ?? "",
            password: !password ? "Password is required" : "",
        };
        setFieldErrors(errors);
        return Object.values(errors).every((e) => e === "");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await login(email, password);
    };

    const handleGoogleCredential = useCallback(async (idToken: string) => {
        const response = await continueWithGoogle(idToken);
        if (response?.status === "registration_required") {
            setGoogleRegistration({ token: response.registrationToken, name: response.name });
        }
    }, [continueWithGoogle]);

    const handleGoogleRegistrationSubmit = async ({ name, phone }: { name: string; phone: string }) => {
        if (!googleRegistration) return;
        await completeRegistration({ registrationToken: googleRegistration.token, name, phone });
    };

    return (
        <main className="min-h-screen bg-cloud px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center md:max-w-2xl lg:max-w-6xl">
                <div className="grid w-full overflow-hidden rounded-xl border border-hairline bg-canvas lg:grid-cols-[1.25fr_0.75fr]">
                    <section className="p-5 md:p-6">
                        <div className="mb-5 border-b border-hairline pb-5">
                            <Link href="/" className="mb-4 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to home
                            </Link>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">StartupKaro</p>
                            <h1 className="font-display text-4xl font-medium leading-none text-ink">Welcome back</h1>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-graphite">
                                Continue your registrations, compliance work, purchases, and profile updates.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-lg border border-bloom-deep bg-bloom-rose px-4 py-3 text-sm text-bloom-deep">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                                        <Mail className="h-3.5 w-3.5" />
                                        Email
                                    </Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(formatEmailInput(e.target.value)); clearFieldError("email"); }}
                                        required
                                        autoComplete="email"
                                        placeholder="Email"
                                        className={`h-10 w-full ${fieldErrors.email ? "border-error-brand" : "border-hairline-strong"}`}
                                    />
                                    {fieldErrors.email && <p className="mt-1 text-xs text-error-brand">{fieldErrors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                                        <LockKeyhole className="h-3.5 w-3.5" />
                                        Password
                                    </Label>
                                    <PasswordField
                                        value={password}
                                        onChange={(value) => { setPassword(value); clearFieldError("password"); }}
                                        error={!!fieldErrors.password}
                                        required
                                        autoComplete="current-password"
                                        placeholder="Password"
                                    />
                                    {fieldErrors.password && <p className="mt-1 text-xs text-error-brand">{fieldErrors.password}</p>}
                                </div>

                                <div className="flex justify-center border-t border-hairline pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="h-11 w-full max-w-100 rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:bg-hairline-strong"
                                    >
                                        {loading ? "Signing in..." : "Sign in"}
                                    </button>
                                </div>

                                <Link href="/customer/reset-password" className="block text-center text-sm text-graphite hover:text-ink">
                                    Forgot password?
                                </Link>
                            </form>

                            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                                <span className="h-px flex-1 bg-hairline" /> OR <span className="h-px flex-1 bg-hairline" />
                            </div>

                            <div className="flex justify-center">
                                <GoogleAuthButton onCredential={handleGoogleCredential} />
                            </div>
                            {googleRegistration && (
                                <GoogleRegistrationStep
                                    initialName={googleRegistration.name}
                                    loading={loading}
                                    onSubmit={handleGoogleRegistrationSubmit}
                                />
                            )}
                        </div>

                        <div className="mt-4 text-center text-sm">
                            <span className="text-graphite">New to StartupKaro? </span>
                            <Link href={registerHref} className="text-link-blue hover:text-primary-deep">
                                Create a customer account
                            </Link>
                        </div>
                    </section>

                    <section className="hidden min-h-[320px] flex-col justify-between bg-surface p-5 md:p-6 lg:flex">
                        <div className="space-y-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary-soft bg-canvas">
                                <FileCheck className="h-5 w-5 text-primary-brand" />
                            </div>
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Customer workspace</p>
                                <h2 className="font-display text-2xl font-medium leading-none text-ink">
                                    Your business services in one place.
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-charcoal">
                                    Track purchased services, manage account details, and return to ongoing compliance tasks without searching through emails.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
