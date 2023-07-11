import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPictureEditComponent } from './dialog-picture-edit.component';

describe('DialogPictureEditComponent', () => {
  let component: DialogPictureEditComponent;
  let fixture: ComponentFixture<DialogPictureEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPictureEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPictureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
