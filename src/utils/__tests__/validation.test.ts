
import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  validatePassword, 
  validateWebsite, 
  validatePhone,
  validateRequired,
  validateMinLength,
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber
} from '../validation';

describe('Email validation', () => {
  it('should validate correct emails', () => {
    expect(validateEmail('test@example.com')).toEqual({ isValid: true });
    expect(validateEmail('user.name@domain.co.uk')).toEqual({ isValid: true });
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid-email')).toEqual({ 
      isValid: false, 
      message: "Format d'email invalide" 
    });
    expect(validateEmail('test@')).toEqual({ 
      isValid: false, 
      message: "Format d'email invalide" 
    });
  });
});

describe('Password validation', () => {
  it('should validate strong passwords', () => {
    expect(validatePassword('password123')).toEqual({ isValid: true });
    expect(validatePassword('123456')).toEqual({ isValid: true });
  });

  it('should reject weak passwords', () => {
    expect(validatePassword('12345')).toEqual({ 
      isValid: false, 
      message: "Le mot de passe doit contenir au moins 6 caractères" 
    });
    expect(validatePassword('')).toEqual({ 
      isValid: false, 
      message: "Le mot de passe doit contenir au moins 6 caractères" 
    });
  });
});

describe('Website validation', () => {
  it('should validate correct URLs', () => {
    expect(validateWebsite('https://example.com')).toBe(true);
    expect(validateWebsite('http://test.org')).toBe(true);
    expect(validateWebsite('')).toBe(true); // Empty is valid (optional field)
  });

  it('should reject invalid URLs', () => {
    expect(validateWebsite('not-a-url')).toBe(false);
    expect(validateWebsite('ftp://invalid')).toBe(false);
  });
});

describe('Phone validation', () => {
  it('should validate French phone numbers', () => {
    expect(validatePhone('0123456789')).toBe(true);
    expect(validatePhone('+33123456789')).toBe(true);
    expect(validatePhone('01 23 45 67 89')).toBe(true);
    expect(validatePhone('')).toBe(true); // Empty is valid (optional field)
  });

  it('should reject invalid phone numbers', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('0023456789')).toBe(false); // Starts with 00
  });
});

describe('Required field validation', () => {
  it('should validate non-empty strings', () => {
    expect(validateRequired('test')).toBe(true);
    expect(validateRequired(' test ')).toBe(true);
  });

  it('should reject empty strings', () => {
    expect(validateRequired('')).toBe(false);
    expect(validateRequired('   ')).toBe(false);
  });
});

describe('Minimum length validation', () => {
  it('should validate strings meeting minimum length', () => {
    expect(validateMinLength('hello', 3)).toBe(true);
    expect(validateMinLength('test', 4)).toBe(true);
  });

  it('should reject strings below minimum length', () => {
    expect(validateMinLength('hi', 3)).toBe(false);
    expect(validateMinLength('', 1)).toBe(false);
  });
});
