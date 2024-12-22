import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PaymentService} from '../payment.service';
import {Payment, PaymentSearchCriteria, PaymentStatusEnum} from '../model';
import {Router} from "@angular/router";
import {CommonService} from "../common.service";
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  displayedColumns: string[] = [
    '_id',
    'payee_first_name', 'payee_last_name', 'payee_payment_status',
    'payee_added_date_utc', 'payee_due_date',
    'due_amount', 'total_due', 'actions'
  ];
  dataSource!: MatTableDataSource<Payment>;
  searchForm: FormGroup;
  paymentStatuses = Object.values(PaymentStatusEnum); // Convert enum to array

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private paymentService: PaymentService,
              private router: Router,
              private commonService: CommonService,
              private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      payee_first_name: [''],
      payee_last_name: [''],
      payee_payment_status: [''],
      payee_address_line_1: [''],
      payee_address_line_2: [''],
      payee_city: [''],
      payee_country: [''],
      payee_province_or_state: [''],
      payee_postal_code: [''],
      payee_phone_number: [''],
      payee_email: [''],
      currency: ['']
    });
  }

  ngOnInit() {
    this.paymentService.getPayments({}).subscribe(payments => {
      this.dataSource = new MatTableDataSource(payments);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onDownloadEvidence(element: Payment) {
    this.paymentService.downloadEvidence(element._id).subscribe(response => {
      this.commonService.downloadFile(response.blob, response.filename, response.mimeType);
    });
  }

  onEdit(element: Payment) {
    this.router.navigate(['/edit-payment', element._id]);
  }

  isCompleted(element: Payment) {
    return element.payee_payment_status === PaymentStatusEnum.Completed;
  }

  onDetails(element: Payment) {
    this.router.navigate(['/payment-details', element._id]);
  }

  searchPayments() {
    const criteria = this.searchForm.value;
    const filteredCriteria: PaymentSearchCriteria = Object.keys(criteria)
      .filter(key => criteria[key] !== null && criteria[key] !== undefined && criteria[key] !== '')
      .reduce((obj: PaymentSearchCriteria, key) => {
        obj[key as keyof PaymentSearchCriteria] = criteria[key];
        return obj;
      }, {} as PaymentSearchCriteria);

    this.paymentService.getPayments(filteredCriteria).subscribe(payments => {
      this.dataSource = new MatTableDataSource(payments);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  navigateToCreatePayment() {
    this.router.navigate(['/create-payment']);
  }
}
