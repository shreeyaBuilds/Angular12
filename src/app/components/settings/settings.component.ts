import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SettingsService } from 'src/app/_services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public active: string;
  public currentUser!: User;
  public fullName: String;
  public mode: string;
  public modeTitle: string;

  constructor(private authenticationService: AuthenticationService, private router: Router, private settingsService: SettingsService) {
    this.active = 'profile';
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    })
    this.fullName = this.currentUser?.fname + " " + this.currentUser?.lname;

    this.mode = this.settingsService.currentModeValue;
    this.modeTitle = '';
    this.settingsService.currentMode.subscribe(x => {
      this.mode = x;
    })
    this.getModeTitle()

  }


  ngOnInit(): void {
    this.getModeTitle();
  }

  changeToEditMode() {

    if (this.mode == "viewMode") {
      this.settingsService.currentModeSubject.next("editMode")
      this.mode = "editMode";
    }
    else {
      this.settingsService.currentModeSubject.next("viewMode")
      this.mode = "viewMode";
    }
    this.getModeTitle();
  }


  onNavChange(changeEvent: NgbNavChangeEvent) {
    this.settingsService.currentModeSubject.next("viewMode")
    this.mode = "viewMode";
    this.getModeTitle();

  }

  getModeTitle() {
    if (this.mode == "viewMode")
      this.modeTitle = "View Mode";
    else
      this.modeTitle = "Edit Mode";
    return this.modeTitle;
  }
}

