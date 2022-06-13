import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IAndMDashboardPage } from './i-and-m-dashboard.page';

describe('IAndMDashboardPage', () => {
  let component: IAndMDashboardPage;
  let fixture: ComponentFixture<IAndMDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IAndMDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IAndMDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
