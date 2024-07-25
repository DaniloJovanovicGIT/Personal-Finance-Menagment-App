import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction, TransactionFilters } from '../../types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  private apiUrl = 'http://127.0.0.1:4010/transactions?page=509&page-size=874&sort-by=corporis&sort-order=desc'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  fetchTransactions(filters: any): Observable<Transaction[]> {
    

    return this.http.get<Transaction[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error in fetchTransactions:', error);
        throw error;
      })
    );
  }

  updateTransactions(transactions: Transaction[]): void {
    this.transactionsSubject.next(transactions);
  }
}
