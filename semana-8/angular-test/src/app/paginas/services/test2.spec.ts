import { TestBed } from '@angular/core/testing';
import { Test2 } from './test2';

describe('Test2', () => {
  let service: Test2;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Test2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
