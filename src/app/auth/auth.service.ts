import { Token } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, from, map, switchMap, take, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../profile/profile.service';
import { Firestore } from '@angular/fire/firestore';
import { Preferences } from '@capacitor/preferences';
export interface AuthResponseData{
  idToken:string;
  email:string;
  refreshToken: string;
  expiresIn: string;
  localId:string;
  firstname:string,
  lastname:string
  date:Date,
  gender:any,
}


@Injectable({
  providedIn: 'root'
})



export class AuthService {

  private _user = new BehaviorSubject<User | null>(null);
  private activeLogoutTimer:any;

  constructor(private http: HttpClient) { }
  get UserIsAuthenticated(){
    return this._user.asObservable().pipe(map(user=>{
     if (user) {
      return !!user.token;
     }else{
      return false;
     }
    }
      ));
  }
get userId(){
  return this._user.asObservable().pipe(map(user=>{
    if (user) {
      return user.id;
    }
    else{
      return null;
    }
  }));
}
  get token(){
    return this._user.asObservable().pipe(
      map(
        User=>{
          if (User) {
            return User.token;
          }else{
            return null;
          }
        }
      )
    )
  }

  userData(idToken:string,displayname:string){
   return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.firebaseAPIkey}`,{
     idToken: idToken,
     displayname:displayname,
     returnSecureToken: true,
    }).pipe(tap(this.setUserData.bind(this))
)
}

singup(email:string,password:string,firstname:string,lastname:string,date:Date,gender:any){
   return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIkey}`,{
         email : email,
         password: password,
       returnSecureToken:true,
       firstname:firstname,
       lastname:lastname,
       date:date
       }).pipe(
        tap(this.setUserData.bind(this))
       )

      }


  autoLogin(){
   return from(Preferences.get( {key:'authData'})).pipe(map(
      storeData=>{
        if (!storeData || !storeData.value) {
          return null;
        }
        const parsedData=  JSON.parse(storeData.value) as {token:string, tokenExpirationDate:string,userId:string,email:string};
        const exprationTime = new Date(parsedData.tokenExpirationDate);
        if (exprationTime <= new Date()) {
          return null;
        }
        const user = new User(parsedData.userId,parsedData.email,parsedData.token,exprationTime);
        return user;
      }
    ),tap(user=>{
      if (user) {
        this._user.next(user);
        this.autoLogout(user.tokenDuration);
      }
    }
    ),map(
      user=>{
        return !!user;
      }
    ))
  }

  Login(email:string,password:string){
   return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIkey}`,{
      email:email,
      password:password,
      returnSecureToken:true,
    }).pipe(tap(this.setUserData.bind(this)))
  }

  // Login(email:string,password:string){
  //   return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIkey}`,{
  //      email:email,
  //      password:password,
  //      returnSecureToken:true,
  //    }).pipe(switchMap((userdata:AuthResponseData)=>{
  //     return this.getUserProfileAfterSignup(userdata.localId).pipe(
  //       tap(
  //         (userprofile:any)=>{
  //           this.setUserData(userdata,userprofile)
  //         }
  //       )
  //     )
  //         })
  //         )
  //  }

  Logout(){
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Preferences.remove({key:'authData'});
  }

  autoLogout(duration:number){
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  this.activeLogoutTimer = setTimeout(()=>{
    this.Logout();
  },duration)
  }

  private setUserData(userData: AuthResponseData){
   let userProfile: any;
    const firstname = userData.firstname;
    const lastname = userData.lastname;
    const date = userData.date;
    const email = userData.email;
    const expirationTime =new Date( new Date().getTime() + (+userData.expiresIn *1000));
    const user=  new User(userData.localId,userData.email, userData.idToken,expirationTime)
      this._user.next(user);
      this.autoLogout(user.tokenDuration);
      this.storeAuthData(userData.localId,userData.idToken,expirationTime.toISOString(),userData.email);
  }


  private storeAuthData(userId:string,token:string,tokenExpirationDate:string,email:string){
const data =JSON.stringify({userId:userId, token:token, tokenExpirationDate:tokenExpirationDate,email:email})
Preferences.set({key:'authData',value:data})
// this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${environment.firebaseAPIkey}&auth=${token}`,{
//   idToken: userId,
// }).subscribe()
}


postUserProfile(userId: string, userProfileData: AuthResponseData): Observable<any> {
  const url = `https://ion-news-task-default-rtdb.firebaseio.com/user-profiles.json/${userId}`;
  return this.http.post<AuthResponseData>(url, userProfileData);
}

getUserProfileAfterSignup(localId: string): Observable<any> {
  const url = `${environment.url}/user-profiles/${localId}`;
  return this.http.get<any>(url);
}

// private storeUserData(userData:any){
// return this.firestore.collection('users').doc(userData.id).set(userData);
// }

}
