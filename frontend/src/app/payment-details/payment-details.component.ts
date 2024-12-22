import {Component, OnInit} from '@angular/core';
import {PaymentService} from "../payment.service";
import {Payment, PaymentStatusEnum} from "../model";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../common.service";

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
})
export class PaymentDetailsComponent implements OnInit {
  payment!: Payment;
  selectedFile!: File;

  constructor(private route: ActivatedRoute,
              private paymentService: PaymentService,
              private router: Router,
              private commonService: CommonService) { }

  ngOnInit() {
    const paymentId = this.route.snapshot.paramMap.get('id');
    if (paymentId) {
      this.paymentService.getPayment(paymentId).subscribe(payment => {
        this.payment = payment;
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  isCompleted():boolean {
    return this.payment.payee_payment_status === PaymentStatusEnum.Completed;
  }

  uploadEvidence() {
    if (this.selectedFile) {
      this.paymentService.uploadEvidence(this.payment._id, this.selectedFile).subscribe(response => {
        this.paymentService.getPayment(this.payment._id).subscribe(payment => {
          this.payment = payment;
        });
      }, error => {
        console.error('File upload failed', error);
      });
    }
  }

  onFileSelected($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.selectedFile = (target.files as FileList)[0];
  }

  downloadEvidence() {
    this.paymentService.downloadEvidence(this.payment._id).subscribe(response => {
      this.commonService.downloadFile(response.blob, response.filename, response.mimeType);
    });
  }
}
