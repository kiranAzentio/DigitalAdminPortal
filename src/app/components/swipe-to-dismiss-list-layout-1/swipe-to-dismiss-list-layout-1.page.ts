import { Component, Output, EventEmitter, Input, ViewChild, OnChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { FilterPipe } from '../pipes/FilterPipe';

@Component({
  selector: 'digital-cs-swipe-to-dismiss-list-layout-1',
  templateUrl: 'swipe-to-dismiss-list-layout-1.page.html',
  styleUrls: ['swipe-to-dismiss-list-layout-1.page.scss'],
  providers: [
    FilterPipe
  ]
})
export class SwipeToDismissListLayout1Page implements OnChanges,AfterViewInit {
  @ViewChild('sliding', {static: false}) sliding;
  @ViewChild('dynamicList', {static: false}) dynamicList;
  @ViewChild('searchView',{static:false}) searchView;

  @Input() data: any;
  @Input() unprocessed: boolean = false;
  @Input() outstanding: boolean = false;
  @Input() closeSwiper: boolean = true;
  @Input() disableSwipeButtons: boolean = false;
  @Input() showSearchBar: boolean = false;
  @Input() searchBarLabel: string = '';
  @Input() showSearchBarLabel :boolean = false;
  @Input() searchPlaceholder :string  = '';
  @Input() expiredRejected: boolean = false;
  @Input() beneficiary: boolean = false;
  @Input() isSearchBarOpened:boolean = false;
  
  
  
  
  
  @Output() onPopUpCounterSubmit = new EventEmitter();
  @Output() onAcceptSubmit = new EventEmitter();  
  @Output() onItemClick = new EventEmitter();
  @Output() onLike = new EventEmitter();
  @Output() onFavorite = new EventEmitter();
  @Output() onShare = new EventEmitter();
  @Output() onUndo = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onAdd = new EventEmitter();  
  @Output() openPopUp = new EventEmitter();  
  @Input() filterObj;
  search:string;
  // filterObj:any;
  @Input()createFilterObj:boolean = false;

  @Input() filterData:any = [];
  @Input() showData;
  @Input() isFilterAllowed:boolean = false;
  @Input() isFilterUsed:boolean = false;

  showSkeleton:boolean = true;
  skeletonArray:any[] = new Array().fill(7);

  constructor(public popoverController: PopoverController,
  public appConfig: AppConfigService,private ref: ChangeDetectorRef) { }

  ngOnChanges(changes: { [propKey: string]: any }) {
    // if(changes['data'] != undefined){
      // this.data = changes['data'].currentValue;
    // }
    //check whether  closeSwiper is attached in parent html [closeSwiper]  and set to true/false toogle to detec change here
    if(changes.closeSwiper != undefined){  
      this.closeSwipeFun(changes.closeSwiper.currentValue)
    }
  }
  ngAfterViewInit(){
    // setTimeout(() => {
    //   this.showSkeleton = false;
    // // this.showDataObj = this.data; 
    // }, 500);
    // alert("viewinit")
    // this.showSkeleton = false;
    // this.showDataObj = this.data; 
    
  this.ref.detectChanges();  
  }

  onUndoFunc = () => {
    if (event) {
      event.stopPropagation();
    }
    this.sliding.closeOpened();
    this.onUndo.emit()
  }

  onDeleteFunc = (item: any): void => {
    // alert("on delete"+JSON.stringify(item));
    if (event) {
      event.stopPropagation();
    }
    this.dynamicList.closeSlidingItems()
    const index = this.data.items.indexOf(item);
    if (index > -1) {
      this.data.items.splice(index, 1);
    }
    this.onDelete.emit(item)
  }

  onItemClickFunc(item,event) {
    if (event) {
      event.stopPropagation();
    }
    console.log("item clicked -item---"+JSON.stringify(item));
    console.log("item clicked -event---"+JSON.stringify(event));    
    this.onItemClick.emit(item);
  }
  
  onBeneficiaryItemClickFunc(item,event){
    if (event) {
      event.stopPropagation();
    }
    console.log("beneficiary item clicked -item---"+JSON.stringify(item));
    console.log("beneficiary item clicked -event---"+JSON.stringify(event));    
    this.onItemClick.emit(item);
  }

  onLikeFunc(item) {
    if (event) {
      event.stopPropagation();
    }
    this.onLike.emit(item);
  }

  onFavoriteFunc(item) {
    if (event) {
      event.stopPropagation();
    }
    this.onFavorite.emit(item);
  }

  onShareFunc(item) {
    if (event) {
      event.stopPropagation();
    }
    this.onShare.emit(item);
  }
 
  accept(data){
    if (event) {
      event.stopPropagation();
    }
    this.dynamicList.closeSlidingItems();    
    this.onAcceptSubmit.emit(data);
  }

  onAddFunc(){
    this.onAdd.emit('add')
  }
  extend(item){
    console.log("extend");
  }

  async sendPopUpControl(item,screenType){
    
    if (event) {
      event.stopPropagation();
    }
    let obj :any = {};
    obj.data = item;
    obj.screenType = screenType;
    
    this.openPopUp.emit(obj);

  }
  closeSwipeFun(closeSwiper){
        if(this.dynamicList){
          this.dynamicList.closeSlidingItems();
        }
      }

      // search bar
      onTextChange(evt){
        //copy data array showData
        if (!this.createFilterObj){
          console.log("no filter(createFilterObj) by parent obj");
          return  this.showData;          
        }

        if(this.isFilterUsed){
          console.log("=============================================");
          console.log("=============================================");
          console.log("================FILTER USED===================");          
          console.log("=============================================");
          console.log("=============================================");
          
          //if filter is used assign filter data to show dataa and perform serach operation
          this.showData = this.filterData;
        }else{
          console.log("=============================================");
          console.log("=============================================");
          console.log("================FILTER CLEARED ==============");          
          console.log("=============================================");
          console.log("=============================================");
          //if filter is not used ,assign original data to filter and show data         
          this.filterData = this.data;
          this.showData = this.data;
        }

        const searchTerm = evt.srcElement.value;
        console.log("input data "+searchTerm);

        if(!searchTerm){
          return this.showData;
        }

        for(var keys in this.filterObj){
          this.filterObj[keys] = searchTerm;
        }

      this.filterDataOnSearch(this.filterObj,false);
      
      }


      filterDataOnSearch(filter: any, defaultFilter: boolean){
        console.log("inside filter data method");
        
        if (this.data.length > 0) {

          let filterKeys = Object.keys(filter);
          // console.log("filterKeys line 25  "+filterKeys);
    
          if (defaultFilter) {
           console.log("dafault");
           this.showData =  this.showData.filter(item =>
                filterKeys.reduce((x, keyName) =>
                 
                    (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true
                    ));
          }
          else {
            console.log("else block->");
             this.showData =  this.showData.filter(item => {
              // console.log("================================line 36 else block->"+JSON.stringify(item));
              return filterKeys.some((keyName) => {
                //  console.log("line 38 else bloock SOME->"+JSON.stringify(item)+"------keyNAME-----"+keyName);
                  //  console.log("$$$$$line 39 COMPARE->"+filter[keyName]+"--WITH---"+item[keyName]);
                  console.log("------REGEX MATCHED->"+new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "");
                return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
              });
            });
          }
        }
      }

      searchCancelClicked(){
        this.search = '';
        this.isSearchBarOpened = false;
        if(this.isFilterUsed){
          console.log("=============================================");
          console.log("=============================================");
          console.log("================ion cancel click FILTER USED===================");          
          console.log("=============================================");
          console.log("=============================================");
          
          //if filter is used assign filter data to show dataa and perform serach operation
          this.showData = this.filterData;
        }else{
          console.log("=============================================");
          console.log("=============================================");
          console.log("================ion cancel click FILTER CLEARED or NO FILTER ==============");          
          console.log("=============================================");
          console.log("=============================================");
          //if filter is not used ,assign original data to filter and show data         
          this.filterData = this.data;
          this.showData = this.data;
        }
      }

      setSearchBarFocus(){
          setTimeout(() => {
            this.searchView.setFocus();
          }, 600);  
      }
}
