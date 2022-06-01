import { TestBed } from '@angular/core/testing';

import { PagemodalService } from './pagemodal.service';

describe('PagemodalService', () => {
  let service: PagemodalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagemodalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
