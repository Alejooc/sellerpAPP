import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'category:id',
    loadChildren: () => import('./shop/category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'product/:slug',
    loadChildren: () => import('./shop/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./shop/cart/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./shop/checkout/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./shop/login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./shop/checkout/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'pagemodal',
    loadChildren: () => import('./shop/components/modal-comp/pagemodal/pagemodal.module').then( m => m.PagemodalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
