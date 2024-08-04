import { BookmarkService } from './bookmark.service';
import { NewsService } from './../newslist/news.service';
import { Component, OnInit } from '@angular/core';
import { News } from '../newslist/news.model';
import { Bookmark } from './bookmark.model';
import { AlertController, IonItemSliding, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.page.html',
  styleUrls: ['./bookmark.page.scss'],
})
export class BookmarkPage implements OnInit {

  bookmark: Bookmark[]=[];
  isloading = false;
  constructor(private bookmarkService:BookmarkService,private activatedrouter: ActivatedRoute,private alertctroller: AlertController, private toastcontroller:ToastController) { }

  ngOnInit() {
    //  this.bookmark = this.bookmarkService.getdata();
    this.bookmarkService.bookmark.subscribe(bookmark=>{
      this.bookmark = bookmark;
    }
    )
  }


  ionViewWillEnter(){
    this.bookmarkService.featchBooking().subscribe(
      bookamrk=>{
        this.bookmark = bookamrk;
        console.log(this.bookmark);


      }

     )

 this.activatedrouter.queryParams.subscribe(params =>{
  if (params['deleted']) {
    this.presentToast('bottom');
  }
})
  }

  onDelete(bookmarkid:any,slidingEl:IonItemSliding){
    this.alertctroller.create(
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
            this.bookmarkService.deletenewList(bookmarkid).subscribe(
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
      message:'Deleted Successfully',
      duration:2000,
    });
     (await toast).present();
  }


}
