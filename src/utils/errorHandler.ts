
import { toast } from "sonner";

export interface ErrorInfo {
  message: string;
  code?: string;
  context?: string;
}

export class AppError extends Error {
  code?: string;
  context?: string;

  constructor(message: string, code?: string, context?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }
}

export function handleError(error: any, context?: string): ErrorInfo {
  console.error(`[ErrorHandler] ${context || 'Unknown context'}:`, error);

  let message = "Une erreur inattendue s'est produite";
  let code = error?.code;

  if (error instanceof AppError) {
    message = error.message;
    code = error.code;
  } else if (error?.message) {
    message = error.message;
  }

  // Map common Supabase errors
  if (code === 'PGRST116') {
    message = "Ressource non trouvée";
  } else if (code === '23505') {
    message = "Cette donnée existe déjà";
  } else if (code === '42501') {
    message = "Accès non autorisé";
  }

  const errorInfo: ErrorInfo = {
    message,
    code,
    context
  };

  // Show toast for user-facing errors
  if (context && !context.includes('background')) {
    toast.error(message);
  }

  return errorInfo;
}

export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return null;
    }
  };
}
