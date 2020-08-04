import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WatchprofilePage } from './watchprofile.page';

describe('WatchprofilePage', () => {
  let component: WatchprofilePage;
  let fixture: ComponentFixture<WatchprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchprofilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
