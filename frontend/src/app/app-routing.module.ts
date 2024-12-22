import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PaymentListComponent} from "./payment-list/payment-list.component";
import {PaymentDetailsComponent} from "./payment-details/payment-details.component";

const routes: Routes = [
  { path: 'payment-details/:id', component: PaymentDetailsComponent },
  { path: '', component: PaymentListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
