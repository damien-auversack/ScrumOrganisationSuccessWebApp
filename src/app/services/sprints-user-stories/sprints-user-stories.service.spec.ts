import { TestBed } from '@angular/core/testing';

import { SprintsUserStoriesService } from './sprints-user-stories.service';

describe('SprintsUserStoriesService', () => {
  let service: SprintsUserStoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SprintsUserStoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
