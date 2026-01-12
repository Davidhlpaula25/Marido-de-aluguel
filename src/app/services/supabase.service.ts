import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Service {
  id?: number;
  title: string;
  description: string;
  price: number;
  photo_url?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Feedback {
  id?: number;
  client_name: string;
  text: string;
  rating: number;
  is_approved?: boolean;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly STORAGE_BUCKET = 'service-images';

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  /**
   * Upload service image to Supabase Storage
   * @param file - Image file to upload
   * @returns Public URL of the uploaded image
   */
  async uploadServiceImage(file: File): Promise<string> {
    try {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `service_${timestamp}.${fileExt}`;
      const filePath = `services/${fileName}`;

      // Upload file to storage bucket
      const { data, error } = await this.supabase.storage
        .from(this.STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Erro ao fazer upload: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Delete image from Supabase Storage
   * @param photoUrl - Full public URL of the image
   */
  async deleteServiceImage(photoUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const urlParts = photoUrl.split(`${this.STORAGE_BUCKET}/`);
      if (urlParts.length < 2) {
        throw new Error('URL inválida');
      }
      const filePath = urlParts[1];

      const { error } = await this.supabase.storage
        .from(this.STORAGE_BUCKET)
        .remove([filePath]);

      if (error) {
        throw new Error(`Erro ao deletar imagem: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete image error:', error);
      throw error;
    }
  }

  // ==========================================
  // SERVICES CRUD OPERATIONS
  // ==========================================

  /**
   * Get all active services
   */
  async getServices(): Promise<Service[]> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar serviços: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Get services error:', error);
      throw error;
    }
  }

  /**
   * Get all services including inactive (admin view)
   */
  async getAllServices(): Promise<Service[]> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar serviços: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Get all services error:', error);
      throw error;
    }
  }

  /**
   * Get service by ID
   */
  async getServiceById(id: number): Promise<Service | null> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar serviço: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Get service by ID error:', error);
      throw error;
    }
  }

  /**
   * Add new service
   */
  async addService(service: Service): Promise<Service> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao adicionar serviço: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Add service error:', error);
      throw error;
    }
  }

  /**
   * Update existing service
   */
  async updateService(id: number, updates: Partial<Service>): Promise<Service> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar serviço: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Update service error:', error);
      throw error;
    }
  }

  /**
   * Delete service (soft delete by setting active = false)
   */
  async deleteService(id: number, hardDelete: boolean = false): Promise<void> {
    try {
      if (hardDelete) {
        // Get service to delete its image
        const service = await this.getServiceById(id);
        
        // Delete from database
        const { error } = await this.supabase
          .from('services')
          .delete()
          .eq('id', id);

        if (error) {
          throw new Error(`Erro ao deletar serviço: ${error.message}`);
        }

        // Delete image from storage if exists
        if (service?.photo_url) {
          await this.deleteServiceImage(service.photo_url);
        }
      } else {
        // Soft delete
        await this.updateService(id, { active: false });
      }
    } catch (error) {
      console.error('Delete service error:', error);
      throw error;
    }
  }

  // ==========================================
  // FEEDBACKS CRUD OPERATIONS
  // ==========================================

  /**
   * Get all approved feedbacks
   */
  async getFeedbacks(): Promise<Feedback[]> {
    try {
      const { data, error } = await this.supabase
        .from('feedbacks')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar feedbacks: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Get feedbacks error:', error);
      throw error;
    }
  }

  /**
   * Get all feedbacks including pending (admin view)
   */
  async getAllFeedbacks(): Promise<Feedback[]> {
    try {
      const { data, error } = await this.supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar feedbacks: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Get all feedbacks error:', error);
      throw error;
    }
  }

  /**
   * Submit new feedback
   */
  async addFeedback(feedback: Feedback): Promise<Feedback> {
    try {
      const { data, error } = await this.supabase
        .from('feedbacks')
        .insert([feedback])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao enviar feedback: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Add feedback error:', error);
      throw error;
    }
  }

  /**
   * Approve feedback (admin only)
   */
  async approveFeedback(id: number, approved: boolean): Promise<Feedback> {
    try {
      const { data, error } = await this.supabase
        .from('feedbacks')
        .update({ is_approved: approved })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao aprovar feedback: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Approve feedback error:', error);
      throw error;
    }
  }

  /**
   * Delete feedback
   */
  async deleteFeedback(id: number): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('feedbacks')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erro ao deletar feedback: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete feedback error:', error);
      throw error;
    }
  }

  // ==========================================
  // AUTHENTICATION METHODS
  // ==========================================

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(`Erro ao fazer login: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        throw new Error(`Erro ao fazer logout: ${error.message}`);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user session
   */
  async getSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession();

      if (error) {
        throw new Error(`Erro ao buscar sessão: ${error.message}`);
      }

      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  }
}
