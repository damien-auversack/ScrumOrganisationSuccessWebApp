import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintUserStoryComponent } from './sprint-user-story.component';

describe('SprintUserStoryComponent', () => {
  let component: SprintUserStoryComponent;
  let fixture: ComponentFixture<SprintUserStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprintUserStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintUserStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
