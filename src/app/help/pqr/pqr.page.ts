import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pqr',
  templateUrl: './pqr.page.html',
  styleUrls: ['./pqr.page.scss'],
})
export class PqrPage implements OnInit {
  created:boolean=true;
  read:boolean=false;
  constructor() { }

  ngOnInit() {
  }

}
