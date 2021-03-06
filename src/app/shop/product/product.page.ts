import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductService } from "../../services/shop/product/product.service";
import { ToastController } from '@ionic/angular';
import { StorageService } from "../../services/storage/storage.service";
@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  slug = this.rutaActiva.snapshot.params.slug; // obtener el slug para buscar el producto -> API
  idprod=[]; // obtener el slug para buscar el producto -> API
  prod:any= [];
  cart= [];
  constructor(private rutaActiva: ActivatedRoute,
    private router:Router,private service:ProductService,public toastController: ToastController,private storage:StorageService) { }

  async presentToast() {
    const toast = await this.toastController.create({
      header: 'Producto Añadido al carrito',
      icon: 'information-circle',
      position: 'bottom',
      duration: 3000,
      buttons: [
        {
          text: 'Ir a carrito',
          role: 'cancel',
          handler: async () => {
            this.router.navigate(['cart']);
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
  }
  ngOnInit() {
    this.getProduct();
  }
  getProduct(){
    this.service.getProduct(this.idprod,this.slug).subscribe(resp=>{
      if (resp.type == 1) {
        this.prod=resp.data;
      }
    })
  }
  existeCart(id:number) {
      return this.cart.find(producto => producto.id === id);
  }
  quitarCart(id: any) {
    const indice = this.cart.findIndex(p => p.id === id);
    if (indice != -1) {
       this.cart.splice(indice, 1);
        
    } 
  }
  async addCart(){
    this.cart = await this.storage.get('cart') || []; // trae el carrito
    if (!this.existeCart(this.prod.id)) {
      this.prod.qty=1;
      this.cart.push(this.prod);
    }else{
      const prodd= this.cart.find(produc => produc.id === this.prod.id);
      prodd.qty=prodd.qty+1;   
      this.quitarCart(prodd.id);
      this.cart.push(prodd);
    }
    this.storage.set('cart',this.cart);
    this.presentToast();
  }
  
}
