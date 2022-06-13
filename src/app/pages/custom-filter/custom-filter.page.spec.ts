import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomFilterPage } from './custom-filter.page';

describe('CustomFilterPage', () => {
  let component: CustomFilterPage;
  let fixture: ComponentFixture<CustomFilterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFilterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
