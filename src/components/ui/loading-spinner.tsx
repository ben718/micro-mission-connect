
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const LoadingSpinner = ({ 
  className, 
  size = "md", 
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("text-bleu animate-spin", sizeClasses[size])} />
      {text && (
        <p className="text-gray-600 mt-2 text-sm">{text}</p>
      )}
    </div>
  );
};
