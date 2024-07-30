import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService } from '../services/categories.service';
import { Category, CategoriesResponse, Split } from '../../types/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SplitData {
  selectedMainCategory: string | null;
  selectedSubCategory: string | null;
  subCategories: Category[];
  amount: number;
}

@Component({
  standalone: true,
  selector: 'app-add-split-modal',
  templateUrl: './add-split-modal.component.html',
  styleUrls: ['./add-split-modal.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AddSplitModalComponent implements OnInit {
  @Input() transactionId: string | null = null;
  @Input() transactionAmount: number = 0;
  @Output() splitAdded: EventEmitter<Split[]> = new EventEmitter<Split[]>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  mainCategories: Category[] = [];
  splits: SplitData[] = [
    {
      selectedMainCategory: null,
      selectedSubCategory: null,
      subCategories: [],
      amount: 0
    },
    {
      selectedMainCategory: null,
      selectedSubCategory: null,
      subCategories: [],
      amount: 0
    }
  ];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadMainCategories();
  }

  loadMainCategories(): void {
    this.categoryService.fetchCategories({}).subscribe({
      next: (response: CategoriesResponse) => {
        this.mainCategories = response.items;
      },
      error: (error: any) => {
        console.error('Error loading categories', error);
      }
    });
  }

  updateSubCategories(index: number): void {
    const selectedMainCategory = this.splits[index].selectedMainCategory;
    if (selectedMainCategory) {
      this.categoryService.fetchCategories(selectedMainCategory).subscribe({
        next: (response: CategoriesResponse) => {
          this.splits[index].subCategories = response.items;
        },
        error: (error: any) => {
          console.error('Error loading subcategories', error);
        }
      });
    }
  }

  addSplit(): void {
    this.splits.push({
      selectedMainCategory: null,
      selectedSubCategory: null,
      subCategories: [],
      amount: 0
    });
  }

  removeSplit(index: number): void {
    if (this.splits.length > 1) {
      this.splits.splice(index, 1);
    }
  }

  applySplits(): void {
    const totalAmount = this.splits.reduce((sum, split) => sum + split.amount, 0);

    if (totalAmount !== this.transactionAmount) {
      alert('The sum of all split amounts must equal the transaction amount.');
      return;
    }

    for (const split of this.splits) {
      if (!split.selectedMainCategory && !split.selectedSubCategory) {
        alert('Each split must have a selected category or subcategory.');
        return;
      }
    }

    const validSplits = this.splits.map(split => ({
      catcode: split.selectedSubCategory ? split.selectedSubCategory : (split.selectedMainCategory || ''),
      amount: split.amount
    }));

    this.splitAdded.emit(validSplits);
    this.onCloseModal();
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }
}
