import { NewsService } from './../newslist/news.service';
import { SettingService } from './setting.service';
import { Component, OnInit } from '@angular/core';
import { setting } from './setting.model';
import { News } from '../newslist/news.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  intrest!: setting[];
  selectall= false;
  selectedSegment: string = 'interests';
sections!: News[];
  constructor(private SettingService: SettingService, private newsService:NewsService) { }


  ngOnInit() {
  }

  ionViewWillEnter(){
    this.intrest = this.SettingService.getAllintrest()
    this.newsService.featchnews().subscribe(data=>{
      this.sections = data;
    });
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  onselectall(){
    this.selectall = !this.selectall;
    this.sections.forEach(section=> section.check = this.selectall);
  }
  checkSelectAll() {
    this.selectall = this.sections.every(section => section.check);
  }
}
