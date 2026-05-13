import { Quote } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { BasicNumberTicker } from "@/components/fancy/text";

const proofStats = [
    { value: 4.9, decimals: 1, suffix: "/5", label: "Average client rating" },
    { value: 500, decimals: 0, suffix: "+", label: "Businesses supported" },
    { value: 100, decimals: 0, suffix: "%", label: "Expert-led filings" },
];

const testimonials = [
    {
        quote: "StartupKaro made our company registration feel simple. The pricing was clear, the checklist was precise, and we always knew what was happening next.",
        name: "Aarav Mehta",
        role: "Founder, Fintech startup",
    },
    {
        quote: "I had delayed GST registration because I did not know where to begin. Their team handled the documents, filing, and follow-ups without the usual back-and-forth.",
        name: "Priya Nair",
        role: "Owner, D2C brand",
    },
    {
        quote: "The biggest win was transparency. No surprise charges, no vague timelines, and a real expert explaining what each step meant for our business.",
        name: "Rohan Kapoor",
        role: "Co-founder, SaaS company",
    },
    {
        quote: "We needed trademark filing quickly before launch. StartupKaro helped us understand classes, risks, and next steps in plain language.",
        name: "Meera Sethi",
        role: "Founder, Consumer brand",
    },
    {
        quote: "For a small business, compliance can feel intimidating. Their online process removed the friction and let us focus on operations.",
        name: "Kabir Arora",
        role: "Director, Retail services",
    },
];

function TestimonialCard({ quote, name, role }: (typeof testimonials)[number]) {
    return (
        <article className="group relative flex h-56 w-[320px] shrink-0 flex-col justify-between overflow-hidden rounded-xl border border-hairline bg-canvas p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-brand hover:shadow-[0_2px_8px_rgba(26,26,26,0.08)] sm:w-[380px]">
            <Quote className="pointer-events-none absolute -right-2 -top-3 h-24 w-24 text-primary-brand opacity-10" />
            <p className="relative z-10 text-sm leading-relaxed text-charcoal">{quote}</p>
            <div className="relative z-10 border-t border-hairline pt-4">
                <p className="text-sm font-medium text-ink">{name}</p>
                <p className="mt-0.5 text-xs text-graphite">{role}</p>
            </div>
        </article>
    );
}

export function TestimonialsSection() {
    return (
        <section className="bg-cloud px-4 py-20 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-hairline bg-canvas">
                <div className="h-1 w-full bg-primary-brand" />
                <div className="grid gap-8 border-b border-hairline px-6 py-10 md:grid-cols-[minmax(0,1fr)_360px] md:px-8 lg:px-10">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-primary-brand">
                            Founder feedback
                        </p>
                        <h2 className="font-display text-4xl font-medium leading-none text-ink md:text-5xl">
                            Built for founders who want clarity before commitment
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-charcoal">
                            Compliance decisions carry real consequences. These stories highlight the things founders care about most: predictable pricing, responsive experts, and zero confusion about what happens next.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                        {proofStats.map((stat) => (
                            <div key={stat.label} className="rounded-xl border border-primary-soft bg-primary-soft/55 p-4">
                                <p className="font-display text-2xl font-medium text-ink">
                                    <BasicNumberTicker value={stat.value} decimals={stat.decimals} />
                                    {stat.suffix}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.28px] text-primary-deep">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative overflow-hidden py-8">
                    <Marquee pauseOnHover className="[--duration:34s] [--gap:1.25rem]">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.name} {...testimonial} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-canvas via-canvas/90 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-canvas via-canvas/90 to-transparent" />
                </div>
            </div>
        </section>
    );
}
