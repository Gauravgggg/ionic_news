import { Injectable } from '@angular/core';
import { News } from '../newslist/news.model';
import { HttpClient } from '@angular/common/http';
import { Bookmark } from './bookmark.model';
import { BehaviorSubject, map, switchMap, take, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface BookmarkData{

date:string,
description:string,
imageurl:string,
newstype:string,
title:string,
userId:string
}

@Injectable({
  providedIn: 'root'
})

export class BookmarkService {

private _bookmark = new BehaviorSubject<Bookmark[]>([]);

get bookmark(){
  return this._bookmark.asObservable();
}
  constructor(private http: HttpClient,private authservice:AuthService) { }

  // getdata(){
  //   return[...this.bookmarkNews];
  // }

  addBooking(id:string,newstype:string,title:string,imageurl:string,date:string,description:string){
    let generateId:string;
    let featchuserid:string;
    let newBookmark: Bookmark;
  return  this.authservice.userId.pipe(take(1),switchMap(userId =>{
      if (!userId) {
        return throwError(new Error('No user id!'));
      }
      featchuserid = userId;
      return this.authservice.token;
    })
    ,take(1),
    switchMap(token=>{
    const NewBookmark = new Bookmark(Math.random().toString(),newstype,title,imageurl,date,description,featchuserid);
      return  this.http.post<{name:string}>(`https://ion-news-task-default-rtdb.firebaseio.com/bookmark.json?auth=${token}`,
      {...NewBookmark, id:null}
      )
    }),
      switchMap(resdata=>{
        generateId = resdata.name;
        return this.bookmark;
      }),take(1),
      tap(bookmark=>{
        newBookmark.id = generateId;
        // newBookmark.id = id;
        this._bookmark.next(bookmark.concat(newBookmark));
      })
    )
  }


  deletenewList(id:any){
    let featchuserid;
    return  this.authservice.userId.pipe(take(1),switchMap(userId =>{
      if (!userId) {
        return throwError(new Error('No user id!'));
      }
      featchuserid = userId;
      return this.authservice.token;
    }),take(1),switchMap(token=>{
        return  this.http.delete(`https://ion-news-task-default-rtdb.firebaseio.com/bookmark/${id}.json?auth=${token}`)
      }),switchMap(()=>{
        return this.bookmark;
      }),take(1),tap(
        news=>{
          this._bookmark.next(news.filter(b=> b.id !== id));
        }
      ))
      // this.newslist.splice(id,1);
    }



  featchBooking(){
    let featchuserid:string
    return this.authservice.userId.pipe(take(1), switchMap(userId =>{
    if (!userId) {
    return throwError(new Error('No user present!'));
  }
   featchuserid = userId;
   return this.authservice.token;

    }),take(1),switchMap(token=>{
      return  this.http.get<{[key:string]: BookmarkData}>(`https://ion-news-task-default-rtdb.firebaseio.com/bookmark.json?orderBy="userId"&equalTo="${featchuserid}"&auth=${token}`)
    }),
      map(
        bookmarkdata=>{
          const bookmark = [];
          for(const key in bookmarkdata){
            if (bookmarkdata.hasOwnProperty(key)) {
              bookmark.push(new Bookmark(key,bookmarkdata[key].newstype,bookmarkdata[key].title,bookmarkdata[key].imageurl,bookmarkdata[key].date,bookmarkdata[key].description,bookmarkdata[key].userId))
            }
          }
          return bookmark;
        }
      ),
      tap(
        bookmarkdata =>{
          this._bookmark.next(bookmarkdata);
        }
      )
    )

  }
}



