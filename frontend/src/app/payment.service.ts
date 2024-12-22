import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Payment, PaymentSearchCriteria} from "./model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly API_URL:string = 'http://localhost:8000';

  constructor(private httpClient: HttpClient) { }

  getPayments(searchCriteria: PaymentSearchCriteria): Observable<Payment[]> {
    return this.httpClient.post<Payment[]>(`${this.API_URL}/payments/list/`, searchCriteria);
  }

  downloadEvidence(paymentId: string): Observable<{ blob: Blob, mimeType: string, filename: string }> {
    return this.httpClient.get(`${this.API_URL}/payments/${paymentId}/evidence`, { observe: 'response', responseType: 'blob' })
      .pipe(map(response => {
        const mimeType = response.headers.get('Content-Type') || 'application/octet-stream';
        const contentDisposition = response.headers.get('Content-Disposition') || '';
        const filename = contentDisposition.split('filename=')[1]?.split(';')[0]?.replace(/"/g, '') || `evidence_${paymentId}`;
        return { blob: response.body as Blob, mimeType, filename };
      }));
  }

  getPayment(paymentId: string): Observable<Payment> {
    return this.httpClient.get<Payment>(`${this.API_URL}/payments/${paymentId}`);
  }

  uploadEvidence(paymentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.API_URL}/payments/${paymentId}/evidence`, formData);
  }
}
