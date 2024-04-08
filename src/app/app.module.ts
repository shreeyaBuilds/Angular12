import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { Compare2variablesDirective } from './validations/compare2variables.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { fakeBackendProvider } from './_helpers/fake-backend';
// import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AlertComponent } from './components/alert/alert.component';
import { UnauthorisedComponent } from './components/unauthorised/unauthorised.component';
import { ErrorComponent } from './components/error/error.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SearchPipe } from './shared/search.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ViewUpdateProfileComponent } from './components/view-update-profile/view-update-profile.component';
import { AddUpdateAddressComponent } from './components/add-update-address/add-update-address.component';
import { AddUpdatenoOfPaymentsComponent } from './components/add-update-payment-details/add-update-payment-details.component';
import { BankComponent } from './components/bank/bank.component';
import { CardComponent } from './components/card/card.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { TrackComponent } from './components/track/track.component';
//import { modal } from 'ngx-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    AlertComponent,
    Compare2variablesDirective,
    UnauthorisedComponent,
    ErrorComponent,
    ForgotPasswordComponent,
    SearchPipe,
    FooterComponent,
    AddToCartComponent,
    PlaceOrderComponent,
    SettingsComponent,
    ViewUpdateProfileComponent,
    AddUpdateAddressComponent,
    AddUpdatenoOfPaymentsComponent,
    BankComponent,
    CardComponent,
    QrcodeComponent,
    TrackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
