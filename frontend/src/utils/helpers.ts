import type { ApiError } from '../types';

// ===========================
// Form Validation Utilities
// ===========================

/**
 * E-posta adresi format kontrolü
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Zorunlu alan kontrolü (boş string, null, undefined kontrolü)
 */
export const validateRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

/**
 * Kullanıcı adı format kontrolü
 */
export const validateUsername = (username: string): boolean => {
  const trimmedUsername = username.trim();
  return trimmedUsername.length >= 3 && trimmedUsername.length <= 20;
};

/**
 * Minimum uzunluk kontrolü
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Maksimum uzunluk kontrolü
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Sadece harf ve rakam kontrolü (alfanümerik)
 */
export const validateAlphanumeric = (value: string): boolean => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(value);
};

// ===========================
// Error Handling Utilities
// ===========================

/**
 * API hatalarını kullanıcı dostu mesajlara çevir
 */
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'status' in error) {
    const apiError = error as ApiError;
    
    switch (apiError.status) {
      case 400:
        return 'Gönderilen bilgiler hatalı. Lütfen kontrol ediniz.';
      case 401:
        return 'Yetkiniz bulunmuyor. Lütfen giriş yapınız.';
      case 403:
        return 'Bu işlemi gerçekleştirme izniniz yok.';
      case 404:
        return 'Aranan kaynak bulunamadı.';
      case 500:
        return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyiniz.';
      case 0:
        return 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol ediniz.';
      default:
        return apiError.message || 'Bilinmeyen bir hata oluştu';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Beklenmeyen bir hata oluştu';
};

/**
 * Hata mesajını console'a log'la ve kullanıcıya göster
 */
export const logAndShowError = (error: unknown, context?: string): string => {
  const errorMessage = handleApiError(error);
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  return errorMessage;
};

// ===========================
// UI/UX Helper Functions
// ===========================

/**
 * Artificial delay oluştur (UX için loading göstermek)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounce function (arama için)
 */
export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function (scroll event'leri için)
 */
export const throttle = <T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===========================
// String Formatting Utilities
// ===========================

/**
 * İlk harfi büyük yap
 */
export const capitalizeFirst = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Her kelimenin ilk harfini büyük yap (Title Case)
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

/**
 * String'i belirli uzunlukta kes ve "..." ekle
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * URL slug oluştur (türkçe karakterleri değiştir)
 */
export const createSlug = (text: string): string => {
  const turkishCharMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'I': 'i', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };

  return text
    .split('')
    .map(char => turkishCharMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// ===========================
// Array/Object Utilities
// ===========================

/**
 * Array'i belirli field'a göre sırala
 */
export const sortByField = <T>(
  array: T[], 
  field: keyof T, 
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Array'i belirli field value'ya göre filtrele
 */
export const filterByField = <T>(
  array: T[], 
  field: keyof T, 
  value: unknown
): T[] => {
  return array.filter(item => item[field] === value);
};

/**
 * Array'den unique değerleri al
 */
export const getUniqueValues = <T>(array: T[], field: keyof T): unknown[] => {
  return [...new Set(array.map(item => item[field]))];
};

/**
 * Deep clone object (JSON serialize/deserialize ile)
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Object'ten undefined/null değerleri temizle
 */
export const removeEmptyValues = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.entries(obj)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

// ===========================
// Date/Time Utilities
// ===========================

/**
 * Tarih formatla (DD/MM/YYYY)
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Relative time (2 saat önce, 3 gün önce vb.)
 */
export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Az önce';
  if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 30) return `${diffDays} gün önce`;
  
  return formatDate(targetDate);
};

// ===========================
// Local Storage Utilities
// ===========================

/**
 * Local storage'a veri kaydet
 */
export const setLocalStorage = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Local storage'dan veri al
 */
export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : (defaultValue || null);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue || null;
  }
};

/**
 * Local storage'dan veri sil
 */
export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// ===========================
// Random/ID Generation
// ===========================

/**
 * Random ID üret (uuid benzeri)
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Random sayı üret (min-max arası)
 */
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};