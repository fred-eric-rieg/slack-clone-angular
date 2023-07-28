import { DirectMessageChannelComponent } from './../direct-message-channel/direct-message-channel.component';
import { ChannelComponent } from './../channel/channel.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';


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
