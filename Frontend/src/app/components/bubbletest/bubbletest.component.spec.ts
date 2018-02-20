import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbletestComponent } from './bubbletest.component';

describe('BubbletestComponent', () => {
  let component: BubbletestComponent;
  let fixture: ComponentFixture<BubbletestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbletestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbletestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
