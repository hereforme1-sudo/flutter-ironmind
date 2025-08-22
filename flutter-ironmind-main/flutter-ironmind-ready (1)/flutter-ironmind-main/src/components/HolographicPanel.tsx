import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HolographicPanelProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glow" | "minimal";
}

export function HolographicPanel({ children, className, variant = "default" }: HolographicPanelProps) {
  const variantClasses = {
    default: "hologram interface-glow",
    glow: "bg-gradient-hologram border border-primary/30 shadow-glow",
    minimal: "bg-card/80 border border-border/50 backdrop-blur-sm"
  };

  return (
    <div className={cn(
      "rounded-lg p-6 backdrop-blur-sm",
      variantClasses[variant],
      className
    )}>
      {/* Scanning Line Effect */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent scanning-line" />
      </div>
      
      {children}
    </div>
  );
}