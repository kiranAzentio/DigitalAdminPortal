import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { AccountingCategoryPage } from './accounting-category';
import { AccountingCategoryUpdatePage } from './accounting-category-update';
import { AccountingCategory, AccountingCategoryService, AccountingCategoryDetailPage } from '.';
import { UserRouteAccessService } from 'src/app/services/shared/auth/user-route-access.service';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { PrimengComponentsModule } from 'src/app/components/primeng-components/primeng-components.module';

@Injectable({ providedIn: 'root' })
export class AccountingCategoryResolve implements Resolve<AccountingCategory> {
  constructor(private service: AccountingCategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountingCategory> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      // return this.service.find(id).pipe(
      //   filter((response: HttpResponse<AccountingCategory>) => response.ok),
      //   map((accountingCategory: HttpResponse<AccountingCategory>) => accountingCategory.body)
      // );
      var AccountingCategory:AccountingCategory = {
        id:29299,
        facility :'PO 101',
        poAmount:900000,
        poDate:'02-15-2021',
        lastShipmentdate: '02-15-2021',
        status: 1
        
      };

      return of(AccountingCategory)
    }
    var AccountingCategory:AccountingCategory = {
      id:null,
      facility :null,
      poAmount:null,
      poDate:null,
      lastShipmentdate:null,
      status: null
      
    };
    // return of(new AccountingCategory());
    return of(AccountingCategory);
  }
}

const routes: Routes = [
    {
      path: '',
      component: AccountingCategoryPage,
      // data: {
      //   authorities: ['ROLE_USER']
      // },
      // canActivate: [UserRouteAccessService]
    },
    {
      path: 'new',
      component: AccountingCategoryUpdatePage,
      resolve: {
        data: AccountingCategoryResolve
      },
      data: {
        authorities: ['ROLE_USER']
      },
      // canActivate: [UserRouteAccessService]
    },
    {
      // path: ':id/view',
      path: 'detail',
      component: AccountingCategoryDetailPage,
      resolve: {
        data: AccountingCategoryResolve
      },
      data: {
        authorities: ['ROLE_USER']
      },
      // canActivate: [UserRouteAccessService]
    },
    {
      path: ':id/edit',
      component: AccountingCategoryUpdatePage,
      resolve: {
        data: AccountingCategoryResolve
      },
      data: {
        authorities: ['ROLE_USER']
      },
      // canActivate: [UserRouteAccessService]
    }
  ];

@NgModule({
    declarations: [
        AccountingCategoryPage,
        AccountingCategoryUpdatePage,
        AccountingCategoryDetailPage
    ],
    imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TranslateModule,
        SharedComponentsModule,
        PrimengComponentsModule,
        RouterModule.forChild(routes)
    ]
})
export class AccountingCategoryPageModule {
}
