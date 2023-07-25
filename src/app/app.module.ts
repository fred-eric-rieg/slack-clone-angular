import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/** Librarys */

/** Firebase */
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';


/** Components */
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DialogHelpComponent } from './components/dialog-help/dialog-help.component';
import { DialogLegalComponent } from './components/dialog-legal/dialog-legal.component';
import { DialogUserComponent } from './components/dialog-user/dialog-user.component';
import { DialogUserEditComponent } from './components/dialog-user-edit/dialog-user-edit.component';
import { sidenavComponent } from './components/sidenav/sidenav.component';
import { DialogAddChannelComponent } from './components/dialog-add-channel/dialog-add-channel.component';
import { ChannelComponent } from './components/channel/channel.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { DialogPictureEditComponent } from './components/dialog-picture-edit/dialog-picture-edit.component';
/** Components for File Storage */
import { UploadFormComponent } from './components/upload-form/upload-form.component';
import { UploadDetailsComponent } from './components/upload-details/upload-details.component';
import { DirectMessageChannelComponent } from './components/direct-message-channel/direct-message-channel.component';
import { DirectMessagesSectionComponent } from './components/direct-messages-section/direct-messages-section.component';
import { NewChatComponent } from './components/new-chat/new-chat.component';

/** Services */
import { AuthService } from './shared/services/auth.service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DialogAddDescriptionComponent } from './components/dialog-add-description/dialog-add-description.component';
import { DialogAddPeopleComponent } from './components/dialog-add-people/dialog-add-people.component';
import { DialogViewPeopleComponent } from './components/dialog-view-people/dialog-view-people.component';
import { ThreadComponent } from './components/thread/thread.component';
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ToolbarComponent,
    DialogHelpComponent,
    DialogLegalComponent,
    DialogUserComponent,
    DialogUserEditComponent,
    sidenavComponent,
    DialogAddChannelComponent,
    ChannelComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    UploadFormComponent,
    UploadDetailsComponent,
    SignUpComponent,
    DirectMessageChannelComponent,
    DirectMessagesSectionComponent,
    NewChatComponent,
    DialogPictureEditComponent,
    DialogAddDescriptionComponent,
    DialogAddPeopleComponent,
    DialogViewPeopleComponent,
    ThreadComponent,
    SearchComponent,
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
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FormsModule,
    MatListModule,
    MatSelectModule,
    MatExpansionModule,
    ReactiveFormsModule,
    CdkDrag,
    QuillModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
