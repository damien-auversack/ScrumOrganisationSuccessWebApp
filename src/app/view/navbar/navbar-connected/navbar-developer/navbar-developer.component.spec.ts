import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDeveloperComponent } from './navbar-developer.component';

describe('NavbarDeveloperComponent', () => {
  let component: NavbarDeveloperComponent;
  let fixture: ComponentFixture<NavbarDeveloperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarDeveloperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
