import { Component, OnInit } from '@angular/core';
import { ServiceService } from "../service.service";
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from "../../services/storage/storage.service";
import {ActivatedRoute,Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pqr',
  templateUrl: './pqr.page.html',
  styleUrls: ['./pqr.page.scss'],
})
export class PqrPage implements OnInit {
  created:boolean=false;
  read:boolean=false;
  ticketForm:FormGroup;
  ticketChat:FormGroup;
  user: any;
  infoTicket:object={};
  slug = this.route.snapshot.params.ticket; // obtener el slug para buscar el producto -> API
  chatTicket=[];
  status=['Nuevo','pendiente','Esperando respuesta','Resuelto'];
  nologged: boolean=false;
  constructor(private storage:StorageService,private service:ServiceService,private formBuilder:FormBuilder,public route:ActivatedRoute,private router:Router,public alertController: AlertController) { 
    route.params.subscribe(async val => {
      if (val.ticket) {
        this.ticketChat= this.formBuilder.group(
          {
            msg:["",[Validators.required]]
          })
        console.log(val);
        this.read=true;
        this.get_msg(val.ticket);
      }else{
        this.created=true;
        
      }
      
      let data=  await this.storage.get('userData') || [];
      console.log(data);
      
      if (data.length==0) {
        this.nologged=true;
        this.formsVa();
        //this.router.navigate(['/login']);
      }else{
        this.user =data.decode.info;
        console.log(this.user);
        this.nologged=false;
      }
    });
  }
  get_msg(val){
    this.service.get_msg_ticket(val).subscribe(rep=>{
      console.log(rep);
      
      this.infoTicket=rep.data;
      this.chatTicket=rep.msg;
    })
  }
  async presentAlert(msg:string,subti:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      //header: 'Alert',
      subHeader: subti,
      message: msg,
      buttons: [{
        text:'Entendido',
        handler:()=>{
          this.router.navigate(['/profile']);
        }
      }]
    });

    await alert.present();

    
  }
  formsVa(){
    if (this.nologged===true) {
      console.log('No esta logeado el usuario');
      
      this.ticketForm= this.formBuilder.group(
        {
          asunto:["",[Validators.required]],
          comentario:["",[Validators.required]],
          email:["",[Validators.required]],
          name:["",[Validators.required]],
          cc:["",[Validators.required]],
          phone:["",[Validators.required]]

        })
    }else{
      this.ticketForm= this.formBuilder.group(
        {
          asunto:["",[Validators.required]],
          comentario:["",[Validators.required]]
        })
        this.nologged=false;
    }
  }
  ngOnInit() {
    console.log(this.nologged);
    this.formsVa();
    
      
  }
  insertMSG(){
    console.log(this.slug);
    
    if (this.ticketChat.invalid) {
      console.warn('empty form');
      // alerta del posible error :v
    }else{
      this.service.set_new_message(this.ticketChat.value,this.user.id,this.slug).subscribe(resp=>{
        console.log(resp);
        if (resp.type==1) {
          console.log('ok');
          this.get_msg(this.slug);
          this.ticketChat.reset();
        }else{
          // alerta del posible error :v
        }
      })
    } 
  }
  submitForm(){
    if (this.ticketForm.invalid) {
      console.warn('empty form');
      // alerta del posible error :v
    }else{
      let data = {
        formu:this.ticketForm.value,
        user:this.user||[]
      }
      if (this.user!=undefined) {
        data.formu.cc=this.user.docid;
        data.formu.name=this.user.docid;
        data.formu.uid=this.user.id;
      }
      this.service.set_new_ticket(data).subscribe(resp=>{
        console.log(resp);
        if (resp.type==1) {
          console.log('ok');
          this.presentAlert('Haz Creado un nuevo ticket, lo revisaremos cuanto antes!','¡Ticket Creado!');
        }else{
          // alerta del posible error :v
        }
      })
    }  
  }

}
