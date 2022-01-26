import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarScrumMasterComponent } from './navbar-scrum-master.component';

describe('NavbarScrumMasterComponent', () => {
  let component: NavbarScrumMasterComponent;
  let fixture: ComponentFixture<NavbarScrumMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarScrumMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarScrumMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
