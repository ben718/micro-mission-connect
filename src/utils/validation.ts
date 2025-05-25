export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins 8 caractères"
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins une majuscule"
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins une minuscule"
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins un chiffre"
    };
  }

  return { isValid: true };
};

export const validateWebsite = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
}; 