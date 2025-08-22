import { cn } from "@/lib/utils";

interface ArcReactorProps {
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  className?: string;
}

export function ArcReactor({ size = "md", isActive = true, className }: ArcReactorProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  return (
    <div className={cn("relative", className)}>
      {/* Outer Ring */}
      <div className={cn(
        "rounded-full border-2 border-primary relative overflow-hidden",
        sizeClasses[size],
        isActive && "arc-reactor"
      )}>
        {/* Inner Core */}
        <div className="absolute inset-3 rounded-full bg-gradient-arc" />
        
        {/* Rotating Lines */}
        <div className="absolute inset-0 animate-spin">
          <div className="absolute top-0 left-1/2 w-px h-full bg-primary-glow transform -translate-x-1/2 opacity-60" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-primary-glow transform -translate-y-1/2 opacity-60" />
        </div>
        
        {/* Core Glow */}
        <div className="absolute inset-6 rounded-full bg-primary animate-pulse" />
      </div>
      
      {/* Outer Glow Effect */}
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping" />
      )}
    </div>
  );
}