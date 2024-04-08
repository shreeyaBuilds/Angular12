import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public today: Date;
  public time: number;

  constructor() {
    this.today = new Date();
    this.time = this.today.getTime();
    setInterval(() => { this.today = new Date; }, 60000);
  }
  ngOnInit(): void {
  }
}

