import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PaymentListComponent} from "./payment-list/payment-list.component";
import {PaymentDetailsComponent} from "./payment-details/payment-details.component";
import {EditPaymentComponent} from "./edit-payment/edit-payment.component";
import {CreatePaymentComponent} from "./create-payment/create-payment.component";

const routes: Routes = [
  { path: 'payment-details/:id', component: PaymentDetailsComponent },
  { path: 'edit-payment/:id', component: EditPaymentComponent },
  { path: 'create-payment', component: CreatePaymentComponent },
  { path: '', component: PaymentListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
