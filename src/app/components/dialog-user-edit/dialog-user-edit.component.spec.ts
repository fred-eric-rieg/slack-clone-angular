import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserEditComponent } from './dialog-user-edit.component';

describe('DialogUserEditComponent', () => {
  let component: DialogUserEditComponent;
  let fixture: ComponentFixture<DialogUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUserEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
