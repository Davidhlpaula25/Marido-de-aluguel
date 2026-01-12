import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <div class="feedback-dialog">
      <h2 mat-dialog-title>Avaliar Serviço</h2>
      
      <mat-dialog-content>
        <div class="rating-section">
          <p class="rating-label">Como foi sua experiência?</p>
          <div class="stars-container">
            <button 
              *ngFor="let star of [1,2,3,4,5]" 
              class="star-button"
              (click)="setRating(star)"
              type="button">
              <mat-icon [class.filled]="star <= rating">
                {{ star <= rating ? 'star' : 'star_border' }}
              </mat-icon>
            </button>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Seu nome</mat-label>
          <input matInput [(ngModel)]="clientName" placeholder="Digite seu nome">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Seu comentário</mat-label>
          <textarea 
            matInput 
            [(ngModel)]="feedbackText" 
            rows="4"
            placeholder="Conte-nos sobre sua experiência..."></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button 
          mat-raised-button 
          color="primary"
          (click)="onSubmit()"
          [disabled]="!isValid()">
          Enviar Avaliação
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .feedback-dialog {
      min-width: 400px;
      max-width: 500px;
    }

    h2 {
      color: #003366;
      margin: 0;
      padding-bottom: 16px;
    }

    mat-dialog-content {
      padding: 20px 24px;
    }

    .rating-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .rating-label {
      color: #666;
      font-size: 1rem;
      margin-bottom: 12px;
    }

    .stars-container {
      display: flex;
      justify-content: center;
      gap: 8px;
    }

    .star-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.2);
      }

      mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: #ddd;
        transition: color 0.2s ease;

        &.filled {
          color: #FFD700;
        }
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      gap: 8px;
    }

    @media (max-width: 600px) {
      .feedback-dialog {
        min-width: auto;
        width: 100%;
      }
    }
  `]
})
export class FeedbackDialogComponent {
  rating = 0;
  clientName = '';
  feedbackText = '';

  constructor(
    private dialogRef: MatDialogRef<FeedbackDialogComponent>
  ) {}

  setRating(star: number): void {
    this.rating = star;
  }

  isValid(): boolean {
    return this.rating > 0 && 
           this.clientName.trim().length > 0 && 
           this.feedbackText.trim().length > 0;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.isValid()) {
      this.dialogRef.close({
        rating: this.rating,
        client_name: this.clientName.trim(),
        text: this.feedbackText.trim()
      });
    }
  }
}
