import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full",
        "bg-canvas/90 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/80",
        "border-b border-hairline",
        className
      )}
    >
      <div className="flex h-16 items-center px-6 md:px-6 max-w-[1400px] mx-0 gap-4">
        {/* Left Section: Navigation Controls */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 rounded-md border border-hairline bg-canvas hover:bg-surface hover:text-ink transition-all duration-200" />
          <Separator orientation="vertical" className="h-6 w-[1px] bg-hairline" />
        </div>

        {/* Center Section: Titles */}
        <div className="flex flex-1 flex-col justify-center overflow-hidden">
          <h1 className="text-sm font-medium text-ink truncate tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[11px] leading-tight text-steel font-normal mt-1 truncate">
              {description}
            </p>
          )}
        </div>

        {/* Right Section: Actions */}
        {action && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}
