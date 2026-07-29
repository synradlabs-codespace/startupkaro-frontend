import { Quote } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { BasicNumberTicker } from "@/components/fancy/text";

const proofStats = [
    { value: 4.9, decimals: 1, suffix: "/5", label: "Average client rating" },
    { value: 5000, decimals: 0, suffix: "+", label: "Businesses supported" },
    { value: 100, decimals: 0, suffix: "%", label: "Expert-led filings" },
];

const testimonials = [
    {
        quote: "Partnering with StartupKaro has been one of the best decisions for our business. Their expertise in legal structuring, financial planning, and strategic consulting helped us build a stronger foundation and move forward with confidence. They truly understand the challenges founders face.",
        name: "Gourav Kamboj",
        role: "Founder & Managing Director, CHAICHURI",
    },
    {
        quote: "The team's support in internal audits, compliance reviews, and investor relations has been exceptional. Their professionalism, responsiveness, and practical approach have made them a trusted advisory partner for our organization.",
        name: "Rohit Sahani",
        role: "Managing Director & CEO, Swastik Finance Limited",
    },
    {
        quote: "StartupKaro made our company incorporation and compliance journey completely hassle-free. Every process was handled efficiently, timelines were met, and their proactive guidance ensured we could focus on growing our business without worrying about regulatory matters.",
        name: "Rushil Sehgal",
        role: "Director, Synrad Labs Private Limited",
    },
    {
        quote: "From setting up our company to providing valuable business and management consultancy, the guidance has been exceptional. Their strategic advice has played an important role in helping us make better business decisions.",
        name: "Urvashi Khanna",
        role: "Managing Director, Prideora Exports Private Limited",
    },
    {
        quote: "The entire incorporation process was smooth, transparent, and professionally managed. Whenever we had questions, the team responded promptly and ensured everything was completed without unnecessary delays.",
        name: "Priyanka Kohli",
        role: "Director, VelvetVista Accommodations Private Limited",
    },
    {
        quote: "After a frustrating experience with another consultant, I had almost lost confidence in the registration process. StartupKaro completely changed that experience. They simplified every step, handled all the formalities professionally, and made the entire journey stress-free.",
        name: "Surangma Chhabra",
        role: "Managing Partner, Mixectar LLP",
    },
    {
        quote: "StartupKaro's legal advisory is simply phenomenal. Their team explains every legal aspect with clarity, protects our interests, and is always available whenever we need guidance. It's reassuring to have such dependable experts by our side.",
        name: "Tina Ahuja",
        role: "Artist, Celebrity",
    },
    {
        quote: "Setting up a manufacturing beverages plant involved multiple regulatory and operational challenges. The guidance and support we received throughout the project were outstanding. Their expertise gave us the confidence to establish our manufacturing unit successfully.",
        name: "Navjot Kaur",
        role: "Director, Bora Bora Wellness Private Limited",
    },
    {
        quote: "StartupKaro's franchise advisory and business consulting are among the best I've experienced. Their deep understanding of branding, expansion, and the food industry has helped us create a strong roadmap for future growth. I highly recommend them to every aspiring entrepreneur.",
        name: "Rajinder Singh",
        role: "Proprietor, Sardaar Ji Amritsari Kulcha",
    },
    {
        quote: "I've been relying on StartupKaro for my income tax filings, and the experience has always been seamless. Their team ensures timely filing, accurate compliance, and excellent support, making taxation completely stress-free every year.",
        name: "Amit Verma",
        role: "Salaried Individual",
    },
];

function TestimonialCard({ quote, name, role }: (typeof testimonials)[number]) {
    return (
        <article className="group relative flex h-72 w-[320px] shrink-0 flex-col justify-between overflow-hidden rounded-xl border border-hairline bg-canvas p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-brand hover:shadow-[0_2px_8px_rgba(26,26,26,0.08)] sm:w-[420px]">
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
        <section className="overflow-x-clip bg-cloud px-4 py-20 sm:px-6 md:py-24 lg:px-8">
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
                            Every startup has a unique journey. Read what founders have to say about their experience working with us—from validating business ideas and navigating compliance to launching, scaling, and achieving sustainable growth with the right strategic guidance
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
