import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { sidenavComponent } from './components/sidenav/sidenav.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ChannelComponent } from './components/channel/channel.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { DialogUserComponent } from './components/dialog-user/dialog-user.component';
import { DirectMessageChannelComponent } from './components/direct-message-channel/direct-message-channel.component';
import { NewChatComponent } from './components/new-chat/new-chat.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'channel', component: ChannelComponent },
      { path: 'user/:id', component: DialogUserComponent },
      { path: 'chat/:id', component: DirectMessageChannelComponent },
      { path: 'create-chat', component: NewChatComponent },
    ]
  },
  { path: 'sidenav', component: sidenavComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'sign-up', component: SignUpComponent },
  // { path: 'dashboard/channel', component: ChannelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
