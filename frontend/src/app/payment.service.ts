import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Payment, PaymentCreateRequest, PaymentSearchCriteria, PaymentUpdateRequest} from "./model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly API_URL:string = 'https://10c4-223-233-86-20.ngrok-free.app';

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

  getPaymentById(paymentId: string): Observable<Payment> {
    return this.httpClient.get<Payment>(`${this.API_URL}/payments/${paymentId}`);
  }

  uploadEvidence(paymentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.API_URL}/payments/${paymentId}/evidence`, formData);
  }

  createPayment(payment: PaymentCreateRequest): Observable<Payment> {
    return this.httpClient.post<Payment>(`${this.API_URL}/payments/`, payment);
  };

  updatePayment(paymentId: string, payment: PaymentUpdateRequest): Observable<Payment> {
    return this.httpClient.put<Payment>(`${this.API_URL}/payments/${paymentId}`, payment);
  }
}
