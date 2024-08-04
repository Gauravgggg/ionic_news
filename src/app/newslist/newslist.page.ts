import { BookmarkService } from './../bookmark/bookmark.service';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from './news.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { News } from './news.model';
import { ToastController, AlertController, ActionSheetController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-newslist',
  templateUrl: './newslist.page.html',
  styleUrls: ['./newslist.page.scss'],
})
export class NewslistPage implements  OnInit {
isLoading = false;
  news !: News[];
  skeletonListData: any[] = new Array(5).fill({});
  constructor(private newsService: NewsService, private toastcontroller: ToastController, private activatedRoute: ActivatedRoute, private alertController:AlertController, private actionsheetcrtl: ActionSheetController, private BookmarkService:BookmarkService) { }

  ngOnInit() {
    this.newsService.news.subscribe(news=>{
if (news !== undefined) {
  this.news = news;
}
    })
// this.isLoading= false;
  }

  ionViewWillEnter(){
    this.isLoading =true
    setTimeout(() => {
      this.isLoading=false;
      this.newsService.featchnews().subscribe();
      // this.news = this.newsService.getAllnews();
    }, 1500);

 this.activatedRoute.queryParams.subscribe(params =>{
  if (params['deleted']) {
    this.presentToast('bottom');
  }
})

}

onClickBookmark(newsitem:News){
  newsitem.bookmark = !newsitem.bookmark;
  if (newsitem.bookmark) {
    // this.BookmarkService.bookmarkNews.push(newsitem)
    this.newsService.updatesection(newsitem.id,newsitem.bookmark).subscribe();
    // this.isLoading = true;
    this.BookmarkService.addBooking(newsitem.id,newsitem.newstype,newsitem.title,newsitem.imageurl,newsitem.date,newsitem.description).
    subscribe(()=>{
    })
  }
else{
  // const index = this.BookmarkService.bookmarkNews.findIndex(item => item.id === newsitem.id );
  // if (index !== -1) {
  //   this.BookmarkService.bookmarkNews.splice(index,1);
  // }
  this.newsService.updatesection(newsitem.id,newsitem.bookmark).subscribe();
  // this.BookmarkService.deletenewList(newsitem.id).subscribe();
}

}

onSharenews(){
this.actionsheetcrtl.create({
    header:'Share the News',
    buttons:[
      {
        text:'SnapChat',
        icon:"logo-snapchat",
        handler:()=>{

        }
      },
      {
        text:'Instagram',
        icon:'logo-instagram',
        handler:()=>{

        }
      },
      {
        text:'Whatsapp',
        icon:'logo-whatsapp',
        handler:()=>{

        }
      }
    ]
  }
).then(actionSheetEl=>{
  actionSheetEl.present();
})
}


onDelete(newsid:any,slidingEl:IonItemSliding){
  this.alertController.create(
    {
      header:'Are You sure',
      message:'Do you really want to delete this News?',
      buttons:[
        {
          text:'cancel',
          role:'cancel'
        },
        {
          text:'Delete',
          handler:()=>{
            // this.news.splice(newsid,1);
            this.newsService.deletenewList(newsid).subscribe(
            );
            this.presentToast('bottom');
          // this.news = this.newsService.deletenews()
          }
        }

      ]
    }
  ).then(
    alertEl=>{
    alertEl.present();
    }
  )

}

  async presentToast(position: 'bottom'){
    const toast = this.toastcontroller.create({
      color:'dark',
      message:'News Deleted Successfully',
      duration:2000,
    });
     (await toast).present();
  }


}
