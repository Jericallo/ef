import { TestBed } from '@angular/core/testing';

import { MousePositionService } from './mouse-position.service';

describe('MousePositionService', () => {
  let service: MousePositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MousePositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
