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
  MatInputModule
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
    MatInputModule
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
     MatInputModule
  ]
})

export class MaterialModule {
}
