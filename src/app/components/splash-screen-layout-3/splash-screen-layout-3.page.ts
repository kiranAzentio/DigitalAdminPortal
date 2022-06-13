import { Component, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';

@Component({
  selector: 'digital-cs-splash-screen-layout-3',
  templateUrl: 'splash-screen-layout-3.page.html',
  styleUrls: ['splash-screen-layout-3.page.scss'],
})
export class SplashScreenLayout3Page implements OnChanges, OnDestroy {
  @Input() data: any;
  @Output() onRedirect = new EventEmitter();

  timer: any;
  bgImg : string ='assets/img/background/111.jpg';
  // image: 'assets/img/background/title.jpg';
  
  constructor(public appConfigService:AppConfigService) {}

  ngOnChanges(changes: { [propKey: string]: any }) {
    clearInterval(this.timer);
    this.data = changes['data'].currentValue;
    this.executeEvents();
  }

  executeEvents(): void {
    // (this.data && this.data.duration) ? this.data.duration :
    const duration =  5000;
    let self = this;
    this.timer = setTimeout(function() {
      self.onRedirect.emit();
    }, duration);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
