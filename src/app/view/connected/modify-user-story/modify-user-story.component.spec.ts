import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyUserStoryComponent } from './modify-user-story.component';

describe('ModifyUserStoryComponent', () => {
  let component: ModifyUserStoryComponent;
  let fixture: ComponentFixture<ModifyUserStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyUserStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyUserStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
