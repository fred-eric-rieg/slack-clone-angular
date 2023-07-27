import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelThreadsComponent } from './channel-threads.component';

describe('ChannelThreadsComponent', () => {
  let component: ChannelThreadsComponent;
  let fixture: ComponentFixture<ChannelThreadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelThreadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelThreadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
