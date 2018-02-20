import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleCopyComponent } from './bubble-copy.component';

describe('BubbleCopyComponent', () => {
  let component: BubbleCopyComponent;
  let fixture: ComponentFixture<BubbleCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
