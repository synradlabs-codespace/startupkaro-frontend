import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";

const BRANDS = [
    { name: "Chai Churi", src: "/brands/chai-churi.webp" },
    { name: "Kleenjal Sipster", src: "/brands/kleenjal-sipster.webp" },
    { name: "Nadar Properties", src: "/brands/nadar-properties.webp" },
    { name: "Paggnation", src: "/brands/paggnation.webp" },
    { name: "Sardar Ji", src: "/brands/sardar-ji.webp" },
    { name: "Social", src: "/brands/social.webp" },
    { name: "Swastik Finance", src: "/brands/swastik-finance.webp" },
    { name: "Synrad Labs", src: "/brands/synrad-labs.webp" },
    { name: "Theka Coffee", src: "/brands/theka-coffee.webp" },
];

function BrandLogo({ name, src }: { name: string; src: string }) {
    return (
        <div className="flex items-center justify-center h-20 w-36 rounded-xl overflow-hidden border border-hairline bg-canvas shrink-0 p-3">
            <div className="relative h-full w-full">
                <Image
                    src={src}
                    alt={name}
                    fill
                    className="object-contain"
                    sizes="112px"
                />
            </div>
        </div>
    );
}

export function BrandsMarqueeSection() {
    return (
        <section className="overflow-x-clip py-10">
            <div className="mx-auto max-w-7xl px-8 mb-6 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                    Trusted by India&apos;s fastest-growing startups
                </p>
            </div>

            <div className="relative overflow-hidden">
                <Marquee pauseOnHover className="[--duration:30s] [--gap:2rem]">
                    {BRANDS.map((brand) => (
                        <BrandLogo key={brand.name} {...brand} />
                    ))}
                </Marquee>

                {/* Fade edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-canvas to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-canvas to-transparent" />
            </div>
        </section>
    );
}
