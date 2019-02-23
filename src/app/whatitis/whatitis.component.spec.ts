import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatitisComponent } from './whatitis.component';

describe('WhatitisComponent', () => {
  let component: WhatitisComponent;
  let fixture: ComponentFixture<WhatitisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatitisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatitisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
