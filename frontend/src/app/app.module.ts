import { NgModule } from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AppComponent } from './app.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { AppRoutingModule } from './app-routing.module';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
@NgModule({
  declarations: [
    AppComponent,
    PaymentListComponent,
    PaymentDetailsComponent,
    EditPaymentComponent,
    CreatePaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    MatDividerModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
