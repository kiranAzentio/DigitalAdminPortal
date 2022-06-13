import { Pipe, PipeTransform } from '@angular/core';
import { NgModel } from '@angular/forms';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
 
    isEmpty(filter){
        for(var key in filter){
            if(filter.hasOwnProperty(key)){ 
            return true
        }
        return false;
    }
    }

    transform(items: any, filter: any, defaultFilter: boolean): any {


        console.log("inside pipe");
            if (!filter || filter.userSearched == undefined){
              console.log("no filter obj present");
              return items;
            }
            // userSearched false- means user has  not searched
            if( !filter.userSearched || this.isEmpty(filter)){
              console.log(" filter obj is empty or user didnot searched");                
              return items;                
            }

            // if (!Array.isArray(items)){
            //      console.log("no array");
            //   return items;
            // }
        
            if (filter && Array.isArray(items)) {
                 console.log("proper array")
              /* console.log(items,filter)*/
              let filterKeys = Object.keys(filter);
              console.log("filterKeys line 25  "+filterKeys);
        
              if (defaultFilter) {
               console.log("dafault");
                return items.filter(item =>
                    filterKeys.reduce((x, keyName) =>
                     
                        (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true
                        ));
              }
              else {
                console.log("else block->");
                return items.filter(item => {
                  console.log("================================line 36 else block->"+JSON.stringify(item));
                  return filterKeys.some((keyName) => {
                     console.log("line 38 else bloock SOME->"+JSON.stringify(item)+"------keyNAME-----"+keyName);
                       console.log("$$$$$line 39 COMPARE->"+filter[keyName]+"--WITH---"+item[keyName]);
                      console.log("~~~~~~~~~~~~~~~~~~line 340 else block REGEX->"+new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "");
                    return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
                  });
                });
              }
            }
          }
}