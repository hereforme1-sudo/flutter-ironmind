import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceVisualizerProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export function VoiceVisualizer({ isListening = false, isSpeaking = false, className }: VoiceVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isListening || isSpeaking) {
      interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 100));
      }, 100);
    } else {
      setBars(Array(20).fill(0));
    }
    
    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  return (
    <div className={cn("flex items-end justify-center gap-1 h-16", className)}>
      {bars.map((height, index) => (
        <div
          key={index}
          className={cn(
            "w-1 bg-primary transition-all duration-100",
            isListening || isSpeaking ? "voice-wave" : ""
          )}
          style={{
            height: `${Math.max(4, height)}%`,
            animationDelay: `${index * 50}ms`
          }}
        />
      ))}
    </div>
  );
}