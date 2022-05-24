import { Component, OnInit, ViewChild} from '@angular/core';
import { AppSettings } from "../config/config";
import { HomeService } from "../services/home/home.service";
import { IonInfiniteScroll } from '@ionic/angular';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  api = new AppSettings();
  version:string=AppSettings.VERSION; // only test :v
  appName:string=AppSettings.APPNAME; // only test :v
  prods:Array<any>=[]; // array con todos los productos que se muestran en la pagina 
  header:string;
  categorie: any;
  page: any;
  slug=this.route.snapshot.params.slug;
  constructor(private service:HomeService,public route:ActivatedRoute) {
    this.getStoreData();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      
      this.service.getProductsC(this.page,this.categorie).subscribe(resp=>{
        console.log(resp);
        if (resp.type == 1) {
          this.page= resp.data.id;
          for (let prod of resp.resp) {
            console.log(prod);
            this.prods.push(prod);
          }
          
        }else{
          console.log(resp.msg);
        }
      })
      event.target.complete();
      console.log('infiniti scroll');
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      /*if (data.length === 1000) {
        event.target.disabled = true;
      }*/
    }, 1000);
  }
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  getCategories(){

  }
  getProducts(){
    this.service.getProductsC(this.page,this.categorie).subscribe(resp=>{
      console.log(resp.resp);
      if (resp.type == 1) {
        this.page=resp.data.id;
        this.prods=[...resp.resp!];
      }else{
        console.log(resp.msg);
      }
    })
  }
  getStoreData(){
    this.service.getHome().subscribe(resp=>{
      console.log(resp.body);
      this.header= resp.body.data.logo;
    })
  }
  ngOnInit() {
    if (this.slug!='') {
      this.categorie=this.slug;
    }
    this.getProducts();
    console.log(this.categorie);
    console.log('LOAD');
    
  }
  shortname(name){    
    let shortname = name.substr(0,21)    
    return shortname.toLowerCase()
    .trim()
    .split(' ')
    .map( v => v[0] + v.substr(1) )
    .join(' ');
  }
   
}
