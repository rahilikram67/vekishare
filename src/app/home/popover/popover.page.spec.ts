import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverDriverPage } from './popover-driver.page';

describe('PopoverDriverPage', () => {
  let component: PopoverDriverPage;
  let fixture: ComponentFixture<PopoverDriverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverDriverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverDriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
