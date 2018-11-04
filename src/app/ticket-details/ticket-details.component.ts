import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivityLogService } from '../activity-log.service';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxEditorModule } from 'ngx-editor';
import { Upload } from '../shared/upload';
import { TimeTrackerComponent } from '../time-tracker/time-tracker.component';
import { ActivityLogComponent } from '../activity-log/activity-log.component';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {
  private ticketRef: AngularFireObject<any>;
  private ticket: Observable<any>;
  private currentUserRef: AngularFireObject<any>;
  private currentUser: Observable<any>;
  private currentUserName: string;
  private currentUserId: string;
  private currentUserIsTech: boolean;
  private techsRef: AngularFireList<any[]>;
  private techs: Observable<any[]>;
  private attachedFiles: Observable<any[]>;
  id: string;
  private editMode: boolean;
  private ticketActive: boolean;
  private partsOrder: boolean;
  private addServiceNoteActive: boolean;
  private ticketPriority: string;
  private ticketStatus: string;
  private ticketAssignedName: string;
  private ticketAssignedId: string;
  private ticketClockedIn: boolean;
  private ticketTechActivity: string;
  private ticketTTActivity: string;
  private clockedInTime: string;
  private partsOrderedBy: string;
  fileUploads: any[];
  colorTheme = 'theme-default';
  bsConfig: Partial<BsDatepickerConfig>;
  public modalRef: BsModalRef;
  userId: string;
  editorConfig = {
    "editable": false,
    "spellcheck": false,
    "height": "10rem",
    "minHeight": "10rem",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": false,
    "placeholder": "",
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline"]
    ]
  };

  htmlContent = '';
  constructor(public authService: AuthService, public af: AngularFireDatabase, private route: ActivatedRoute, private router: Router, private modalService: BsModalService) { 
    this.techsRef = af.list('/techs');
    
    
    this.route.params.subscribe(params => this.id = params.id);
    this.ticketRef = af.object('/tickets/' + this.id);
    this.ticket = this.ticketRef.valueChanges();
    this.ticket.subscribe(ticket => {
      this.partsOrder = ticket.parts_ordered;
      this.ticketPriority = ticket.priority;
      this.ticketStatus = ticket.status;
      this.ticketAssignedName = ticket.assigned_tech_name;
      this.ticketAssignedId = ticket.assigned_tech;
      this.partsOrderedBy = ticket.parts_ordered_by;
      this.ticketActive = ticket.active;
      this.ticketClockedIn = ticket.clockedIn;
      this.ticketTTActivity = ticket.ticketTTActivity;
      this.clockedInTime = ticket.clockedIn_timestamp;
      return ticket;
    });
    this.authService.user.subscribe(user => {
      if (user) {
        this.currentUserRef = this.af.object('/users/' + user.uid);
        this.currentUser = this.currentUserRef.valueChanges();
        let tech = this.af.object('/techs/' + user.uid);
        tech.snapshotChanges().subscribe(snapshot => {
          if (snapshot.key) {
            this.currentUserIsTech = true;
            this.currentUserId = snapshot.key;
          } else {
            this.currentUserIsTech = false;
          }
          this.currentUserRef.snapshotChanges().subscribe(cUser => {
            this.currentUserName = cUser.payload.val().name;
          });
        });
        this.userId = user.uid;
      }
    });
    this.techs = this.techsRef.snapshotChanges();
    this.techs.subscribe(snapshot => {});
    this.attachedFiles = this.af.list('/uploads', ref => ref.orderByChild('attachedKey').equalTo(this.id)).valueChanges();
    this.editMode = false;
    this.addServiceNoteActive = false;
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  updateTicket(f: NgForm) {
    this.ticketRef = this.af.object('/tickets/' + this.id);
    let now = new Date();
    if (f.value.address_city) { this.ticketRef.update({ address_city: f.value.address_city }); }
    if (f.value.address_ln1) { this.ticketRef.update({ address_ln1: f.value.address_ln1 }); }
    if (f.value.address_ln2) { this.ticketRef.update({ address_ln2: f.value.address_ln2 }); }
    if (f.value.address_state) { this.ticketRef.update({ address_state: f.value.address_state }); }
    if (f.value.address_zip) { this.ticketRef.update({ address_zip: f.value.address_zip }); }
    if (f.value.alt_contact_email) { this.ticketRef.update({ alt_contact_email: f.value.alt_contact_email }); }
    if (f.value.alt_contact_name) { this.ticketRef.update({ alt_contact_name: f.value.alt_contact_name }); }
    if (f.value.alt_contact_phone) { this.ticketRef.update({ alt_contact_phone: f.value.alt_contact_phone }); }
    // if(f.value.assigned_tech) { this.ticketRef.update({assigned_tech : f.value.assigned_tech}); }
    this.ticketRef.update({ assigned_tech_name: this.ticketAssignedName });
    this.ticketRef.update({ assigned_tech: this.ticketAssignedId });
    if (f.value.callback) { this.ticketRef.update({ callback: f.value.callback }); } else { this.ticketRef.update({ callback: false }); }
    if (f.value.client_loc_id) { this.ticketRef.update({ client_loc_id: f.value.client_loc_id }); }
    if (f.value.client_name) { this.ticketRef.update({ client_name: f.value.client_name }); }
    if (f.value.short_desc) {
      if (f.value.short_desc.length > 50) {
        var shortDesc = f.value.short_desc.slice(0, 50);
        this.ticketRef.update({ short_desc: shortDesc });
      } else {
        this.ticketRef.update({ short_desc: f.value.short_desc });
      }
    }
    if (f.value.desc_notes) { this.ticketRef.update({ desc_notes: f.value.desc_notes }); }
    if (f.value.rt_notes) { this.ticketRef.update({ desc_notes: f.value.rt_notes }); }
    if (f.value.discount_partial) { this.ticketRef.update({ discount_partial: f.value.discount_partial }); } else { this.ticketRef.update({ discount_partial: false }); }
    if (f.value.estPartArrDate) { this.ticketRef.update({ estPartArrDate: f.value.estPartArrDate }); }
    if (f.value.parts_ordered) { this.ticketRef.update({ parts_ordered: f.value.parts_ordered }); } else { this.ticketRef.update({ parts_ordered: false }); }
    // if(f.value.parts_ordered_by) { this.ticketRef.update({parts_ordered_by : f.value.parts_ordered_by}); }
    this.ticketRef.update({ parts_ordered_by: this.partsOrderedBy });
    if (f.value.parts_vendor) { this.ticketRef.update({ parts_vendor: f.value.parts_vendor }); }
    if (f.value.primary_contact_email) { this.ticketRef.update({ primary_contact_email: f.value.primary_contact_email }); }
    if (f.value.primary_contact_name) { this.ticketRef.update({ primary_contact_name: f.value.primary_contact_name }); }
    if (f.value.primary_contact_phone) { this.ticketRef.update({ primary_contact_phone: f.value.primary_contact_phone }); }
    // if(f.value.priority) { this.ticketRef.update({priority : f.value.priority}); }
    this.ticketRef.update({ priority: this.ticketPriority });
    if (f.value.sched_srvc_date) { this.ticketRef.update({ sched_srvc_date: f.value.sched_srvc_date }); } else { this.ticketRef.update({ sched_srvc_date: '' }); }
    this.ticketRef.update({ status: this.ticketStatus });
    // if(f.value.status) { this.ticketRef.update({status : f.value.status}); }
    this.ticketRef.update({ last_updated: now });
    this.ticketRef.update({ last_updated_by: this.userId });
    this.toggleEditMode();
  }

  deleteTicket() {
    this.af.object('/tickets/' + this.id).remove()
      .then(_ => {
        this.modalRef.hide();
        this.router.navigate(['ticket-list']);
      })
      .catch(err => console.log("Delete Error", err));
  }

  confirmDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openTimeTrackerModal() {
    const initialState = {
      ticketID: this.id,
      techID: this.currentUserId,
      techName: this.currentUserName
    };
    this.modalRef = this.modalService.show(TimeTrackerComponent, {initialState});
  }

  openActivityLog() {
    const initialState = {
      ticketID: this.id
    }
    this.modalRef = this.modalService.show(ActivityLogComponent, { initialState, class: 'modal-lg' });
  }

  toggleEditMode() {
    this.editMode ? this.editMode = false : this.editMode = true;
    this.editMode ? this.editorConfig.editable = true : this.editorConfig.editable = false;
    this.editMode ? this.editorConfig.showToolbar = true : this.editorConfig.showToolbar = false;
  }

  toggleActiveTicket() {
    this.ticketActive ? this.ticketActive = false : this.ticketActive = true;
    this.ticketRef.update({ active: this.ticketActive });
  }

  togglePartsOrderedPanel() {
    this.partsOrder ? this.partsOrder = false : this.partsOrder = true;
  }

  toggleActiveServiceNote(active: boolean) {
    this.addServiceNoteActive = active;
  }

  setTicketPriority(level: string) {
    this.ticketPriority = level;
  }

  setTicketStatus(status: string) {
    this.ticketStatus = status;
  }

  getAttachedFiles() {

  }

  addUploadFile(fileDetails: Upload) {
  }

  onAssignedTechChange(value) {
    this.ticketAssignedName = value.val().name;
    this.ticketAssignedId = value.key;
  }

  onPartsOrderedByChange(value) {
    this.partsOrderedBy = value.val().name;
  }

  compareFn(optionOne, optionTwo): boolean {
    if (optionOne && optionTwo) {
      return optionOne.val().name === optionTwo.assigned_tech_name;
    }
  }

  comparePoTech(optionOne, optionTwo): boolean {
    if (optionOne && optionTwo) {
      return optionOne.val().name === optionTwo.parts_ordered_by;
    } 
  }
  ngOnInit() {
  }

}
