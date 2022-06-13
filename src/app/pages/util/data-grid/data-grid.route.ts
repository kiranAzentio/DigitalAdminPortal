import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { UserRouteAccessService } from 'src/app/services/shared/auth/user-route-access.service';
import { DatagridService } from 'src/app/services/shared/data-grid/data-grid.service';
import { GridDetails } from 'src/model/grid-details.model';
import { DataGridPage } from './data-grid.page';


@Injectable({ providedIn: 'root' })
export class DatagridResolve implements Resolve<string> {
    constructor(private service: DatagridService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const gridId = route.params['gridId'] ? route.params['gridId'] : null;        
        return gridId;
    }
}

@Injectable({ providedIn: 'root' })
export class DatagridTabResolve implements Resolve<GridDetails> {
    constructor(private service: DatagridService,private appConfig:AppConfigService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const modId = 99999;
        // const modId = this.appConfig.actionCode === 'modify'?route.parent.data.modId?route.parent.data.modId:null : null;
        const id = modId?modId:(route.parent.params['id'] ? route.parent.params['id'] : null);
        const gridId = route.params['gridId'] ? route.params['gridId'] : null;   
        const subGridId = route.params['subGridId'] ? route.params['subGridId'] : null;   
        const gridDetails =  new GridDetails();
        gridDetails.gridId = gridId;
        gridDetails.subGridId = subGridId;
        gridDetails.param = {"id":id};
        return gridDetails;
    }
}

export const datagridRoute: Routes = [
    {
        path: 'datagrid/:gridId',
        component: DataGridPage,
        resolve: {
            datagrid: DatagridResolve
        },
        // data: {
        //     authorities: ['ROLE_USER'],
        //     pageTitle: 'DATA-GRID'
        // },
        // canActivate: [UserRouteAccessService]
    },
    {
        path: 'datagrid/:gridId/:subGridId',
        component: DataGridPage,
        resolve: {
            datagrid: DatagridResolve
        },
        // data: {
        //     authorities: ['ROLE_USER'],
        //     pageTitle: 'DATA-GRID'
        // },
        // canActivate: [UserRouteAccessService]
    },
    // {
    //     path: 'editableDatagrid/:gridId',
    //     // component: EditableDataGridComponent,
    //     resolve: {
    //         datagrid: DatagridResolve
    //     },
    //     data: {
    //         authorities: ['ROLE_USER'],
    //         pageTitle: 'kastleTbsApp.dataGrid.home.title'
    //     },
    //     canActivate: [UserRouteAccessService]
    // }
  
    
];