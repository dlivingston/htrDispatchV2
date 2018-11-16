import { Component, OnInit, EventEmitter, Input, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  @Input() display: boolean;
  @Output() closed = new EventEmitter<boolean>();

  constructor() { 
  }

  ngOnInit() {
  }

  toggleAdminPanel() {
    this.display ? this.display = false : this.display = true;
    this.closed.emit(this.display);
  }

}
