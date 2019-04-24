import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {CustomFormsModule} from 'ng2-validation';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RoomsDialogComponent } from './dashboard/rooms-dialog/rooms-dialog.component';
import { AddRoomComponent } from './dashboard/rooms-dialog/add-room/add-room.component';
import { SettingsComponent } from './settings/settings.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ShowUsersComponent } from './settings/show-users/show-users.component';
import { AdminService } from './services/admin.service';
import { ChangeRoleComponent } from './settings/show-users/change-role/change-role.component';

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
    DashboardComponent,
    RoomsDialogComponent,
    AddRoomComponent,
    SettingsComponent,
    ChangePasswordComponent,
    ShowUsersComponent,
    ChangeRoleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
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
    MatDatepickerModule,
    AdminService
  ],
  bootstrap: [AppComponent],
  entryComponents: [RoomsDialogComponent, AddRoomComponent, ChangePasswordComponent, ChangeRoleComponent]
})
export class AppModule { }
