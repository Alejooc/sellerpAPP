import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService} from "../../../services/storage/storage.service";
import { AuthService } from "../../../services/auth/auth.service";
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm:FormGroup;
  constructor(private formBuilder:FormBuilder,
    private storage:StorageService,
    private auth:AuthService,
    private router:Router) { }

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
        if (resp.tipo ==1) {
          this.storage.set('userData',{token:resp.info,decode:this.auth.getDecodedAccessToken(resp.info)});
          this.router.navigate(['/']);
          
        }else{
          console.log(resp.msg);
        }
        
  
      })
    }    
  }

}
