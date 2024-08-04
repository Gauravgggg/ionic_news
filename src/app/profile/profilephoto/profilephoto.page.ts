import { Profile } from './../profile.model';
import { ProfileService } from './../profile.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profilephoto',
  templateUrl: './profilephoto.page.html',
  styleUrls: ['./profilephoto.page.scss'],
})
export class ProfilephotoPage implements OnInit {

  constructor(private ProfileService: ProfileService) { }
Profilephotodata:Profile[]=[];
profileimage: any;
editimage= false;
  ngOnInit() {
    this.imageinit()

  }

  ionViewWillEnter(){
    this.ProfileService.featchProfile().subscribe(
      profile=>{
        this.Profilephotodata = profile;
        this.editimage =true;
        this.imageinit();
      }
    )


  }

  imageinit(){
    this.Profilephotodata.forEach(
      data =>{
        this.profileimage = data.image;
      }
    )
  }

}
