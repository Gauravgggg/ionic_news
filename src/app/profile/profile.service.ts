import { AuthService } from './../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Profile } from './profile.model';
import { User } from '../auth/user.model';

interface profiledata{
 email:	string,
firstname:string,
 lastname:string,
 date:Date,
 UId:any,
 image:any,
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _Profile = new BehaviorSubject<Profile[]>([]);

get Profile(){
  return this._Profile.asObservable();
}


  constructor(private http: HttpClient,private authService: AuthService) { }

  // profile(userdata:User){
  //   let featchuserid: any;
  //   this.authService.userId.pipe(take(1),switchMap(userid=>{
  //     if (!userid) {
  //       new Error
  //     }
  //     featchuserid = userid;
  //   return this.authService.token;
  //   }),
  //   take(1),switchMap(userdata=>{

  //   }))
  // }

// getuserid(){
//   this.authService.userId.pipe(
//     take(1),
//     switchMap(userid=>{
//       if (!userid) {
//         return throwError(new Error('no user id!'))
//       }
//       return this.authService.userId;
//     }), take(1),

//   )
// }

  addprofle(firstname:string,lastname:string, email:string, dateofBirth:Date){
    let featchuserid:any;
    let generateId: any;
    let newporfile: Profile;
     return  this.authService.userId.pipe(
      take(1),
    switchMap(userId =>{
      if (!userId) {
        return throwError(new Error('No user id!'));
      }
      featchuserid = userId;
      return this.authService.token;
    }),
    take(1),
    switchMap(token=>{
      const profile = new Profile(Math.random.toString(),email,firstname,lastname,dateofBirth,featchuserid,null)
      return  this.http.post<{name:string}>(`https://ion-news-task-default-rtdb.firebaseio.com/Profile.json?auth=${token}`,
      {...profile, id:null}
      )
}),
switchMap(resdata=>{
  generateId = resdata.name;
  return this.Profile
}),take(1),
tap(Profile=>{
  newporfile.id = generateId;
  this._Profile.next(Profile.concat(newporfile));
})
)
}


  featchProfile(){
  let featchuserid: string;
  return this.authService.userId.pipe(take(1),switchMap(userid=>{
    if (!userid) {
      return throwError(new Error('no user id!'));
    }
    featchuserid = userid;
    return this.authService.token;
  }),
  take(1),
  switchMap(token=>{
   return this.http.get<{[key:string]:profiledata}>(`https://ion-news-task-default-rtdb.firebaseio.com/Profile.json?orderBy="UId"&equalTo="${featchuserid}"&auth=${token}`)
  }),
  map(
    profileData=>{
    const profileadd = [];
    for(const key in profileData){
  if (profileData.hasOwnProperty(key)) {
    profileadd.push(new Profile(key,profileData[key].email,profileData[key].firstname,profileData[key].lastname,profileData[key].date,profileData[key].UId,profileData[key].image))
  }
}
return profileadd;
}
),tap(
 profiledata=>{
  this._Profile.next(profiledata);
 }
))

}

updatePofile(profileid:string,firstname:string, lastname:string ,dateofBirth:Date,image:any){
  let updateprofile: Profile[];
  let featchtoke: string | null;
return this.authService.token.pipe(take(1),switchMap(
  token=>{
  featchtoke = token;
  return this._Profile;
  }
),take(1),
switchMap(profile=>{
  if (!profile || profile.length <= 0) {
    return  this.featchProfile();
  }
  else{
    return of(profile);
  }
}),switchMap(profile=>{
  const updateprofileindex = profile.findIndex(pr=> pr.id === profileid);
  const updateprofile = [...profile];
  const old = updateprofile[updateprofileindex];
  updateprofile[updateprofileindex] = new Profile(old.id,old.email,firstname,lastname,dateofBirth,old.UId,image);
  return this.http.put(`https://ion-news-task-default-rtdb.firebaseio.com/Profile/${profileid}.json?auth=${featchtoke}`,
  {...updateprofile[updateprofileindex],id: null}
  );
}),
tap(()=>{
  this._Profile.next(updateprofile);
}))
}

}


