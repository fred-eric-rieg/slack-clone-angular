import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMessagesSectionComponent } from './direct-messages-section.component';

describe('DirectMessagesSectionComponent', () => {
  let component: DirectMessagesSectionComponent;
  let fixture: ComponentFixture<DirectMessagesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectMessagesSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectMessagesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
