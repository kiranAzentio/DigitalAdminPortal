import { Pipe, PipeTransform } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Pipe({ name: 'customcurrency' })
export class CustomCurrencyPipe extends CurrencyPipe implements PipeTransform {
    transform(value: any, currencyCode?: string,display?:string,digitsInfo?:string): string {
       
        if(currencyCode != undefined && currencyCode != null && value != null && value != ""){
            var dotDigit = null;
            var extractedDotDigit = null;
            var currencyFormat = null;
            var decimaldigReg =  /\d+\.\d+/;

            value = value.toString();

            dotDigit = value.toString().search(/\d./);

            if(decimaldigReg.test(value)){ 
                // alert("number with dot and after number"+value);
                var currFormat = '';
                currFormat = super.transform(value,currencyCode,display,digitsInfo);

                var splited:any = '';
                splited = value.split(".");
                console.log("splited"+splited);

                const extractSymbolDigit = currFormat.search(/\d/);
                
                var formattedBeforeDecimal:any = '';
                formattedBeforeDecimal = currFormat.split(".");  

                currencyFormat = currFormat.substring(0, extractSymbolDigit) + ' ' +formattedBeforeDecimal[0].substring(extractSymbolDigit) +"."+ splited[1];
                console.log("currencyFormat to return "+currencyFormat);                
                return currencyFormat;

                
            }else if(value.includes(".")){
                // alert("number with dot"+value);                
                currencyFormat = super.transform(value.slice(0,value.length - 1),currencyCode,display,digitsInfo);
                extractedDotDigit = value.substring(dotDigit);                
            }else{
                currencyFormat = super.transform(value,currencyCode,display,digitsInfo);                
            }
            if(currencyFormat != undefined && currencyFormat != "" && currencyFormat != null){
                const firstDigit = currencyFormat.search(/\d/);               
                if(extractedDotDigit != null){
                    return currencyFormat.substring(0, firstDigit) + ' ' + currencyFormat.substring(firstDigit) +".";
                }else{
                    return currencyFormat.substring(0, firstDigit) + ' ' + currencyFormat.substring(firstDigit);
                }
            }
        }
        return value;        
          }
}
