import { Injectable } from '@angular/core';
import { RouteConfigLoadEnd } from '@angular/router';
//import { Storage } from '@capacitor/storage';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  public cart:string;
  constructor(private storage: Storage) { 
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }
  // get data storage
  public get(key: string) {
    return this.storage.get(key) || [];
  }
  public async removeKey(key:string){
    return await this.storage.remove(key);
  }
  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
  // borrar un dato del storage
  public async remove(index:number){
    const storedData = await this._storage.get('cart')||[];
    storedData.splice(index,1);
    return this.storage.set('cart',storedData)
  }
  // borrar todo el storage
  public clear (){
    this._storage.clear();
  }

  public getCantItems(key:string){
   return this.storage.get(key) || [];
  }
  public async getTotalCart(key:string){
    let cart = await this.storage.get(key) || [];
    let total=0;
    cart.forEach(elm=> {
      total = total+elm.qty*parseInt(elm.val);
      console.log(total);
    });
    return total;
   }
}
