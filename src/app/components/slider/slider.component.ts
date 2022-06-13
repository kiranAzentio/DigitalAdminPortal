import { Component, OnInit,Output, EventEmitter, Input, ViewChild,  } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'digital-app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {

  @ViewChild('slider', {static: false}) slider;

  @Input() data;
  @Input() highLightedRate;
  @Output() onItemClick = new EventEmitter();


  slidesOpts = {
    slidesPerView: 1.5,
    zoom: false
    // freeMode: true - used in delma
  }


  constructor() { 
   
  }

  ngOnInit() {
    console.log(this.data);
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    this.data = changes['data'].currentValue;
  }

  ngAfterViewInit() {
    this.slider.slideTo(this.data.index);
  }

  itemClicked(data){
    if (event) {
      event.stopPropagation();
    }
    this.onItemClick.emit(data);

  }
  add(){
    console.log("slider button clicked");
    this.slider.slideNext();
  }
}
