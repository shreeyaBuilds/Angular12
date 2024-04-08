import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public currentModeSubject: BehaviorSubject<string>;
  public currentMode: Observable<string>;
  public mode: string;


  constructor() {
    this.mode = "viewMode";
    this.currentModeSubject = new BehaviorSubject<string>(this.mode);
    this.currentMode = this.currentModeSubject.asObservable();
  }

  public get currentModeValue(): string {
    return this.currentModeSubject.value;
  }

}
