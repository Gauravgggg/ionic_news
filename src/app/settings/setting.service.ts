import { Injectable } from '@angular/core';
import { setting } from './setting.model';
import { BehaviorSubject, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  Intrest : setting[]=[
    {
      id:'01',
      pic:'data:image/jpeg;base64,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',
      name: 'Aluminum'
    },
    {
      id:'02',
      pic:'data:image/jpeg;base64,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',
      name: 'Aluminum'
    }
  ];

  private _section= new BehaviorSubject<setting[]>([]);

  get Section(){
   return this._section.asObservable();
  }
  constructor() { }

  getAllintrest(){
   return [...this.Intrest]
  }
}
