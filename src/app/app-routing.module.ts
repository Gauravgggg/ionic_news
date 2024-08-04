import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes =[
  {
    path:'',
    redirectTo: 'news',
    pathMatch: 'full'},
    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
    },
      {
    path: 'news',
    loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule),canLoad:[AuthGuard]
  },
  {
    path: 'bookmark',
    loadChildren: () => import('./bookmark/bookmark.module').then( m => m.BookmarkPageModule), canLoad:[AuthGuard]
  },
  {
    path:'Profile',
    loadChildren:()=> import('./profile/profile.module').then(m=>m.ProfilePageModule), canLoad:[AuthGuard]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
