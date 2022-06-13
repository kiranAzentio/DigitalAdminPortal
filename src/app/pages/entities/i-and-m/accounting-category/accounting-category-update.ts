import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, Platform, ToastController, PopoverController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountingCategory } from './accounting-category.model';
import { AccountingCategoryService } from './accounting-category.service';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';
import { NumberInputComponent } from 'src/app/components/number-input/number-input.component';

import { Plugins, CameraResultType, } from '@capacitor/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
const { Camera } = Plugins;


@Component({
    selector: 'page-accounting-category-update',
    templateUrl: 'accounting-category-update.html'
})
export class AccountingCategoryUpdatePage implements OnInit {
    @ViewChild('poAmountAmtArrNumView') poAmountAmtArrNumView :NumberInputComponent;
    accountingCategory: AccountingCategory;
    isNew :boolean= true;
    isReadyToSave: boolean = true;

    reactiveformBool :boolean = false;

    statusDropdownArr:any[] = [
        {
        id:1,
        value:'active'
        },
        {
            id:2,
            value:'inactive'
        }
    ]


    // form = this.formBuilder.group({
    // id: [],
    // facility: ['', [Validators.required, Validators.pattern('^[A-Z0-9]+$')]],
    // poDate: [null, [Validators.required]],
    // poAmount: [null, [Validators.required]],
    // lastShipmentdate: [null, [Validators.required]],
    // status: [null, [Validators.required]],
    // });

    form = this.formBuilder.group({
       
        react_branchName: [null, [Validators.required, Validators.maxLength(200)]],
        react_status:  [null, [Validators.required]],
        react_curr:  [null, [Validators.required]],
    
      });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        public popoverController: PopoverController,
        private accountingCategoryService: AccountingCategoryService,
        public appConfigService:AppConfigService,
        private utilityService:UtilityService
    ) {

        // Watch the form for changes, and
        // this.form.valueChanges.subscribe((v) => {
        //     this.isReadyToSave = this.form.valid;
        // });

    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((response) => {
            this.accountingCategory = response.data;
            this.isNew = this.accountingCategory.id === null || this.accountingCategory.id === undefined;
            // this.updateForm(this.accountingCategory);

            this.accountingCategory.poDate =this.utilityService.assignYMDDateForPlatform(this.accountingCategory.poDate,this.appConfigService.getPlatformMobile());
            this.accountingCategory.lastShipmentdate = this.utilityService.assignYMDDateForPlatform(this.accountingCategory.lastShipmentdate,this.appConfigService.getPlatformMobile());
         
        });
    }

    ionViewDidEnter() {
        this.isReadyToSave = this.form.invalid ? true : false;
        console.log(this.isReadyToSave);
        if(!this.isNew){
            this.poAmountAmtArrNumView.formatCurrency(this.accountingCategory.poAmount,'USD');
        }
    }

    private createFromForm(): AccountingCategory {
        return {
            ...new AccountingCategory(),
            id: this.form.get(['id']).value,
            facility: this.form.get(['facility']).value,
            poDate: this.form.get(['poDate']).value,
            poAmount: this.form.get(['poAmount']).value,
            status: this.form.get(['status']).value,
            lastShipmentdate: this.form.get(['lastShipmentdate']).value,
            createdBy: this.form.get(['createdBy']).value,
            modifiedBy: this.form.get(['modifiedBy']).value,
            createDate: this.form.get(['createDate']).value,
            modifiedDate: this.form.get(['modifiedDate']).value,
        };
    }

    updateForm(accountingCategory: AccountingCategory) {
        this.form.patchValue({
            id: accountingCategory.id,
            facility: ['', [Validators.required, Validators.pattern('^[A-Z0-9]+$')]],
            poAmount: [null, [Validators.required]],
            status: [null, [Validators.required]],
            poDate: this.isNew ? new Date().toISOString().split('T')[0] : accountingCategory.poDate,
            lastShipmentdate: this.isNew ? new Date().toISOString().split('T')[0] : accountingCategory.lastShipmentdate,

        });
    }

    saveForm() {
        const accountingCategory = this.createFromForm();
        accountingCategory.createDate = new Date(accountingCategory.createDate).toISOString().split('T')[0];
        accountingCategory.modifiedDate = new Date(accountingCategory.modifiedDate).toISOString().split('T')[0];

        if (!this.isNew) {
            accountingCategory.modifiedBy = this.appConfigService.getLoggedInUserId();
            this.subscribeToSaveResponse(this.accountingCategoryService.update(accountingCategory));
        } else {
            accountingCategory.createdBy = this.appConfigService.getLoggedInUserId(),
            this.subscribeToSaveResponse(this.accountingCategoryService.create(accountingCategory));
        }
    }


    protected subscribeToSaveResponse(result: Observable<HttpResponse<AccountingCategory>>) {
        result.subscribe((res: HttpResponse<AccountingCategory>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (this.isNew) {
            action = 'created';
        }
        console.log(response);

        const toast = await this.toastCtrl.create({ message: `AccountingCategory ${action} successfully.`, duration: 2000, position: 'middle' });
        toast.present();
        this.navController.navigateRoot('/menu/tabs/entities/i-and-m/accounting');
    }

    
    async onError(error) {
        // this.isSaving = false;
        console.error(error);
       alert('Failed to load Data!');
    }

    disableFormSubmission(invalidFlag) {
        this.isReadyToSave = invalidFlag;
    }
  
    onChangeOfStatus(data){

    }

    savedummy(){
        var msg = "Record saved successfully";
        if(this.isNew){
            msg = "Record updated successfully"
        }
        this.utilityService.showToast('success','Record saved successfully');
    }


    async camera(data) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64
        });
    
        // if (data == 'id') {
        //   this.imagee = 'data:image/jpeg;base64,' + image.base64String;
        // }
        // else if (data == 'proof') {
        //   this.proof = 'data:image/jpeg;base64,' + image.base64String;
    
        // }
        // else {
        //   this.bank = 'data:image/jpeg;base64,' + image.base64String;
    
        // }
    
      }
    
      async document() {
        // this.fileChooser.open()
        //   .then(uri => console.log(uri))
        //   .catch(e => console.log(e));
      }


}
