import { TestBed } from '@angular/core/testing';

import { UsersProjectsService } from './users-projects.service';

describe('UsersProjectsService', () => {
  let service: UsersProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
