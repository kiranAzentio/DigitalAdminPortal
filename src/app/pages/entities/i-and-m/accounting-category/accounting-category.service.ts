import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/shared';
import { AccountingCategory } from './accounting-category.model';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/shared/api/api.service';

@Injectable({ providedIn: 'root'})
export class AccountingCategoryService {
    private resourceUrl = ApiService.API_URL + '/accounting-categories';
    private url=ApiService.API_URL+'/data-grid/accounting-categories';
    // private url=ApiService.API_URL+'/data-grid-controller/datagrid';

    constructor(protected http: HttpClient) { }

    create(accountingCategory: AccountingCategory): Observable<HttpResponse<AccountingCategory>> {
        return this.http.post<AccountingCategory>(this.resourceUrl, accountingCategory, { observe: 'response'});
    }

    update(accountingCategory: AccountingCategory): Observable<HttpResponse<AccountingCategory>> {
        return this.http.put(this.resourceUrl, accountingCategory, { observe: 'response'});
    }

    find(id: number): Observable<HttpResponse<AccountingCategory>> {
        return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    query(req?: any): Observable<HttpResponse<AccountingCategory[]>> {
        const options = createRequestOption(req);
        return this.http.get<AccountingCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    getObservableDataWithoutDeafaultParams(obj) {
        return this.http.post(this.url,
            {
                "queryId": obj.queryId,
                "filterParams": obj.params
            }).pipe(map((res: Observable<Array<any>>) => res));

    }

    
}
