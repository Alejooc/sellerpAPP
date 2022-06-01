import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagemodalService } from "../pagemodal.service";
import { StorageService} from "../../../../services/storage/storage.service";

@Component({
  selector: 'app-pagemodal',
  templateUrl: './pagemodal.page.html',
  styleUrls: ['./pagemodal.page.scss'],
})
export class PagemodalPage implements OnInit {
  cuponForm:FormGroup;
  msg:string;
  cupon={
    'type':null
  }
  showA:boolean=false;
  dataCupon: any;
  cuponDa: any;
  constructor(public modalController: ModalController, private formBuilder:FormBuilder,private service:PagemodalService,private storage:StorageService) { }

  async ngOnInit() {
    this.cuponForm= this.formBuilder.group(
      {
        txt:["",[Validators.required,Validators.minLength(4)]]
      }
    )
    let f =await this.storage.get('cuponData');
    if (f!=null) {
      this.showA=true;
      this.cuponDa = f;
      console.log(f);
      
    }  
  }
  delCupon(){
    this.storage.removeKey('cuponData');
    
  }
  async checkCupon(){
    let val = await this.storage.getTotalCart('cart');
    this.service.getCupon(this.cuponForm.get('txt').value,val).subscribe( resp =>{
      if (resp.type ==1) {
        this.cupon = resp;
        this.msg= resp.msg;
        this.dataCupon = resp.data;
        this.storage.set('cuponData',this.dataCupon);
        this.dismiss();
      }else{
        this.msg= resp.msg;
        this.cupon = resp;
      }
    })
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}
