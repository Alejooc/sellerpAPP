import { Component, OnInit } from '@angular/core';
import { StorageService } from "../../../services/storage/storage.service";
import {ActivatedRoute,Router } from '@angular/router';
import { AppSettings } from "../../../config/config";
import { ProfileService } from "../../../services/shop/profile/profile.service";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  conf = new AppSettings();
  user: any=[];
  pqr:boolean=false;
  orders:boolean=false;
  address:boolean=false;
  data:[];
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    if (ev.detail.value == "pqr") {
      this.orders=false;
      this.pqr=true;
      this.address=false;
      this.getData(3);
      //this.router.navigate(['/pqr']);
    }else if (ev.detail.value == "horders"){
      this.orders=true;
      this.pqr=false;
      this.address=false;
      this.getData(1);

    }else if (ev.detail.value == "uaddress"){
      this.orders=false;
      this.pqr=false;
      this.address=true;
      this.getData(2);

    }
  }
  constructor(route:ActivatedRoute,private storage:StorageService,private router:Router,
    private serviceb:ProfileService) {
    route.params.subscribe(async val => {
      
      let data=  await this.storage.get('userData') || [];
      if (data.length==0) {
       
        this.router.navigate(['/login']);
      }else{
        this.user =data.decode.info;
        console.log(this.user);
        this.orders=true;
        this.getData(1);
      }
    });
   }
   getData(type:number){
     this.data=[];
    this.serviceb.getProData(type,this.user.id).subscribe(resp=>{
      console.log(resp.body.data);
      if (resp.body.type==1) {
        this.data = resp.body.data;
      }
    })
   }
  ngOnInit() {
    
  }

}
