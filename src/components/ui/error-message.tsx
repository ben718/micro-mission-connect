
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
  variant?: "destructive" | "default";
}

export const ErrorMessage = ({ 
  message, 
  className,
  variant = "destructive"
}: ErrorMessageProps) => {
  return (
    <Alert variant={variant} className={cn("", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
