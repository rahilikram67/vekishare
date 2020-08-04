import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MakeprofilePage } from './makeprofile.page';

describe('MakeprofilePage', () => {
  let component: MakeprofilePage;
  let fixture: ComponentFixture<MakeprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeprofilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MakeprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
