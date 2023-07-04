import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMessageChannelComponent } from './direct-message-channel.component';

describe('DirectMessageChannelComponent', () => {
  let component: DirectMessageChannelComponent;
  let fixture: ComponentFixture<DirectMessageChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectMessageChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectMessageChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
