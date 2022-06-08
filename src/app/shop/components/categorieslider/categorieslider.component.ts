import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home/home.service';
@Component({
  selector: 'app-categorieslider',
  templateUrl: './categorieslider.component.html',
  styleUrls: ['./categorieslider.component.scss'],
})
export class CategoriesliderComponent implements OnInit {
  categories:Array<any>=[]; // aray con todas las categorias disponibles
  constructor(private service:HomeService) { }

  ngOnInit() {
    this.service.getCategories().subscribe(resp=>{
      resp.body.data.forEach(elm => {
        if (elm.inAPP == 1) {
          this.categories.push(elm);
        }
      });
    })
  }

}
