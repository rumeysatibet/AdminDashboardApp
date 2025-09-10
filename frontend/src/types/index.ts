// ===========================
// JSONPlaceholder Veri Modelleri
// ===========================

// Kullanıcı veri modeli (JSONPlaceholder uyumlu)
export interface User extends Record<string, unknown> {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// Gönderi veri modeli (JSONPlaceholder uyumlu)
export interface Post extends Record<string, unknown> {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// ===========================
// CRUD İşlem Tipleri
// ===========================

// Yeni kullanıcı oluştururken kullanılacak (id olmadan)
export interface CreateUserRequest {
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
}

// Kullanıcı güncelleme için
export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number;
}

// Yeni gönderi oluşturma
export interface CreatePostRequest {
  userId: number;
  title: string;
  body: string;
}

// Gönderi güncelleme
export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: number;
}

// ===========================
// API ve State Yönetim Tipleri
// ===========================

// API çağrıları için generic response tipi
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Loading durumları için
export type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';

// Users hook state'i için
export interface UsersState {
  users: User[];
  loading: LoadingState;
  error: string | null;
  selectedUser: User | null;
}

// Posts hook state'i için
export interface PostsState {
  posts: Post[];
  loading: LoadingState;
  error: string | null;
  selectedPost: Post | null;
  filteredByUserId: number | null;
}

// Form state'leri için generic tip
export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

// ===========================
// UI Component Tipleri
// ===========================

// Modal component props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  footer?: React.ReactNode;
}

// Button variant'ları
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';

// Button component props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
}

// Table column tanımı
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

// Table component props
export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onSort?: (key: keyof T) => void;
}

// Loading Spinner props
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  text?: string;
}

// Toast notification tipleri
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

// ===========================
// Form Validation Tipleri
// ===========================

// Validation kuralı tipi
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | undefined;
}

// Field validation konfigürasyonu
export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}

// ===========================
// Route ve Navigation Tipleri
// ===========================

// Sayfa route'ları
export type PageRoute = '/' | '/users' | '/posts';

// Navigation item
export interface NavigationItem {
  path: PageRoute;
  label: string;
  icon?: string;
}

// ===========================
// API Error Tipleri
// ===========================

// API hata detayları
export interface ApiError {
  status: number;
  message: string;
  details?: string;
}

// HTTP status kodları
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];