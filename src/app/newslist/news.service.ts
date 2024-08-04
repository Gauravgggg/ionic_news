import { Bookmark } from './../bookmark/bookmark.model';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { News } from './news.model';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, map, of, retry, switchMap, take, tap } from 'rxjs';
import { NewsPage } from '../news/news.page';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Token } from '@angular/compiler';
interface NewsData{
 userid:string,
 newstype:string,
 title:string,
 imageurl:string,
 date:string,
 description:string,
 bookmark:boolean
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {


//  private newslist: News[]=[
// new News(
//   '01',
//   'News RoundUp',
//   'The new architecture wars',
//   'https://images.aeonmedia.co/images/0adf4fcb-5015-48da-97d7-84e673f8ae33/original.jpg?width=640&quality=75&format=auto',
//   '02-1-2023',
//  'The ultramodern architecture bubble has burst. Today, in much of the world, new public buildings are no longer designed by the ‘starchitects’ who dominated in the late 1990s and 2000s, including Zaha Hadid, Herzog & de Meuron, Rem Koolhaas and Frank Gehry. Cities are no longer filling with vaulting, flowing, gooey, non-orthogonal buildings engineered through advanced computing power. Architecture has been hit by a new sobriety. Tradition, apparently, is back.',
// ),new News(
//   '02',
//   'OUTLOOK',
//   'The geometry of other people',
//   'https://images.aeonmedia.co/user_image_upload/2820/insert-Estatesgeneral.jpg?width=1080&quality=75&format=auto',
//   '02-1-2023',
//   'On the surface, the language we use to describe landscapes and buildings has little in common with the ways we think about our social worlds. A mountain range has little in common with a family; the design of a city is nothing like a colleague – or so it seems. But if that is true, then why do we use spatial and architectural metaphors to describe so many of our human relationships? Good, trusted friends are described as ‘close’, regardless of their physical proximity, and a loved one on the other side of the world may feel ‘nearer’ to you than someone you live with. You might have an ‘inner circle’ of friends or feel ‘left out’ from the circles of others. A colleague with ‘higher’ status may seem to be ‘above’ you and those with ‘lower’ status may be ‘below’. There is even something architectural about the way we speak of ‘setting boundaries’ or ‘walling someone off’.',
// )
// ]
  constructor(private altercontrol: AlertController, private http: HttpClient, private authservice:AuthService) { }
  private _newlist = new BehaviorSubject<News[]>([]);

  get news(){
    return this._newlist.asObservable();
  }


  // getAllnews(){
  //   return[...this.newslist]
  // }


  getnews(id:string){
    // return{
    //   ...this.newslist.find(
    //     news=>{
    //       return news.id === newsId;
    //     }
    //   )
    // }
    return this.authservice.token.pipe(take(1),switchMap(token=>{
      return this.http.get<NewsData>(`https://ion-news-task-default-rtdb.firebaseio.com/newslist/${id}.json?auth=${token}`)
    }),
      map(newsdata=>{
      return new News(id,newsdata.newstype,newsdata.title,newsdata.imageurl,new Date(newsdata.date),newsdata.description,newsdata.userid, newsdata.bookmark);
      })
    )
  }

  addnewssection(newstype:any, title:any,imageurl:any, date:any, description:any){
    let generateId: string;
    let featchuserid :string | null;
    let newNews:News;
 return   this.authservice.userId.pipe(take(1),switchMap(userId=>{
      featchuserid = userId;
    return this.authservice.token;
    }),take(1),switchMap(
      token=>{
        if (!featchuserid) {
          throw new Error('no user Found!');
        }
        newNews= new News(Math.random().toString(), newstype, title, imageurl, date, description,featchuserid,false);
        return this.http.post<{name:string}>(`https://ion-news-task-default-rtdb.firebaseio.com/newslist.json?auth=${token}`,{...newNews,id:null})
      }
    ),
      switchMap(resData=>{
        generateId = resData.name;
        return this.news;
      }),
      take(1),
      tap((newset =>{
        newNews.id = generateId;
        this._newlist.next(newset.concat(newNews));
      })
    )
  )
  }

  updatesection(id:string,Bookmark:boolean){
    let generateId: string;
    let featchtoke :string | null;
    let newNews:News[];
 return   this.authservice.token.pipe(take(1),
  switchMap(
    token=>{
      featchtoke = token;
      return this._newlist;
      }
    ),take(1),
    switchMap(news=>{
      if (!news || news.length <= 0) {
        return  this.featchnews();
      }
      else{
        return of(news);
      }
    }),switchMap(
      news=>{
        const sectionindex = news.findIndex(pr=> pr.id === id);
        const updatenews = [...news];
        const old = updatenews[sectionindex];
        updatenews[sectionindex]= new News(old.id,old.newstype, old.title,old.imageurl, old.date, old.description,old.userId,Bookmark);
        return this.http.put<{name:string}>(`https://ion-news-task-default-rtdb.firebaseio.com/newslist/${id}.json?auth=${featchtoke}`,{...updatenews[sectionindex],id:null})
      }
    ),

tap(()=>{
  this._newlist.next(newNews);
})
  )
  }


  featchnews(){
   return this.authservice.token.pipe(take(1),switchMap(token=>{
      return this.http.get<{[key:string]:NewsData }>(`https://ion-news-task-default-rtdb.firebaseio.com/newslist.json?auth=${token}`)
    }),map(resData=>{
      const Newslist= []
      for(const key  in resData){
        if (resData.hasOwnProperty(key)) {
          Newslist.push( new News( key, resData[key].newstype, resData[key].title, resData[key].imageurl , resData[key].date, resData[key].description,resData[key].userid,resData[key].bookmark))
        }
      }
      return Newslist;
    }),
    tap(news=>{
      this._newlist.next(news);
    })
    );
  }

  // deletenews(newsId:string){

  //   this.newslist = this.newslist.filter(
  //   news=>{
  //     return news.id !== newsId;
  //   }
  // )
  // }


  deletenewList(id:any){
  return  this.authservice.token.pipe(take(1),switchMap(token=>{
      return  this.http.delete(`https://ion-news-task-default-rtdb.firebaseio.com/newslist/${id}.json?auth=${token}`)
    }),switchMap(()=>{
      return this.news;
    }),take(1),tap(
      news=>{
        this._newlist.next(news.filter(b=> b.id !== id));
      }
    ))
    // this.newslist.splice(id,1);
  }

}
