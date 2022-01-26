import { TestBed } from '@angular/core/testing';

import { UsersTechnologiesService } from './users-technologies.service';

describe('UsersTechnologiesService', () => {
  let service: UsersTechnologiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersTechnologiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
