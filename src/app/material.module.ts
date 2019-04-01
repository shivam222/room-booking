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
  MatDividerModule
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
    MatDividerModule
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
     MatDividerModule
  ]
})

export class MaterialModule {
}
