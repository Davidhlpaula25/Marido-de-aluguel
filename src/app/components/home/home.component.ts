import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupabaseService, Service, Feedback } from '../../services/supabase.service';
import { FeedbackDialogComponent } from './feedback-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  services: Service[] = [];
  feedbacks: Feedback[] = [];
  isLoading = true;

  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.isLoading = true;
      
      // Load active services and approved feedbacks
      const [servicesData, feedbacksData] = await Promise.all([
        this.supabaseService.getServices(),
        this.supabaseService.getFeedbacks()
      ]);

      this.services = servicesData;
      this.feedbacks = feedbacksData;
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Fallback: Show sample data if Supabase is not configured
      this.services = [
        {
          id: 1,
          title: 'Instalação Elétrica',
          description: 'Troca de chuveiros, tomadas, disjuntores e instalação de luminárias.',
          price: 120.00,
          active: true
        },
        {
          id: 2,
          title: 'Hidráulica Simples',
          description: 'Reparo de vazamentos em pias, troca de torneiras e sifões.',
          price: 100.00,
          active: true
        },
        {
          id: 3,
          title: 'Montagem de Móveis',
          description: 'Montagem e desmontagem de guarda-roupas, armários e estantes.',
          price: 80.00,
          active: true
        }
      ];
      
      this.feedbacks = [
        {
          id: 1,
          client_name: 'Maria Silva',
          text: 'O serviço foi excelente, montou meu guarda-roupa super rápido e deixou tudo limpo.',
          rating: 5,
          is_approved: true
        },
        {
          id: 2,
          client_name: 'João Paulo',
          text: 'Ótimo profissional, resolveu o vazamento da pia que ninguém conseguia.',
          rating: 4,
          is_approved: true
        }
      ];
    } finally {
      this.isLoading = false;
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  openWhatsApp(service: Service): void {
    const message = encodeURIComponent(
      `Olá! Gostaria de saber mais sobre o serviço: ${service.title}`
    );
    const phone = '5511999999999'; // Substituir pelo seu número
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }

  openFeedbackDialog(): void {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.supabaseService.addFeedback(result);
          
          this.snackBar.open(
            '✅ Avaliação enviada com sucesso! Ela será exibida após aprovação.',
            'OK',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            }
          );
        } catch (error) {
          console.error('Error submitting feedback:', error);
          
          this.snackBar.open(
            '❌ Erro ao enviar avaliação. Tente novamente.',
            'OK',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            }
          );
        }
      }
    });
  }
}

