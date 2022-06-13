import { HttpClient, HttpParams,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public static API_URL = environment.apiUrl;

  constructor(public http: HttpClient) {}

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(ApiService.API_URL + '/' + endpoint, reqOpts);
  }

  post1(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(ApiService.API_URL + '/' + endpoint, body, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(ApiService.API_URL + '/' + endpoint, body, { observe: 'response'});
}

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(ApiService.API_URL + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(ApiService.API_URL + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(ApiService.API_URL + '/' + endpoint, body, reqOpts);
  }
 
 
  getHomeScreenData(DUMMY_JSON_URL?:string): Observable<HttpResponse<any[]>> {
    if(DUMMY_JSON_URL){
        console.log("===========================================");
        console.log("===========================================");
        console.log("===========================================");
        console.log("============GET DUMMY SCREEN JSON DATA============");
        console.log("===========================================");
        console.log("===========================================");
        console.log("===========================================");
        
        return this.http.get<any[]>(`assets/dummyJsonData/${DUMMY_JSON_URL}.json`, { observe: 'response'});
    }else{
        //real api data
        return this.http.get<any[]>(`${ApiService.API_URL}/get-home-screen-data`, { observe: 'response'});

    }
}
}
