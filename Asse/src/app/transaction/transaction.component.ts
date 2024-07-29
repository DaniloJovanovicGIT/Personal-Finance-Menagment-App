import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../types/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {
  @Input() transaction: Transaction | null = null;
  @Input() openCategoryModal!: (transactionId: string) => void;
  @Input() isSelecting: boolean = false;
  @Input() isSelected: boolean = false;
  @Output() transactionSelected = new EventEmitter<string>();

  toggleSelection(): void {
    this.transactionSelected.emit(this.transaction?.id);
  }

  directionIcon: any;
}
