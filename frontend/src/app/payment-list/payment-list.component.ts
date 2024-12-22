import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PaymentService} from '../payment.service';
import {Payment, PaymentStatusEnum} from '../model';
import {Router} from "@angular/router";
import {CommonService} from "../common.service";

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private paymentService: PaymentService,
              private router: Router,
              private commonService: CommonService) { }

  ngOnInit() {
    this.paymentService.getPayments({}).subscribe(payments => {
      this.dataSource = new MatTableDataSource(payments);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDownloadEvidence(element: Payment) {
    this.paymentService.downloadEvidence(element._id).subscribe(response => {
      this.commonService.downloadFile(response.blob, response.filename, response.mimeType);
    });
  }

  onEdit(element: Payment) {

  }

  isCompleted(element: Payment) {
    return element.payee_payment_status === PaymentStatusEnum.Completed;
  }

  onDetails(element: Payment) {
    this.router.navigate(['/payment-details', element._id]);
  }
}
