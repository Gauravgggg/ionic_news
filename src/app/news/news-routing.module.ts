import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsPage } from './news.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: NewsPage,
    children:[
      {
        path: 'newslist',
        children:[
        {
          path: '',
          loadChildren: () => import('./../newslist/newslist.module').then( m => m.NewslistPageModule)
        },
        {
          path: ':newsId',
          loadChildren: () => import('./../newslist/newsdetail/newsdetail.module').then( m => m.NewsdetailPageModule)
        }
      ]

      },
      {
        path: 'settings',
        children:[
          {
            path:'',
            loadChildren: () => import('./../settings/settings.module').then( m => m.SettingsPageModule)
          }

        ]

      },

    ]
  },
  {
    path:'',
    redirectTo:'/news/tabs/newslist',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsPageRoutingModule {}
