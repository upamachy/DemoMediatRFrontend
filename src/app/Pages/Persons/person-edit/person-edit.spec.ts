import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonEdit } from './person-edit';

describe('PersonEdit', () => {
  let component: PersonEdit;
  let fixture: ComponentFixture<PersonEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
