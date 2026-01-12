import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { SupabaseService, Service, Feedback } from '../../services/supabase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTabsModule,
    MatChipsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  serviceForm!: FormGroup;
  services: Service[] = [];
  feedbacks: Feedback[] = [];
  displayedColumns: string[] = ['photo', 'title', 'description', 'price', 'active', 'actions'];
  feedbackColumns: string[] = ['client', 'text', 'rating', 'status', 'date', 'actions'];
  
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  isLoading = false;
  isLoadingFeedbacks = false;
  editingServiceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadServices();
    this.loadFeedbacks();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.supabaseService.signOut();
      this.showMessage('Logout realizado com sucesso!', 'success');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      this.showMessage('Erro ao fazer logout', 'error');
    }
  }

  /**
   * Initialize the reactive form with validations
   */
  private initForm(): void {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  /**
   * Load all services from database
   */
  async loadServices(): Promise<void> {
    this.isLoading = true;
    try {
      this.services = await this.supabaseService.getAllServices();
    } catch (error) {
      this.showMessage('Erro ao carregar serviços', 'error');
      console.error('Load services error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Handle file selection and create preview
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.showMessage('Formato inválido. Use JPG, PNG ou WEBP', 'error');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.showMessage('Arquivo muito grande. Máximo 5MB', 'error');
      return;
    }

    this.selectedFile = file;

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Submit form - Upload image first, then save service data
   */
  async onSubmit(): Promise<void> {
    if (this.serviceForm.invalid) {
      this.showMessage('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    this.isSubmitting = true;

    try {
      let photoUrl: string | undefined = undefined;

      // Step 1: Upload image if selected
      if (this.selectedFile) {
        photoUrl = await this.supabaseService.uploadServiceImage(this.selectedFile);
      }

      // Step 2: Prepare service data
      const serviceData: Service = {
        title: this.serviceForm.value.title,
        description: this.serviceForm.value.description,
        price: parseFloat(this.serviceForm.value.price),
        photo_url: photoUrl,
        active: true
      };

      // Step 3: Save to database (add or update)
      if (this.editingServiceId) {
        await this.supabaseService.updateService(this.editingServiceId, serviceData);
        this.showMessage('Serviço atualizado com sucesso!', 'success');
      } else {
        await this.supabaseService.addService(serviceData);
        this.showMessage('Serviço adicionado com sucesso!', 'success');
      }

      // Step 4: Reload services and reset form
      await this.loadServices();
      this.resetForm();

    } catch (error) {
      this.showMessage('Erro ao salvar serviço', 'error');
      console.error('Submit error:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Edit existing service
   */
  editService(service: Service): void {
    this.editingServiceId = service.id || null;
    this.serviceForm.patchValue({
      title: service.title,
      description: service.description,
      price: service.price
    });

    // Show existing image preview
    if (service.photo_url) {
      this.imagePreview = service.photo_url;
    }

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Delete service (hard delete)
   */
  async deleteService(service: Service): Promise<void> {
    if (!confirm(`Tem certeza que deseja deletar "${service.title}"?`)) {
      return;
    }

    try {
      await this.supabaseService.deleteService(service.id!, true);
      this.showMessage('Serviço deletado com sucesso!', 'success');
      await this.loadServices();
    } catch (error) {
      this.showMessage('Erro ao deletar serviço', 'error');
      console.error('Delete error:', error);
    }
  }

  /**
   * Toggle service active status
   */
  async toggleServiceStatus(service: Service): Promise<void> {
    try {
      await this.supabaseService.updateService(service.id!, { 
        active: !service.active 
      });
      service.active = !service.active;
      this.showMessage(
        service.active ? 'Serviço ativado' : 'Serviço desativado',
        'success'
      );
    } catch (error) {
      this.showMessage('Erro ao atualizar status', 'error');
      console.error('Toggle status error:', error);
    }
  }

  /**
   * Reset form and clear state
   */
  resetForm(): void {
    this.serviceForm.reset({
      title: '',
      description: '',
      price: 0
    });
    this.selectedFile = null;
    this.imagePreview = null;
    this.editingServiceId = null;
  }

  /**
   * Format price to Brazilian currency
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  /**
   * Load all feedbacks (including pending)
   */
  async loadFeedbacks(): Promise<void> {
    this.isLoadingFeedbacks = true;
    try {
      this.feedbacks = await this.supabaseService.getAllFeedbacks();
    } catch (error) {
      this.showMessage('Erro ao carregar avaliações', 'error');
      console.error('Load feedbacks error:', error);
    } finally {
      this.isLoadingFeedbacks = false;
    }
  }

  /**
   * Approve or reject feedback
   */
  async approveFeedback(feedback: Feedback, approved: boolean): Promise<void> {
    try {
      await this.supabaseService.approveFeedback(feedback.id!, approved);
      feedback.is_approved = approved;
      this.showMessage(
        approved ? 'Avaliação aprovada!' : 'Avaliação rejeitada',
        'success'
      );
    } catch (error) {
      this.showMessage('Erro ao processar avaliação', 'error');
      console.error('Approve feedback error:', error);
    }
  }

  /**
   * Delete feedback
   */
  async deleteFeedback(feedback: Feedback): Promise<void> {
    if (!confirm(`Tem certeza que deseja deletar a avaliação de "${feedback.client_name}"?`)) {
      return;
    }

    try {
      await this.supabaseService.deleteFeedback(feedback.id!);
      this.showMessage('Avaliação deletada com sucesso!', 'success');
      await this.loadFeedbacks();
    } catch (error) {
      this.showMessage('Erro ao deletar avaliação', 'error');
      console.error('Delete feedback error:', error);
    }
  }

  /**
   * Get star rating display
   */
  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  /**
   * Format date to Brazilian format
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Show snackbar message
   */
  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
