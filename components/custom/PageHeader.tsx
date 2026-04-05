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
        "bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/50",
        "border-b border-gray-200/50",
        className
      )}
    >
      <div className="flex h-16 items-center px-6 md:px-6 max-w-[1400px] mx-0 gap-4">
        {/* Left Section: Navigation Controls */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-200" />
          <Separator orientation="vertical" className="h-6 w-[1px] bg-gray-200/60" />
        </div>

        {/* Center Section: Titles */}
        <div className="flex flex-1 flex-col justify-center overflow-hidden">
          <h1 className="text-sm font-medium text-gray-900 truncate tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[11px] leading-none text-gray-500 font-normal mt-1 truncate">
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