import { NewslistPage } from './../newslist.page';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { News } from '../news.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../news.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-newsdetail',
  templateUrl: './newsdetail.page.html',
  styleUrls: ['./newsdetail.page.scss'],
})
export class NewsdetailPage implements OnInit, OnDestroy {

  loadnews!: News;
  newssub !: Subscription;
  isloading =false;
  BookmarkService: any;
  constructor(private navController: NavController , private toastcontroller:ToastController,private activtedRoute: ActivatedRoute, private newsservice: NewsService, private altercontrol: AlertController, private router: Router, private navcontroller: NavController,private alertController: AlertController) { }

ngOnInit() {
    this.activtedRoute.paramMap.subscribe(
      paraMap =>{
        if (!paraMap.has('newsId')) {
          this.navController.navigateBack('news/tabs/newslist');
          return;
        }
        this.isloading = true;
        const newsId = paraMap.get('newsId');
        if (newsId) {
         this.newssub =  this.newsservice.getnews(newsId).subscribe(Data=>{
            this.loadnews = Data;
              this.isloading = false;
          },error=>{
            this.alertController.create({header:'An Error occured!',
          message: 'Could not load place',
          buttons:[{text:'okay',handler:()=>{
            this.router.navigate(['/news/tabs/newslist'])
          }}]
        }).then(
          alertEl=>{
            alertEl.present();
          }
        )
          })
        }


      }
    );
  }

  onDeletenews(){
    this.altercontrol.create(
      {
        header:'Are you sure',
        message:'Do you really want to delete this news?',
        buttons:[
          {
            text: 'cancle',
            role: 'cancel'
          },
          {
            text:'Delete',
            handler:()=>{
              // this.newsservice.deletenews(this.loadnews.id);
              this.newsservice.deletenewList(this.loadnews.id).subscribe();
              this.navcontroller.navigateBack(['/'],{
                queryParams: {deleted: true}
              });
              this.presentToast('bottom');
            }
          }
        ]
      }
    ).then(alertEl=>{
      alertEl.present();
    })

  }

  onclickbookmark(newsitem:News){
       this.newsservice.getnews(this.loadnews.id);
       if (newsitem.bookmark) {
        // this.BookmarkService.bookmarkNews.push(newsitem)
        this.newsservice.updatesection(newsitem.id,newsitem.bookmark).subscribe();
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
      this.newsservice.updatesection(newsitem.id,newsitem.bookmark).subscribe();
      // this.BookmarkService.deletenewList(newsitem.id).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.newssub.unsubscribe();
  }


  async presentToast(position: 'bottom'){
    const toast = this.toastcontroller.create({
      color:'success',
      message:'News Deleted Successfully',
      duration:2000,
    });
     (await toast).present();
  }

}



