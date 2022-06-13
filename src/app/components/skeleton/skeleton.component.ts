import { Component, OnInit,ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Input, Output, OnChanges, SimpleChanges } from "@angular/core";


@Component({
  selector: 'digital-app-skeleton',
  templateUrl: './skeleton.component.html',
  providers: [
  ],
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent implements OnInit,OnChanges,AfterViewInit  {


  constructor(
    private ref: ChangeDetectorRef
    
  ) { }

  ngOnChanges(changes: { [propKey: string]: any }) {
    console.log(changes);
   
  }

  ngOnInit() {
  
  }

  ngAfterViewInit(){
    this.ref.detectChanges();
  }

}

