import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {CustomFormsModule} from 'ng2-validation';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WhatitisComponent } from './whatitis/whatitis.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './signup/signup.component';
import { CreateAccountService } from './services/create-account.service';
import { OrgRegisterComponent } from './org-register/org-register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WhatitisComponent,
    HowitworksComponent,
    HeaderComponent,
    SignupComponent,
    OrgRegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    CustomFormsModule,
    HttpModule
  ],
  providers: [
    CreateAccountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
