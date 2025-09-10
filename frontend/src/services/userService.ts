import { apiClient, validateApiResponse, addLoadingDelay } from './api';
import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../types';

/**
 * User Service Class
 * JSONPlaceholder Users API ile tüm CRUD işlemlerini yönetir
 */
export class UserService {
  /**
   * Tüm kullanıcıları getir
   * GET /users
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      // UX için minimal loading delay
      await addLoadingDelay(300);
      
      const users = await apiClient.get<User[]>('/users');
      return validateApiResponse<User[]>(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Kullanıcılar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  /**
   * ID ile tek kullanıcı getir
   * GET /users/:id
   */
  static async getUserById(id: number): Promise<User> {
    try {
      if (!id || id <= 0) {
        throw new Error('Geçerli bir kullanıcı ID\'si gerekli');
      }

      await addLoadingDelay(200);
      
      const user = await apiClient.get<User>(`/users/${id}`);
      return validateApiResponse<User>(user);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(`${id} ID'li kullanıcı bulunamadı`);
      }
      
      throw new Error('Kullanıcı bilgileri yüklenirken bir hata oluştu');
    }
  }

  /**
   * Yeni kullanıcı oluştur
   * POST /users
   * 
   * Not: JSONPlaceholder fake response döndürür, 
   * gerçek veritabanına kaydetmez ancak ID üretir
   */
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      // Validation
      if (!userData.name?.trim()) {
        throw new Error('Kullanıcı adı zorunludur');
      }
      
      if (!userData.username?.trim()) {
        throw new Error('Kullanıcı nickname\'i zorunludur');
      }
      
      if (!userData.email?.trim()) {
        throw new Error('E-posta adresi zorunludur');
      }

      // E-posta formatı kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Geçerli bir e-posta adresi giriniz');
      }

      await addLoadingDelay(500);
      
      const newUser = await apiClient.post<User, CreateUserRequest>('/users', userData);
      return validateApiResponse<User>(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error instanceof Error) {
        throw error; // Validation hatalarını aynen fırlat
      }
      
      throw new Error('Kullanıcı oluşturulurken bir hata oluştu');
    }
  }

  /**
   * Kullanıcı bilgilerini güncelle
   * PUT /users/:id
   * 
   * Not: JSONPlaceholder fake update yapar,
   * gerçek veritabanını güncellemez
   */
  static async updateUser(
    id: number, 
    userData: Partial<CreateUserRequest>
  ): Promise<User> {
    try {
      if (!id || id <= 0) {
        throw new Error('Geçerli bir kullanıcı ID\'si gerekli');
      }

      // Gönderilen verilerden en az biri dolu olmalı
      const hasValidData = Object.values(userData).some(value => 
        value !== undefined && value !== null && String(value).trim() !== ''
      );
      
      if (!hasValidData) {
        throw new Error('Güncellenecek en az bir alan doldurulmalıdır');
      }

      // E-posta validation (eğer e-posta güncelleniyorsa)
      if (userData.email && userData.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          throw new Error('Geçerli bir e-posta adresi giriniz');
        }
      }

      await addLoadingDelay(400);

      const updatePayload: UpdateUserRequest = {
        id,
        ...userData
      };
      
      const updatedUser = await apiClient.patch<User, UpdateUserRequest>(
        `/users/${id}`, 
        updatePayload
      );
      
      return validateApiResponse<User>(updatedUser);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Kullanıcı güncellenirken bir hata oluştu');
    }
  }

  /**
   * Kullanıcıyı sil
   * DELETE /users/:id
   * 
   * Not: JSONPlaceholder fake delete yapar,
   * gerçek veritabanından silmez
   */
  static async deleteUser(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new Error('Geçerli bir kullanıcı ID\'si gerekli');
      }

      await addLoadingDelay(300);
      
      await apiClient.delete(`/users/${id}`);
      
      // Başarılı silme işlemi - log kaydı
      console.log(`User ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(`${id} ID'li kullanıcı bulunamadı`);
      }
      
      throw new Error('Kullanıcı silinirken bir hata oluştu');
    }
  }

  /**
   * Kullanıcı adı veya e-posta ile arama yap
   * JSONPlaceholder bu özelliği desteklemediği için client-side filtreleme
   */
  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('Arama terimi en az 2 karakter olmalıdır');
      }

      const users = await this.getAllUsers();
      const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
      
      return users.filter(user => 
        user.name.toLowerCase().includes(lowercaseSearchTerm) ||
        user.username.toLowerCase().includes(lowercaseSearchTerm) ||
        user.email.toLowerCase().includes(lowercaseSearchTerm)
      );
    } catch (error) {
      console.error('Error searching users:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Kullanıcı araması yapılırken bir hata oluştu');
    }
  }

  /**
   * Kullanıcı doğrulama helper'ı
   */
  static validateUserData(userData: Partial<CreateUserRequest>): string[] {
    const errors: string[] = [];
    
    if (userData.name !== undefined && !userData.name?.trim()) {
      errors.push('Ad alanı boş olamaz');
    }
    
    if (userData.username !== undefined && !userData.username?.trim()) {
      errors.push('Kullanıcı adı boş olamaz');
    }
    
    if (userData.username && userData.username.length < 3) {
      errors.push('Kullanıcı adı en az 3 karakter olmalıdır');
    }
    
    if (userData.email !== undefined && !userData.email?.trim()) {
      errors.push('E-posta adresi boş olamaz');
    }
    
    if (userData.email && userData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.push('Geçerli bir e-posta adresi giriniz');
      }
    }
    
    return errors;
  }
}