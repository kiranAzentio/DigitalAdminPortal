import { Directive, HostListener, Input } from '@angular/core';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';

@Directive({
  selector: '[appBlockCopyCutPaste]'
})
export class BlockCopyCutPasteDirective {
    @Input() blockCopyPasteProcessFlag: boolean = false;

  constructor(private utility :UtilityService){

}

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
      if(this.blockCopyPasteProcessFlag != undefined && this.blockCopyPasteProcessFlag){
        this.utility.showToast('error','Pasting content is not allowed')
        e.preventDefault();
      }
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    if(this.blockCopyPasteProcessFlag != undefined && this.blockCopyPasteProcessFlag){
    this.utility.showToast('error','Copying content is not allowed');
        e.preventDefault();
      }
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    if(this.blockCopyPasteProcessFlag != undefined && this.blockCopyPasteProcessFlag){
    this.utility.showToast('error','Cutting content is not allowed')
        e.preventDefault();
      }
  }

 /* @HostListener('keydown', ['$event']) triggerEsc(e: KeyboardEvent) {
    alert(e);
    if(e.keyCode===27){
      console.log("local esc");
      alert("esc")
    }
  }*/

   @HostListener('keydown', ['$event'])
    public onKeydownHandler(e: KeyboardEvent): void {
    if(e.keyCode===13){
      // alert("enter")
    }
    }
}