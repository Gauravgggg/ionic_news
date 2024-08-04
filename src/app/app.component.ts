import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit,OnDestroy{
private authsub! : Subscription;
  private previousAuthState= false;
  constructor(private autheservice:AuthService, private router:Router, private platfrom: Platform) {
    this.initalizeApp();
  }
  ngOnInit(): void {
  this.authsub = this.autheservice.UserIsAuthenticated.subscribe(
      isAuth=>{
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.router.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuth;
      }
    )
  }
  onLogout(){
    this.autheservice.Logout();
  }

  initalizeApp(){
  this.platfrom.is('hybrid');
  this.platfrom.ready().then(()=>{
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      SplashScreen.hide();
    }
  })
  }

  ngOnDestroy(): void {
    this.authsub.unsubscribe();
  }
}
