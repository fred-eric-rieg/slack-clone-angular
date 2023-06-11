import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavProfileComponent } from './sidenav-profile.component';

describe('SidenavProfileComponent', () => {
  let component: SidenavProfileComponent;
  let fixture: ComponentFixture<SidenavProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
