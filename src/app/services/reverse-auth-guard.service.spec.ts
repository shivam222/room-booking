import { TestBed } from '@angular/core/testing';

import { ReverseAuthGuardService } from './reverse-auth-guard.service';

describe('ReverseAuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReverseAuthGuardService = TestBed.get(ReverseAuthGuardService);
    expect(service).toBeTruthy();
  });
});
