import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarProductOwnerComponent } from './navbar-product-owner.component';

describe('NavbarProductOwnerComponent', () => {
  let component: NavbarProductOwnerComponent;
  let fixture: ComponentFixture<NavbarProductOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarProductOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarProductOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
