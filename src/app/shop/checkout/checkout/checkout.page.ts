import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService} from "../../../services/storage/storage.service";
import { AuthService } from "../../../services/auth/auth.service";
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  loginForm:FormGroup;
  activeDes:boolean=false;
  total:number=0;
  perdesc:any;
  perCurrenc:any;
  totalDesc:number=0;
  constructor(private formBuilder:FormBuilder,
    private storage:StorageService,
    private auth:AuthService) { }


    ngOnInit() {
      this.loginForm= this.formBuilder.group(
        {
          user:["",[Validators.required,Validators.minLength(5)]],
          password:["",[Validators.required,Validators.minLength(4)]]
        }
      )
    }
    submitForm(){
      if (this.loginForm.invalid) {
        console.warn('empty form');
  
      }else{
        this.auth.login(this.loginForm.value).subscribe(resp=>{
          console.log(resp);
          if (resp.tipo ==1) {
            console.log(resp.msg);
            this.storage.set('userData',{token:resp.info,decode:this.auth.getDecodedAccessToken(resp.info)});
           // this.router.navigate(['/']);
            
          }else{
            console.log(resp.msg);
          }
          
    
        })
      }
      console.log(this.loginForm);
      
    }
}
