import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
import { AddUpdateAddressComponent } from './components/add-update-address/add-update-address.component';
import { AddUpdatenoOfPaymentsComponent } from './components/add-update-payment-details/add-update-payment-details.component';
import { BankComponent } from './components/bank/bank.component';
import { CardComponent } from './components/card/card.component';
import { ErrorComponent } from './components/error/error.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TrackComponent } from './components/track/track.component';
import { ViewUpdateProfileComponent } from './components/view-update-profile/view-update-profile.component';
import { RegistrationGuard, AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  { path: '', component: RegistrationComponent, canActivate: [RegistrationGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'passwordreset', component: ForgotPasswordComponent },
  {
    path: 'settings', component: SettingsComponent, children: [
      { path: 'profile', component: ViewUpdateProfileComponent },
      { path: 'address', component: AddUpdateAddressComponent },
      { path: 'payment', component: AddUpdatenoOfPaymentsComponent }]
  },
  { path: 'cart', component: AddToCartComponent },
  {
    path: 'placeOrder', component: PlaceOrderComponent, children: [
      { path: 'bank', component: BankComponent },
      { path: 'card', component: CardComponent },
      { path: 'qrcode', component: QrcodeComponent }]
  },
  {
    path:'track' , component:TrackComponent
  },
  { path: '**', component: ErrorComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
