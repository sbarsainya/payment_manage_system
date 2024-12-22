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
import {HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withFetch} from "@angular/common/http";
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDateFormats, MAT_DATE_FORMATS, MatOptionModule} from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from "@angular/material/select";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {NgrokWarningInterceptor} from "./ngrok_warning_interceptor";

const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'YYYY MMMM',
  },
};

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
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NgrokWarningInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
