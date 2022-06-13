import { Directive, HostListener } from '@angular/core';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';
@Directive({
    selector: '[restrictSpecialCharacter]'
})
export class RestrictSpecialCharactersDirective {
    regexCheck = /^[-a-zA-Z0-9_.@, ]*$/

    constructor(private utility :UtilityService){

    }
    @HostListener('keypress')
    onkeypress(e) {
        let event = e || window.event;
        // console.log(event);
        if (event) {
            return true;
            // return this.isNumberKey(event);
        }
    }
    isNumberKey(event) {
        // console.log(event);
        if(event.key != undefined && event.key != ""){
            if(event.key == "/" || 
            event.key == ":" ||
            event.key == ";" ||
            event.key == "=" ||
            event.key == "<" ||
            event.key == ">" || 
            event.key == "?" 
            ){
                return false;
            }
            if(this.regexCheck.test(event.key)){
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    }

    @HostListener('paste', ['$event'])
     blockPaste(event: ClipboardEvent) {
        return true;
        // let clipboardData = event.clipboardData;
        // let pastedText = clipboardData.getData('text');
        // // console.log("Pasted: ", pastedText);
        // if(pastedText.toString().includes("/;:<>?")){
        //     this.utility.showToast('error','Pasting content with special characters is not allowed')
        //     return false;
        // }
        // if(this.regexCheck.test(pastedText)){
        //     return true;
        // }else{
        //     this.utility.showToast('error','Pasting content with special characters is not allowed')
        //     return false;
        // }
      }
}

// https://forum.ionicframework.com/t/number-only-directive-works-on-pc-but-not-in-mobile/177138