import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrTilesComponent } from './fr-tiles.component';

describe('FrTilesComponent', () => {
  let component: FrTilesComponent;
  let fixture: ComponentFixture<FrTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
