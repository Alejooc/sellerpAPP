import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() position:string='absolute';
  @Input() btnBack:boolean=false;
  @Input() title:string='';
  @Input() bg:boolean=false;
  @Input() btnCart:boolean=true;
  @Input() shadow:boolean=true;
  @Input() btnUser:boolean=false;
  constructor() { }

  ngOnInit() {
    console.log(this.btnBack)
  }

}
