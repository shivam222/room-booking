import { NgModule } from '@angular/core';
import {
  MatBadgeModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatTabsModule,
  MatGridListModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatRadioModule,
  MatDividerModule,
  MatMenuModule,
  MatCheckboxModule
} from '@angular/material';


@NgModule({
  imports: [
    MatBadgeModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  exports: [
     MatBadgeModule,
     MatSidenavModule,
     MatToolbarModule,
     MatIconModule,
     MatListModule,
     MatTabsModule,
     MatButtonModule,
     MatGridListModule,
     MatCardModule,
     MatFormFieldModule,
     MatInputModule,
     MatDatepickerModule,
     MatNativeDateModule,
     MatDialogModule,
     MatRadioModule,
     MatDividerModule,
     MatMenuModule,
     MatCheckboxModule
  ]
})

export class MaterialModule {
}
