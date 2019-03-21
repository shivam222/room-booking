import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WhatitisComponent } from './whatitis/whatitis.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './signup/signup.component';
import { CreateAccountService } from './services/create-account.service';
import { SignupService } from './services/signup.service';
import { BasicApisService } from './services/basic-apis.service';
import { LoginService } from './services/login.service';
import { AuthguardService } from './services/authguard.service';
import { OrgRegisterComponent } from './org-register/org-register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordService } from './services/forgot-password.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReverseAuthGuardService } from './services/reverse-auth-guard.service';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WhatitisComponent,
    HowitworksComponent,
    HeaderComponent,
    SignupComponent,
    OrgRegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [
    CreateAccountService,
    SignupService,
    BasicApisService,
    LoginService,
    AuthguardService,
    ForgotPasswordService,
    ReverseAuthGuardService,
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
