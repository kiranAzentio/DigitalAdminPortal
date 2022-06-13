import { Directive, HostListener } from '@angular/core';
@Directive({
    selector: '[contextMenuCheck]'
})
export class ContextMenuCheckDirective {
    
    @HostListener('contextmenu',['$event'])
    onRightClick(event){
        event.preventDefault();
    }
}
