import { Component, Input } from '@angular/core';
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
  directionIcon: any;
}
