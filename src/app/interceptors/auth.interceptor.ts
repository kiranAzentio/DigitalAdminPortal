import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';
import { tap, switchMap, filter, take } from 'rxjs/operators';
import { ApiService } from '../services/shared/api/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private servicesEndpoint = ApiService.API_URL.replace('api', 'services');

  constructor(private localStorage: LocalStorageService,
     private sessionStorage: SessionStorageService,
     private http: HttpClient) {}

  intercept(request: HttpRequest<any>, next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (
      !request ||
      !request.url ||
      (/^http/.test(request.url) && !request.url.startsWith(ApiService.API_URL) && !request.url.startsWith(this.servicesEndpoint))
    ) {
      return next.handle(request);
    }

    const token = this.localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');
    if (!!token) {
      if(this.isRefreshing){ // refresh token
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token,
            isRefreshToken: 'true'
          },
        });
      }else{
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token,
          },
        });
      }
    }
    // return next.handle(request);
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // alert("401 error--"+this.isRefreshing);
              // // this.handle404Error(request,next);
              // // this.loginService.logout();

              // if(!this.isRefreshing){
              //   this.isRefreshing = true;
              //   this.refreshTokenSubject.next(null);

              //   this.refreshToken().pipe(
              //     switchMap((resp: any) => {
              //       alert("refresh token response"+JSON.stringify(resp));
              //       // this.localStorage.store('authenticationToken', resp.body.id_token);
              //       this.sessionStorage.store('authenticationToken', resp.body.id_token);
              //       this.isRefreshing = false;
              //       this.refreshTokenSubject.next(resp.body.id_token);
              //       return next.handle(this.addToken(request, resp.body.id_token));
              //     }));

              // }else{
              //   return this.refreshTokenSubject.pipe(
              //     filter(token => token != null),
              //     take(1),
              //     switchMap(jwt => {
              //       console.log("sending request after getting fresh token");
              //       this.isRefreshing = false;
              //       this.refreshTokenSubject.next(null);          
              //       return next.handle(this.addToken(request, jwt));
              //     }))
              // }              
            }else{
              // this.isRefreshing = false;
              // this.refreshTokenSubject.next(null);
              return throwError(err);
            }
          }
        }
      )
    );
  }

   addToken(request: HttpRequest<any>, token: string) {    
    return request.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + token
      }
    });
  }

  refreshToken() {
    alert("inside request token ");
    return this.http.get<any>(ApiService.API_URL + '/refreshToken').pipe(tap(
      (event: HttpEvent<any>) => {
    alert("inside request token reponse before passing to switchmap");        
      },
      (err: any) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        return throwError(err);        
      }  
    ));
  }
}

//https://angular-academy.com/angular-jwt/
