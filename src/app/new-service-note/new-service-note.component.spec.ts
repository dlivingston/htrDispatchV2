import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewServiceNoteComponent } from './new-service-note.component';

describe('NewServiceNoteComponent', () => {
  let component: NewServiceNoteComponent;
  let fixture: ComponentFixture<NewServiceNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewServiceNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewServiceNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
