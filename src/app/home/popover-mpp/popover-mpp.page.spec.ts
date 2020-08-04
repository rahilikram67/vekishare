import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverMppPage } from './popover-mpp.page';

describe('PopoverMppPage', () => {
  let component: PopoverMppPage;
  let fixture: ComponentFixture<PopoverMppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverMppPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverMppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
