import { Profile } from './../profile/profile.model';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthResponseData, AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Observable,  Subscriber } from 'rxjs';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  // form!: FormGroup;
  isloading = false;
  showPassword = false;
  confirmShowPassword = false;
  isshowpasswordlogin = false;
  isloginmode=false;
  selectedgender:any;
  selecteddate!:Date;
  gender= [{id:1,value:'Male'},{id:2,value:'Female'}];
  isLogin = false;
  // isLogin = 'login';
  profile!: Profile;
  constructor(private authservice:AuthService, private profileservice:ProfileService,private router:Router, private alertCtrl:AlertController, private modalctrl: ModalController,private laodingctrl:LoadingController) { }

  ngOnInit() {
    // this.form =new FormGroup({
    //   email: new FormControl(null,{updateOn:'blur', validators:[Validators.required, Validators.maxLength(50)]}),
    //   emailsingup: new FormControl(null,{updateOn:'blur', validators:[Validators.required, Validators.maxLength(50)]}),
    //   password: new FormControl(null, {updateOn:'blur', validators: [Validators.required,Validators.minLength(5), Validators.maxLength(50)] }),
    //   passwordsingup: new FormControl(null, {updateOn:'blur', validators: [Validators.required,Validators.minLength(5), Validators.maxLength(50)] }),
    //   firstname: new FormControl(null,{updateOn:'blur',validators:[Validators.required, Validators.min(3), Validators.max(50), Validators.pattern('^[a-zA-Z]*$')]}),
    //   lastname: new FormControl(null,{updateOn:'blur',validators:[Validators.required, Validators.min(3), Validators.max(50), Validators.pattern('^[a-zA-Z]*$')]}),
    //   date: new FormControl(null,{updateOn:'blur',validators:[Validators.required]}),
    //   Gender: new FormControl(null,{updateOn:'blur'}),
    //   Repassword: new FormControl(null,{updateOn:'blur'})
    // })
  }

  togglePasswordVisibility(){
    this.showPassword= !this.showPassword;
  }

  toggleConfirmShow(){
    this.confirmShowPassword = !this.confirmShowPassword;
  }

  onshowpasswordlogin(){
    this.isshowpasswordlogin = !this.isshowpasswordlogin;
  }

  onshowpassword(){

  }

  authenticate(email:string,password:string, firstname:string, lastname:string,date:Date,gender:any,){
    this.isloading = true;
    this.laodingctrl.create({keyboardClose:true, message:'Logging in...'})
    .then(
      laodingEl=>{
        laodingEl.present();
        let authobs : Observable<AuthResponseData>;
        if (this.isLogin) {
          authobs = this.authservice.Login(email,password);
        }
        else{
        authobs = this.authservice.singup(email,password,firstname,lastname,date,gender);
        }
       authobs.subscribe(resData=>{
        this.isloading = false;
        laodingEl.dismiss();
        this.router.navigateByUrl('/news/tabs/newslist');
        if (!this.isLogin) {
          this.profileservice.addprofle(firstname,lastname,email,date).subscribe();
        }
       },errRes=>{
        const code = errRes.error.error.message;
        let message ='could not signup you up , please try again.';
        if (code === 'EMAIL_EXISTS') {
          message = 'This email address exits already!';
        }
        else if(code === 'EMAIL_NOT-FOUND'){
          message='Email address could not found.';
        }
        else if(code === 'INVALID_PASSWORD:'){
          message = 'This password is not correct.';
        }
        laodingEl.dismiss();
      this.ShowAlert(message);
       }
       );
      }
    )
  }

  onSubmit(f:NgForm){
 const email = f.value.email;
 const password = f.value.password;
 const firstname = f.value.firstname;
 const lastname = f.value.lastname;
 const date = this.selecteddate;
 const gender= f.value.gender;
console.log(date);

 this.authenticate(email,password,firstname,lastname,date,gender);

  }

  private ShowAlert(message:string){
    this.alertCtrl.create({header:'Authentication fail',message: message,buttons:['Okay']}).then(
      alertEl=>
        alertEl.present()
    )
   }
  onSwitchMode(){
    // this.isLogin = (this.isLogin === 'login') ? 'signup' : 'login';
    this.isLogin = !this.isLogin;
  }
  checkPasswords(form:NgForm){
    const password = form.value.password;
    const confirmpassword = form.value.retype-password;
    return password === confirmpassword;
}

dismiss(){
  this.modalctrl.dismiss();
}
  }


