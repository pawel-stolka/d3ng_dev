import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bubbles2Component } from './bubbles2.component';

describe('Bubbles2Component', () => {
  let component: Bubbles2Component;
  let fixture: ComponentFixture<Bubbles2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bubbles2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bubbles2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
