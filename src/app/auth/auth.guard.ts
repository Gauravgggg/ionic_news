import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap, take, takeWhile, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService:AuthService,private router:Router){}
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
return this.authService.UserIsAuthenticated.pipe(take(1),switchMap(
  isAuthenticate=>{
    if (!isAuthenticate) {
      return this.authService.autoLogin();
    }else{
      return of(isAuthenticate)
    }
  }
),tap(isAuthenticate=>{
    if (!isAuthenticate) {
      this.router.navigateByUrl('/auth');
    }
  })
)

  }

}
