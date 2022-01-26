import { TestBed } from '@angular/core/testing';

import { UserStoriesService } from './user-stories.service';

describe('UserStoriesService', () => {
  let service: UserStoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
