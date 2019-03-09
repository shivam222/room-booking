import { TestBed } from '@angular/core/testing';

import { BasicApisService } from './basic-apis.service';

describe('BasicApisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicApisService = TestBed.get(BasicApisService);
    expect(service).toBeTruthy();
  });
});
