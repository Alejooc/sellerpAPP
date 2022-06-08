import { Component, OnInit } from '@angular/core';
import { StorageService } from "../../../services/storage/storage.service";
import {ActivatedRoute,Router } from '@angular/router';
import { AppSettings } from "../../../config/config";
import { ProfileService } from "../../../services/shop/profile/profile.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  addressForm:FormGroup;
  conf = new AppSettings();
  user: any=[];
  pqr:boolean=false;
  orders:boolean=false;
  address:boolean=false;
  addresss={address:'',nbh:''};
  data:any;
  newAddress:boolean=false;
  status=['Nuevo','pendiente','Esperando respuesta','Resuelto'];
  states: any;
  citys: any;
  cit=[];

  segmentChanged(ev: any) {
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
    private serviceb:ProfileService,private formBuilder:FormBuilder) {
    route.params.subscribe(async val => {
      const data=  await this.storage.get('userData') || [];
      if (data.length==0) {
        this.router.navigate(['/login']);
        return;
      }
    
    });
   }
  getData(type:number){
    this.data=[];
    this.newAddress=false;
    this.serviceb.getProData(type,this.user.id).subscribe(resp=>{
      if (resp.body.type==1) {
        this.data = resp.body.data;
        this.states = resp.body.states;
        this.citys = resp.body.citys;
      }
    })
  }
  async ngOnInit() {
    const data=  await this.storage.get('userData') || [];
    if (data.length==0) {
      this.router.navigate(['/login']);
      return;
    }
    this.user =data.decode.info;
    this.orders=true;
    this.getData(1);
    this.addressForm= this.formBuilder.group(
      {
        Uid:[this.user.id,Validators.required],
        address:["",[Validators.required,Validators.minLength(5)]],
        barrio:["",[Validators.required,Validators.minLength(4)]],
        city:["",[Validators.required,Validators.minLength(4)]],
        dep:["",[Validators.required,Validators.minLength(4)]]
      }
    )

  }
  addAddress(){
    this.address=false;
    this.newAddress=true;
    this.serviceb.getStates().subscribe(resp=>{
      this.states = resp.body.states;
      this.citys = resp.body.citys;
    })
  }

  saveForm(){
    console.log(this.addressForm.value)
    this.serviceb.save(this.addressForm.value).subscribe(resp=>{
      console.log(resp);
      if (resp.tipo==1) {
        this.newAddress=false;
        this.address=true;
        this.getData(2);
      }
    })
  }

  citysApl(ev:any){
    this.cit=[];
    this.citys.forEach(element => {
      if (element.state == ev.detail.value ) {
        this.cit.push(element)
      }
    });
  }
}
