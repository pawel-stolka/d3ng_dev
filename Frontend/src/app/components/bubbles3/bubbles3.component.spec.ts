import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bubbles3Component } from './bubbles3.component';

describe('Bubbles3Component', () => {
  let component: Bubbles3Component;
  let fixture: ComponentFixture<Bubbles3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bubbles3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bubbles3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
