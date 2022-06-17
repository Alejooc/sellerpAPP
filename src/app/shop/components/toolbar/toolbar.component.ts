import { Component, OnInit,Input } from '@angular/core';
import { PagemodalService } from "../modal-comp/pagemodal.service";
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { StorageService } from "../../../services/storage/storage.service";
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
  @Input() md:boolean=false;
  @Input() btnLoggout:boolean=false;
  @Input() btnHelp:boolean=false;

  
  act:any;
  constructor(public pg:PagemodalService,private router:Router,private storge:StorageService) { }

  ngOnInit() {
  }
  public get dismiss() : any {
    return this.pg.dismiss();
  }

  back(){
    if (this.md) {
      this.dismiss;
    }else{
      this.router.navigate(['/']);

    }
  }
  async loggout(){
    await this.storge.removeKey('userData');
   this.router.navigate(['/login']);  
  }
  
  

}
