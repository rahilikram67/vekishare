import { TestBed } from '@angular/core/testing';

import { LoadingAlertService } from './loading-alert.service';

describe('LoadingAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingAlertService = TestBed.get(LoadingAlertService);
    expect(service).toBeTruthy();
  });
});
