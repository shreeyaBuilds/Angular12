import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePaymentDetailsComponent } from './add-update-payment-details.component';

describe('AddUpdatePaymentDetailsComponent', () => {
  let component: AddUpdatePaymentDetailsComponent;
  let fixture: ComponentFixture<AddUpdatePaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdatePaymentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdatePaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
