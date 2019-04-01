import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsDialogComponent } from './rooms-dialog.component';

describe('RoomsDialogComponent', () => {
  let component: RoomsDialogComponent;
  let fixture: ComponentFixture<RoomsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
