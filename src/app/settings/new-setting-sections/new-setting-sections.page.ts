import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsService } from './../../newslist/news.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { min } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-setting-sections',
  templateUrl: './new-setting-sections.page.html',
  styleUrls: ['./new-setting-sections.page.scss'],
})
export class NewSettingSectionsPage implements OnInit {
  mindate!:any;
  constructor(private newsService: NewsService, private router:Router, private modlectrl: ModalController) {
    this.mindate =new Date().toISOString();
  }
  form!: FormGroup;
  // dateValue!:string;

  dismiss(){
    this.modlectrl.dismiss();
  }
  ngOnInit() {

    this.form = new FormGroup({
      newstype: new FormControl(null,{updateOn:'blur',validators:[Validators.required]}),
      title: new FormControl(null,{updateOn:'blur', validators:[Validators.required]}),
      imageurl: new FormControl(null,{updateOn:'blur', validators:[Validators.required]}),
      date: new FormControl(null,{updateOn:'blur',validators:[Validators.required]}),
      description: new FormControl(null,{updateOn:'blur',validators:[Validators.required]})
  })
  }

onsubmit(){
  this.newsService.addnewssection(this.form.value.newstype, this.form.value.title, this.form.value.imageurl, this.form.value.date, this.form.value.description).subscribe();
  console.log(this.form.value);
this.form.reset();
this.router.navigateByUrl('/news/tabs/settings');
}

// formatDate(date: any): any {
//   const formattedDate = new Date(date).toLocaleDateString('en-US');
//   return formattedDate;
// }
}
