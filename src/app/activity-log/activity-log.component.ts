import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AngularFireDatabase, AngularFireAction, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { ActivityLogService } from '../activity-log.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  ticketID: string;
  logEntries: Observable<any[]>;
  constructor(public modalRef: BsModalRef, public af: AngularFireDatabase, public activityLogSvc: ActivityLogService) { }

  ngOnInit() {
    document.querySelector('modal-container').classList.add('activity-log');
    this.logEntries = this.af.list('/activity_log', ref => ref.orderByChild('ticketID').equalTo(this.ticketID)).valueChanges();
  }

}
