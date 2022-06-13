import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';
// import {  MOMENT_DATE_FORMAT } from 'app/shared';
@Pipe({
  name: 'momentPipe'
})
export class MomentPipePipe implements PipeTransform {

  // transform(value:Date |moment.Moment): String {
  transform(value:Date | 'use above code'): String {    
    //alert(value +" "+dateFormat+"  " +value.format("YYYY/MM/DD"));
   let val ="";
   if(value != null && value !== undefined){
    // val= moment(value).format(MOMENT_DATE_FORMAT);
   }
    return  val;
  }

}
