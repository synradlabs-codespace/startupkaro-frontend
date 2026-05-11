import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";

const BRANDS = [
    { name: "Chai Churi", src: "/brands/chai-churi.jpg" },
    { name: "Kleenjal Sipster", src: "/brands/kleenjal-sipster.jpg" },
    { name: "Nadar Properties", src: "/brands/nadar-properties.jpg" },
    { name: "Paggnation", src: "/brands/paggnation.jpeg" },
    { name: "Picos", src: "/brands/picos.jpeg" },
    { name: "Sardar Ji", src: "/brands/sardar-ji.jpg" },
    { name: "Social", src: "/brands/social.jpeg" },
    { name: "Swastik Finance", src: "/brands/swastik-finance.jpg" },
    { name: "Synrad Labs", src: "/brands/synrad-labs.jpg" },
    { name: "Theka Coffee", src: "/brands/theka-coffee.jpg" },
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
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-8 mb-6 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.28px] text-stone">
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
