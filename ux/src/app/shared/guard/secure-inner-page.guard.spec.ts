import { TestBed } from '@angular/core/testing';

import { SecureInnerPageGuard } from './secure-inner-page.guard';

describe('SecureInnerPageGuard', () => {
  let guard: SecureInnerPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SecureInnerPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
