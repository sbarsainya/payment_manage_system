import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PaymentCreateRequest} from "../model";
import {PaymentService} from "../payment.service";
import { DatePipe } from '@angular/common';
import {Router} from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.css'],
  providers: [DatePipe]
})
export class CreatePaymentComponent implements OnInit {
  createPaymentForm: FormGroup;
  readonly today = new Date();
  constructor(private fb: FormBuilder,
              private paymentService: PaymentService,
              private datePipe: DatePipe,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.createPaymentForm = this.fb.group({
      payee_first_name: ['', Validators.required],
      payee_last_name: ['', Validators.required],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: ['', Validators.required],
      payee_address_line_2: [''],
      payee_city: ['', Validators.required],
      payee_country: ['', Validators.required],
      payee_province_or_state: [''],
      payee_postal_code: ['', Validators.required],
      payee_phone_number: ['', Validators.required],
      payee_email: ['', [Validators.required, Validators.email]],
      currency: ['', Validators.required],
      discount_percent: [null, [Validators.min(0), Validators.max(100)]],
      tax_percent: [null, [Validators.min(0), Validators.max(100)]],
      due_amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.createPaymentForm.valid) {
      const formValues = this.createPaymentForm.value;
      formValues.payee_due_date = this.datePipe.transform(formValues.payee_due_date, 'yyyy-MM-dd');
      const paymentDetails: PaymentCreateRequest = formValues;
      this.paymentService.createPayment(paymentDetails).subscribe(response => {
        this.snackBar.open('Payment created successfully!', 'Close', {
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
          this.snackBar.open('Error creating payment', 'Close', {
            duration: 5000, verticalPosition: 'top', horizontalPosition: 'right'
          });
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
