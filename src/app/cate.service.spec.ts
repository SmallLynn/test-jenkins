import { TestBed } from '@angular/core/testing';

import { CateService } from './cate.service';

describe('CateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CateService = TestBed.get(CateService);
    expect(service).toBeTruthy();
  });
});
