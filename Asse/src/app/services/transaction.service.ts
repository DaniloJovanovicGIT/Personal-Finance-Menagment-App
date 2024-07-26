import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction, TransactionsResponse } from '../../types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<TransactionsResponse | null>(null);
  transactions$ = this.transactionsSubject.asObservable();

  private apiUrl = 'http://127.0.0.1:4010/transactions?page=728&page-size=309&sort-by=dolor&sort-order=asc';

  constructor(private http: HttpClient) { }

  fetchTransactions(filters: any): Observable<TransactionsResponse> {

    return this.http.get<TransactionsResponse>(this.apiUrl).pipe(
      tap((response: TransactionsResponse) => this.updateTransactions(response)),
      catchError((error) => {
        console.error('Error in fetchTransactions:', error);
        return throwError(() => new Error('Error fetching transactions'));
      })
    );
  }

  updateTransactions(transactions: TransactionsResponse): void {
    this.transactionsSubject.next(transactions);
  }
}
