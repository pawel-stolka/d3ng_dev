import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Force2Component } from './force2.component';

describe('Force2Component', () => {
  let component: Force2Component;
  let fixture: ComponentFixture<Force2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Force2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Force2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
