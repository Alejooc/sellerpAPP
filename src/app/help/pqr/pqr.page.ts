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
  infoTicket={ id:0,status:0 };
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
        this.read=true;
        this.get_msg(val.ticket);
      }else{
        this.created=true;
        
      }
      
      const data=  await this.storage.get('userData') || [];      
      if (data.length==0) {
        this.nologged=true;
        this.formsVa();
        //this.router.navigate(['/login']);
      }else{
        this.user =data.decode.info;
        this.nologged=false;
      }
    });
  }
  get_msg(val: number){
    this.service.get_msg_ticket(val).subscribe(rep=>{      
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
    this.formsVa();  
    this.get_msg(this.slug);     
  }
  insertMSG(){
    if (this.ticketChat.invalid) {
      console.warn('empty form');
      // alerta del posible error :v
    }else{
      this.service.set_new_message(this.ticketChat.value,this.user.id,this.slug).subscribe(resp=>{
        if (resp.type==1) {
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
      return;
      // alerta del posible error :v
    }  
    const data = {
      formu:this.ticketForm.value,
      user:this.user||[]
    }
    if (this.user!=undefined) {
      data.formu.cc=this.user.docid;
      data.formu.name=this.user.docid;
      data.formu.uid=this.user.id;
    }
    this.service.set_new_ticket(data).subscribe(resp=>{
      if (resp.type==1) {
        this.presentAlert('Haz Creado un nuevo ticket, lo revisaremos cuanto antes!','¡Ticket Creado!');
      }else{
        // alerta del posible error :v
      }
    })  
  }

}
