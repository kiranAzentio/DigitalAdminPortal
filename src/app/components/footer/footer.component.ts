import { Component, OnInit,Output, EventEmitter, Input  } from '@angular/core';

@Component({
  selector: 'digital-app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() showFooter:boolean = true;

  constructor() { 
   
  }

  ngOnInit() {}

}
