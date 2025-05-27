import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: number;
  className?: string;
}

const Loading = ({ size = 24, className = "" }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className={`animate-spin ${className}`} size={size} />
    </div>
  );
};

export default Loading; 