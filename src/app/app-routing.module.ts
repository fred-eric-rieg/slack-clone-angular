import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { sidenavComponent } from './components/sidenav/sidenav.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ChannelComponent } from './components/channels/channel/channel.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { DialogUserComponent } from './components/dialog-user/dialog-user.component';
import { DirectMessageChannelComponent } from './components/direct-messages/direct-message-channel/direct-message-channel.component';
import { NewChatComponent } from './components/direct-messages/new-chat/new-chat.component';
import { ThreadComponent } from './components/channels/thread/thread.component';
import { SidenavThreadsComponent } from './components/sidenav-threads/sidenav-threads.component';
import { SidenavUsersComponent } from './components/sidenav-users/sidenav-users.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'channel/:id', component: ChannelComponent, canActivate: [AuthGuard] },
      { path: 'channel-threads', component: SidenavThreadsComponent, canActivate: [AuthGuard] },
      { path: 'channel-users', component: SidenavUsersComponent, canActivate: [AuthGuard] },
      { path: 'user/:id', component: DialogUserComponent, canActivate: [AuthGuard] },
      { path: 'chat/:id', component: DirectMessageChannelComponent, canActivate: [AuthGuard] },
      { path: 'create-chat', component: NewChatComponent, canActivate: [AuthGuard] },
      { path: 'thread/:id', component: ThreadComponent, canActivate: [AuthGuard] },
      { path: 'sidenav', component: sidenavComponent, canActivate: [AuthGuard] },
    ], canActivate: [AuthGuard]
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'sign-up', component: SignUpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
