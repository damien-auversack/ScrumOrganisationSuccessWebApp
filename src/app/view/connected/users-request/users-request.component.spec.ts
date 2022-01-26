import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRequestComponent } from './users-request.component';

describe('UsersRequestComponent', () => {
  let component: UsersRequestComponent;
  let fixture: ComponentFixture<UsersRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
