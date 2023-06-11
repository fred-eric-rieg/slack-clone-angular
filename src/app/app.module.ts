import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

/** Material Modules */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DialogHelpComponent } from './components/dialog-help/dialog-help.component';
import { DialogUserComponent } from './components/dialog-user/dialog-user.component';
import { DialogUserEditComponent } from './components/dialog-user-edit/dialog-user-edit.component';

import { sidenavComponent } from './components/sidenav/sidenav.component';
import { SidenavProfileComponent } from './components/sidenav-profile/sidenav-profile.component';
import { DialogAddChannelComponent } from './components/dialog-add-channel/dialog-add-channel.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { DirectMessagesSectionComponent } from './components/direct-messages-section/direct-messages-section.component';
import { ChannelItemComponent } from './components/channel-item/channel-item.component';
import { ChannelComponent } from './components/channel/channel.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

/** Firebase */
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

/** Components */

import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';

/** Services */
import { AuthService } from './shared/services/auth.service';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ToolbarComponent,
    DialogHelpComponent,
    DialogUserComponent,
    DialogUserEditComponent,
    DialogUserComponent,
    sidenavComponent,
    SidenavProfileComponent,
    DialogAddChannelComponent,
    ChannelsComponent,
    DirectMessagesSectionComponent,
    ChannelItemComponent,
    ChannelComponent,
    ForgotPasswordComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatCardModule,
    MatMenuModule,
    MatButtonToggleModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FormsModule,
    MatListModule,
    MatSelectModule,
    MatExpansionModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore())
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
