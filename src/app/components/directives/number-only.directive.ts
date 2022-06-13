import { Directive, HostListener } from '@angular/core';
@Directive({
    selector: '[integerOnly]'
})
export class NumberOnlyDirective {
    @HostListener('keypress')
    onkeypress(e) {
        let event = e || window.event;
        console.log(event);
        if (event) {
            return this.isNumberKey(event);
        }
    }
    isNumberKey(event) {
        console.log(event);
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}

// https://forum.ionicframework.com/t/number-only-directive-works-on-pc-but-not-in-mobile/177138