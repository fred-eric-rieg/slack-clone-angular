import { ComponentFixture, TestBed } from '@angular/core/testing';

import { sidenavComponent } from './sidenav.component';

describe('sidenavComponent', () => {
  let component: sidenavComponent;
  let fixture: ComponentFixture<sidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ sidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(sidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
