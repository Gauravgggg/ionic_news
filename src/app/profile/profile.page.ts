import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor, Plugins} from '@capacitor/core';
import { Directory, Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit{
  @Output() imagepick = new EventEmitter<string>();

  profiledata: Profile[]=[];
  isloading = false;
  editmode= false;
  imageshow = false;
  constructor(private ProfileService: ProfileService, private actionsheet: ActionSheetController, private loadingctrl: LoadingController,private router: Router, private modlctrl: ModalController) { }
  selectimage:any;
  form!: FormGroup;

  ngOnInit() {
    this.oninital();
  }

  ionViewWillEnter(){
    this.ProfileService.featchProfile().subscribe(
      profile=>{
        this.profiledata = profile;
        console.log(this.profiledata);
        this.isloading= true;
        this.editmode= true;
        this.oninital();
      }
    )
if (this.editmode) {
}
this.editmode = false;
  }

  onupdate(){
    let id='';

    this.profiledata.forEach(data=>
      id = data.id,
      )
    this.loadingctrl.create(
      {keyboardClose:true, message:'updating...',duration:1000}
    ).then(
      loadingEl=>{
        loadingEl.present();
      this.ProfileService.updatePofile(id,this.form.value.firstname,this.form.value.lastname,this.form.value.date,this.form.value.image).subscribe(
        data=>{
          loadingEl.dismiss();
          this.router.navigateByUrl('/news/tabs/newslist');
        }
      );

      }
    )
  }

  dismiss(){
    this.modlctrl.dismiss();
  }

  oninital(){
 let firstname ='';
 let lastname='';
 let email='';
 let date = new Date;
 let id='';
let image='';
  this.profiledata.forEach(
    data=>{
      id = data.id;
      firstname = data.firstname;
      lastname = data.lastname;
      email = data.email;
      date = data.date;
      image = data.image;
    }
   )
//   if(date){
//  const date1= date.;
//  console.log(date1)   ;

//   }
  if (image) {
    this.imageshow= true;
    this.selectimage= image;
  }

  this.form = new FormGroup({
    image: new FormControl(image),
    firstname : new FormControl(firstname,{updateOn:'blur',validators:[Validators.required]}),
    lastname: new FormControl(lastname,{updateOn:'blur',validators:[Validators.required]}),
    email: new FormControl({value:`${email}`,disabled:true},{updateOn:'blur',validators:[Validators.required]}),
     date: new FormControl(date,{updateOn:'blur',validators:[Validators.required]})
  }
  )

  }


  async  onPickcamera(){
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing:false,
      resultType: CameraResultType.Uri,
      source:CameraSource.Camera,
      correctOrientation: true,
    });
      this.selectimage =  image.webPath;
      // this.form.patchValue({image: this.selectimage});
      const saveimagefile = await this.savepicture(image);
      this.form.patchValue({image: saveimagefile.webviewpath});
      console.log(saveimagefile);
      this.imageshow = true;
      console.log(this.selectimage);

  //  if (!Capacitor.isPluginAvailable('camera')) {
  //   return;
  //  }
  //  Camera.getPhoto({
  //    quality: 70,
  //    source: CameraSource.Camera,
  //    resultType: CameraResultType.DataUrl,
  //    correctOrientation: true,
  //  }).then((image:any)=>{
  //   this.selectimage = image.base64String;
  //   this.imagepick.emit(image.base54String)
  //  }
  //  ).catch(
  //   (error:any)=>{
  //     console.log(error);
  //     return false;
  //   })
  }

async  SelectPictureFromGallery(){
   const image= await Camera.getPhoto({
      quality:50,
      allowEditing:false,
      resultType: CameraResultType.Uri,
      source:CameraSource.Photos,
      correctOrientation:true,
    });
    this.selectimage =image.webPath;
    const savefile = await this.savepicture(image);
    this.form.patchValue({image: savefile.webviewpath});
    this.imageshow= true;
  }

  async savepicture(photo:Photo){
  const base64Data = await this.readAsBase64(photo);
  const  fileName = Date.now() +'.jpeg';
  const savedFile = Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data
  });
  return{
    filepath: fileName,
    webviewpath: photo.webPath
  };
}

private async readAsBase64(photo: Photo) {
  // Fetch the photo, read as a blob, then convert to base64 format
  const response = await fetch(photo.webPath!);
  const blob = await response.blob();

  return await this.convertBlobToBase64(blob) as string;
}

private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});
  // onSelectimage(){
  //   Camera.
  // }


  oncamerasheet(){
this.actionsheet.create({
buttons:[
 {
  text:'click picture',
  icon:'camera',
  handler:()=>{
    this.onPickcamera();
  }
 },
 {
  text:'select picture from gallery',
  icon:'images-outline',
  handler:()=>{
    this.SelectPictureFromGallery();
  }
 },
 {
  text:'Remove image',
  icon:'images-outline',
  handler:()=>{
    this.imageshow= false;
  }
 },
 {
  text:'cancle',
  icon:'close-circle',
  cssClass: 'cancle',
  handler:()=>{

  }
 }
]
}).then(
actionsheetEl=>{
  actionsheetEl.present();
}
)
  }

}
