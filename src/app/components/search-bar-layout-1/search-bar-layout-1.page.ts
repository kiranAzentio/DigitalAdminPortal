import { Component, Output, EventEmitter, Input, OnChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FilterPipe } from '../pipes/FilterPipe';

@Component({
  selector: 'digital-cs-search-bar-layout-1',
  templateUrl: 'search-bar-layout-1.page.html',
  styleUrls: ['search-bar-layout-1.page.scss'],
  providers: [
    FilterPipe
  ]
})
export class SearchBarLayout1Page implements OnChanges, AfterViewInit {
  @Input() searchData: any;

  @Output() onItemClick = new EventEmitter();
  @Output() onTextChange = new EventEmitter();

  search: String = '';

  viewEntered = false;

  @Input() searchBarPlaceholder:string = 'SEARCH_PLACEHOLDER';
  @Input() searchBarLabel:string = '';
  @Input() showSearchBarLabel:boolean = false;
  
  
  

  constructor(private ref: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.viewEntered = true;  
    this.ref.detectChanges();
      
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    // this.searchData = changes['searchData'].currentValue;
  }

  onItemClickFunc(item): void {
    if (event) {
      event.stopPropagation();
    }
    this.onItemClick.emit(item);
  }

  onTextChangeFunc(item): void {
    if (event) {
      event.stopPropagation();
    }
    this.onTextChange.emit(this.search);
  }
}
