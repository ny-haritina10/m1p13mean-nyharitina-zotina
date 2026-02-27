import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gallery-container">
      <div class="main-image">
        <img 
          [src]="currentImage || '/assets/images/placeholder.png'" 
          [alt]="imageAlt"
          (click)="onImageClick()"
          loading="lazy"
        />
        <div class="zoom-hint" *ngIf="images.length > 1">
          <span class="material-icons">zoom_in</span>
        </div>
      </div>
      
      <div class="thumbnails" *ngIf="images.length > 1">
        <button 
          *ngFor="let img of images; let i = index"
          class="thumbnail"
          [class.active]="i === currentIndex"
          (click)="selectImage(i)"
        >
          <img [src]="img" [alt]="imageAlt + ' - image ' + (i + 1)" loading="lazy" />
        </button>
      </div>
    </div>
  `,
  styles: [`
    .gallery-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .main-image {
      position: relative;
      aspect-ratio: 1;
      background: #f8f9fa;
      border-radius: 16px;
      overflow: hidden;
    }

    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      cursor: zoom-in;
      transition: transform 0.3s ease;
    }

    .main-image:hover img {
      transform: scale(1.05);
    }

    .zoom-hint {
      position: absolute;
      bottom: 16px;
      right: 16px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .zoom-hint .material-icons {
      font-size: 20px;
    }

    .thumbnails {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding: 4px;
    }

    .thumbnail {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border: 2px solid transparent;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      padding: 0;
      background: none;
      transition: all 0.2s ease;
    }

    .thumbnail:hover {
      border-color: #d1d5db;
    }

    .thumbnail.active {
      border-color: #2563eb;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 640px) {
      .thumbnail {
        width: 60px;
        height: 60px;
      }
    }
  `]
})
export class ImageGalleryComponent {
  @Input() images: string[] = [];
  @Input() imageAlt: string = 'Product image';
  @Output() imageClick = new EventEmitter<string>();

  currentIndex = 0;

  get currentImage(): string | null {
    return this.images.length > 0 ? this.images[this.currentIndex] : null;
  }

  selectImage(index: number): void {
    this.currentIndex = index;
  }

  onImageClick(): void {
    if (this.currentImage) {
      this.imageClick.emit(this.currentImage);
    }
  }
}
