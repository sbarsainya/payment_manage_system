import {Component, OnInit} from '@angular/core';
import {PaymentService} from "../payment.service";
import {Payment, PaymentStatusEnum} from "../model";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../common.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
              private commonService: CommonService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    const paymentId = this.route.snapshot.paramMap.get('id');
    if (paymentId) {
      this.paymentService.getPaymentById(paymentId).subscribe(payment => {
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
        this.paymentService.getPaymentById(this.payment._id).subscribe(payment => {
          this.snackBar.open('Evidence uploaded successfully!', 'Close',
            { duration: 5000, verticalPosition: 'top', horizontalPosition: 'right'})
          this.payment = payment;
        });
      }, error => {
        this.snackBar.open('Evidence uploaded failed!', 'Close',
          { verticalPosition: 'top', horizontalPosition: 'right'})
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
