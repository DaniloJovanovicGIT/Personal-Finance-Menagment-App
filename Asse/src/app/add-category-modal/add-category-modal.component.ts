import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService } from '../services/categories.service';
import { Category } from '../../types/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AddCategoryModalComponent implements OnInit {
  @Input() transactionIds: string[] = [];
  @Output() categoryAdded = new EventEmitter<{ categoryCode: string; subCategoryCode: string | null }>();
  @Output() closeModal = new EventEmitter<void>();

  allCategories: Category[] = [];
  mainCategories: Category[] = [];
  subCategories: Category[] = [];
  selectedMainCategory: string | null = null;
  selectedSubCategory: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.fetchCategories({}).subscribe({
      next: (response) => {
        this.allCategories = response.items;
        this.mainCategories = this.allCategories.filter(category => !category['parent-code']);
      },
      error: (error) => {
        console.error('Error loading categories', error);
      }
    });
  }

  updateSubCategories(): void {
    if (this.selectedMainCategory) {
      this.subCategories = this.allCategories.filter(category => category['parent-code'] === this.selectedMainCategory);
      if (!this.subCategories.find(sub => sub.code === this.selectedSubCategory)) {
        this.selectedSubCategory = null;
      }
    } else {
      this.subCategories = [];
      this.selectedSubCategory = null;
    }
  }

  addCategory(): void {
    if (this.selectedMainCategory) {
      this.categoryAdded.emit({ 
        categoryCode: this.selectedSubCategory || this.selectedMainCategory, 
        subCategoryCode: this.selectedSubCategory 
      });
      this.onCloseModal();
    }
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }
}
