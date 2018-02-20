import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bubbles4Component } from './bubbles4.component';

describe('Bubbles4Component', () => {
  let component: Bubbles4Component;
  let fixture: ComponentFixture<Bubbles4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bubbles4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bubbles4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
