import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceNoteComponent } from './service-note.component';

describe('ServiceNoteComponent', () => {
  let component: ServiceNoteComponent;
  let fixture: ComponentFixture<ServiceNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
