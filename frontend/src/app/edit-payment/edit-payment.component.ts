import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../payment.service';
import {CommonService} from "../common.service";
import {PaymentUpdateRequest} from "../model";
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css'],
  providers: [DatePipe]
})
export class EditPaymentComponent implements OnInit {
  editPaymentForm!: FormGroup;
  paymentId!: string;
  readonly today = new Date();
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id')!;
    this.editPaymentForm = this.fb.group({
      payee_first_name: [{ value: '', disabled: true }],
      payee_last_name: [{ value: '', disabled: true }],
      payee_payment_status: [{ value: '', disabled: true }],
      payee_added_date_utc: [{ value: '', disabled: true }],
      payee_due_date: ['', [Validators.required, this.commonService.futureDateValidator]],
      payee_address_line_1: [{ value: '', disabled: true }],
      payee_address_line_2: [{ value: '', disabled: true }],
      payee_city: [{ value: '', disabled: true }],
      payee_country: [{ value: '', disabled: true }],
      payee_province_or_state: [{ value: '', disabled: true }],
      payee_postal_code: [{ value: '', disabled: true }],
      payee_phone_number: [{ value: '', disabled: true }],
      payee_email: [{ value: '', disabled: true }],
      currency: [{ value: '', disabled: true }],
      discount_percent: [{ value: '', disabled: true }],
      tax_percent: [{ value: '', disabled: true }],
      due_amount: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      total_due: [{ value: '', disabled: true }],
    });

    this.loadPaymentData();
  }

  loadPaymentData(): void {
    this.paymentService.getPaymentById(this.paymentId).subscribe(payment => {
      this.editPaymentForm.patchValue(payment);
    });
  }
  goBack() {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.editPaymentForm.valid) {
      const formValues = this.editPaymentForm.value;
      formValues.payee_due_date = this.datePipe.transform(formValues.payee_due_date, 'yyyy-MM-dd');
      const paymentDetails: PaymentUpdateRequest = formValues;
      this.paymentService.updatePayment(this.paymentId, paymentDetails).subscribe(response => {
        this.snackBar.open('Payment updated successfully!', 'Close', {
          duration: 5000, verticalPosition: 'top', horizontalPosition: 'right'
        });
        this.router.navigate(['/']);
      }, error => {
        if (error.error && error.error.detail) {
          const errorMessage = error.error.detail.map((err: any) => err.loc[1] +" "+ err.msg).join(' \n ');
          this.snackBar.open(errorMessage, 'Close', {
            verticalPosition: 'top', horizontalPosition: 'right'
          });
        } else {
          this.snackBar.open('Error updating payment', 'Close', {
            duration: 5000, verticalPosition: 'top', horizontalPosition: 'right'
          });
        }
      });
    }
  }
}
