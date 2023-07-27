import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelUsersComponent } from './channel-users.component';

describe('ChannelUsersComponent', () => {
  let component: ChannelUsersComponent;
  let fixture: ComponentFixture<ChannelUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
