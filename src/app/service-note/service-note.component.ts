import { Component, OnInit, Input, OnChanges, TemplateRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { Subject, Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-service-note',
  templateUrl: './service-note.component.html',
  styleUrls: ['./service-note.component.scss']
})
export class ServiceNoteComponent implements OnInit, OnChanges {
  @Input() ticketID: string;
  notesRef: AngularFireList<any>;
  notes: Observable<any[]>;
  attachedFile: AngularFireObject<any[]>;
  private currentUserRef: AngularFireObject<any>;
  private currentUser: Observable<any>;
  public modalRef: BsModalRef;
  userId: string;
  constructor(public authService: AuthService, public af: AngularFireDatabase, private modalService: BsModalService) {
    this.authService.user.subscribe(user => {
      if (user) {
        this.currentUserRef = this.af.object('/users/' + user.uid);
        this.currentUser = this.currentUserRef.valueChanges();
        this.userId = user.uid;
      }
    });
  }

  ngOnInit() { }

  ngOnChanges() {
    this.notesRef = this.af.list('/service-notes', ref => ref.orderByChild('ticketID').equalTo(this.ticketID));
    this.notes = this.notesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  confirmDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteServiceNote(key: string) {
    this.notesRef.remove(key);
    this.modalRef.hide();
  }

}
