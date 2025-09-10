import { apiClient, validateApiResponse, addLoadingDelay } from './api';
import type { 
  Post, 
  CreatePostRequest, 
  UpdatePostRequest 
} from '../types';

/**
 * Post Service Class
 * JSONPlaceholder Posts API ile tüm CRUD işlemlerini yönetir
 */
export class PostService {
  /**
   * Tüm gönderileri getir
   * GET /posts
   */
  static async getAllPosts(): Promise<Post[]> {
    try {
      await addLoadingDelay(300);
      
      const posts = await apiClient.get<Post[]>('/posts');
      return validateApiResponse<Post[]>(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Gönderiler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  /**
   * ID ile tek gönderi getir
   * GET /posts/:id
   */
  static async getPostById(id: number): Promise<Post> {
    try {
      if (!id || id <= 0) {
        throw new Error('Geçerli bir gönderi ID\'si gerekli');
      }

      await addLoadingDelay(200);
      
      const post = await apiClient.get<Post>(`/posts/${id}`);
      return validateApiResponse<Post>(post);
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(`${id} ID'li gönderi bulunamadı`);
      }
      
      throw new Error('Gönderi yüklenirken bir hata oluştu');
    }
  }

  /**
   * Belirli kullanıcıya ait gönderileri getir
   * GET /posts?userId=:userId
   */
  static async getPostsByUserId(userId: number): Promise<Post[]> {
    try {
      if (!userId || userId <= 0) {
        throw new Error('Geçerli bir kullanıcı ID\'si gerekli');
      }

      await addLoadingDelay(250);
      
      const posts = await apiClient.get<Post[]>(`/posts?userId=${userId}`);
      return validateApiResponse<Post[]>(posts);
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      throw new Error(`${userId} ID'li kullanıcının gönderileri yüklenirken bir hata oluştu`);
    }
  }

  /**
   * Yeni gönderi oluştur
   * POST /posts
   * 
   * Not: JSONPlaceholder fake response döndürür,
   * gerçek veritabanına kaydetmez ancak ID üretir
   */
  static async createPost(postData: CreatePostRequest): Promise<Post> {
    try {
      // Validation
      if (!postData.userId || postData.userId <= 0) {
        throw new Error('Geçerli bir kullanıcı ID\'si seçiniz');
      }
      
      if (!postData.title?.trim()) {
        throw new Error('Gönderi başlığı zorunludur');
      }
      
      if (postData.title.trim().length < 5) {
        throw new Error('Gönderi başlığı en az 5 karakter olmalıdır');
      }
      
      if (!postData.body?.trim()) {
        throw new Error('Gönderi içeriği zorunludur');
      }
      
      if (postData.body.trim().length < 10) {
        throw new Error('Gönderi içeriği en az 10 karakter olmalıdır');
      }

      await addLoadingDelay(500);
      
      const newPost = await apiClient.post<Post, CreatePostRequest>('/posts', postData);
      return validateApiResponse<Post>(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      
      if (error instanceof Error) {
        throw error; // Validation hatalarını aynen fırlat
      }
      
      throw new Error('Gönderi oluşturulurken bir hata oluştu');
    }
  }

  /**
   * Gönderi bilgilerini güncelle
   * PUT /posts/:id
   * 
   * Not: JSONPlaceholder fake update yapar,
   * gerçek veritabanını güncellemez
   */
  static async updatePost(
    id: number, 
    postData: Partial<CreatePostRequest>
  ): Promise<Post> {
    try {
      if (!id || id <= 0) {
        throw new Error('Geçerli bir gönderi ID\'si gerekli');
      }

      // Gönderilen verilerden en az biri dolu olmalı
      const hasValidData = Object.values(postData).some(value => {
        if (typeof value === 'number') return value > 0;
        if (typeof value === 'string') return value.trim() !== '';
        return value !== undefined && value !== null;
      });
      
      if (!hasValidData) {
        throw new Error('Güncellenecek en az bir alan doldurulmalıdır');
      }

      // Title validation (eğer title güncelleniyorsa)
      if (postData.title !== undefined) {
        if (!postData.title?.trim()) {
          throw new Error('Gönderi başlığı boş olamaz');
        }
        if (postData.title.trim().length < 5) {
          throw new Error('Gönderi başlığı en az 5 karakter olmalıdır');
        }
      }

      // Body validation (eğer body güncelleniyorsa)
      if (postData.body !== undefined) {
        if (!postData.body?.trim()) {
          throw new Error('Gönderi içeriği boş olamaz');
        }
        if (postData.body.trim().length < 10) {
          throw new Error('Gönderi içeriği en az 10 karakter olmalıdır');
        }
      }

      // UserId validation (eğer userId güncelleniyorsa)
      if (postData.userId !== undefined && (!postData.userId || postData.userId <= 0)) {
        throw new Error('Geçerli bir kullanıcı ID\'si seçiniz');
      }

      await addLoadingDelay(400);

      const updatePayload: UpdatePostRequest = {
        id,
        ...postData
      };
      
      const updatedPost = await apiClient.patch<Post, UpdatePostRequest>(
        `/posts/${id}`, 
        updatePayload
      );
      
      return validateApiResponse<Post>(updatedPost);
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Gönderi güncellenirken bir hata oluştu');
    }
  }

  /**
   * Gönderiyi sil
   * DELETE /posts/:id
   * 
   * Not: JSONPlaceholder fake delete yapar,
   * gerçek veritabanından silmez
   */
  static async deletePost(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new Error('Geçerli bir gönderi ID\'si gerekli');
      }

      await addLoadingDelay(300);
      
      await apiClient.delete(`/posts/${id}`);
      
      // Başarılı silme işlemi - log kaydı
      console.log(`Post ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(`${id} ID'li gönderi bulunamadı`);
      }
      
      throw new Error('Gönderi silinirken bir hata oluştu');
    }
  }

  /**
   * Gönderi başlığında arama yap
   * JSONPlaceholder bu özelliği desteklemediği için client-side filtreleme
   */
  static async searchPostsByTitle(searchTerm: string): Promise<Post[]> {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('Arama terimi en az 2 karakter olmalıdır');
      }

      const posts = await this.getAllPosts();
      const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
      
      return posts.filter(post => 
        post.title.toLowerCase().includes(lowercaseSearchTerm) ||
        post.body.toLowerCase().includes(lowercaseSearchTerm)
      );
    } catch (error) {
      console.error('Error searching posts:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Gönderi araması yapılırken bir hata oluştu');
    }
  }

  /**
   * Kullanıcıya göre gönderileri grupla
   * Analitik amaçlı - kullanıcı başına gönderi sayısı
   */
  static async getPostCountByUser(): Promise<Record<number, number>> {
    try {
      const posts = await this.getAllPosts();
      
      return posts.reduce((counts, post) => {
        counts[post.userId] = (counts[post.userId] || 0) + 1;
        return counts;
      }, {} as Record<number, number>);
    } catch (error) {
      console.error('Error getting post count by user:', error);
      throw new Error('Kullanıcı başına gönderi sayısı hesaplanırken hata oluştu');
    }
  }

  /**
   * Gönderi verilerini doğrulama helper'ı
   */
  static validatePostData(postData: Partial<CreatePostRequest>): string[] {
    const errors: string[] = [];
    
    if (postData.userId !== undefined && (!postData.userId || postData.userId <= 0)) {
      errors.push('Geçerli bir kullanıcı seçiniz');
    }
    
    if (postData.title !== undefined && !postData.title?.trim()) {
      errors.push('Başlık alanı boş olamaz');
    }
    
    if (postData.title && postData.title.trim().length < 5) {
      errors.push('Başlık en az 5 karakter olmalıdır');
    }
    
    if (postData.title && postData.title.length > 100) {
      errors.push('Başlık en fazla 100 karakter olabilir');
    }
    
    if (postData.body !== undefined && !postData.body?.trim()) {
      errors.push('İçerik alanı boş olamaz');
    }
    
    if (postData.body && postData.body.trim().length < 10) {
      errors.push('İçerik en az 10 karakter olmalıdır');
    }
    
    if (postData.body && postData.body.length > 1000) {
      errors.push('İçerik en fazla 1000 karakter olabilir');
    }
    
    return errors;
  }
}