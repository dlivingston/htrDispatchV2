import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxEditorModule } from 'ngx-editor';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { AssignedTechFilterPipe } from './assigned-tech-filter.pipe';
import { ClientSortPipe } from './client-sort.pipe';
import { TechListAlphaSortPipe } from './tech-list-alpha-sort.pipe';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { TicketIdSortPipe } from './ticket-id-sort.pipe';
import { PriorityFilterPipe } from './priority-filter.pipe';
import { StatusFilterPipe } from './status-filter.pipe';
import { ListSearchPipe } from './list-search.pipe';
import { LocationSortPipe } from './location-sort.pipe';
import { TechSortPipe } from './tech-sort.pipe';
import { PrioritySortPipe } from './priority-sort.pipe';
import { ScheduleSortPipe } from './schedule-sort.pipe';
import { TechPoSortPipe } from './tech-po-sort.pipe';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { NewServiceNoteComponent } from './new-service-note/new-service-note.component';
import { ServiceNoteComponent } from './service-note/service-note.component';
import { UploadService } from './shared/upload.service';
import { UploadFormComponent } from './shared/upload-form/upload-form.component';
import { TimeTrackerComponent } from './time-tracker/time-tracker.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { ElapsedTimePipe } from './elapsed-time.pipe';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'new-ticket', component: NewTicketComponent },
  { path: 'ticket-detail/:id', component: TicketDetailsComponent },
  { path: 'ticket-list', component: TicketListComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TicketListComponent,
    AssignedTechFilterPipe,
    ClientSortPipe,
    TechListAlphaSortPipe,
    LoadingSpinnerComponent,
    TicketIdSortPipe,
    PriorityFilterPipe,
    StatusFilterPipe,
    ListSearchPipe,
    LocationSortPipe,
    TechSortPipe,
    PrioritySortPipe,
    ScheduleSortPipe,
    TechPoSortPipe,
    TicketDetailsComponent,
    NewTicketComponent,
    NewServiceNoteComponent,
    ServiceNoteComponent,
    UploadFormComponent,
    TimeTrackerComponent,
    ActivityLogComponent,
    ElapsedTimePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes, {}
    ),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    NgxEditorModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ], 
  entryComponents: [
    TimeTrackerComponent,
    ActivityLogComponent
  ],
  providers: [UploadService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
