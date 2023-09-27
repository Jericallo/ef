import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  //[(ngModel)]="searchTerm"
  searchTerm: string = '';
  

  usuarios: any[] = [
    {
      icon: 'group',
      descripcion: 'Ver todos',
      path: 'users'
    },
    {
      icon: 'assignment_ind',
      descripcion: 'Perfiles',
      path: 'profiles'
    },
    {
      icon: 'view_module',
      descripcion: 'Modulos',
      path: 'modules'
    }
  ];

  leyes: any[] = [
    {
      icon: 'widgets',
      descripcion: 'Categorias',
      path: 'categories'
    },
    {
      icon: 'insert_drive_file',
      descripcion: 'Documentos',
      path: 'documents'
    },
    {
      icon: 'text_fields',
      descripcion: 'Titulos',
      path: 'titles'
    },
    {
      icon: 'book',
      descripcion: 'Capitulos',
      path: 'chapters'
    },
    {
      icon: 'bookmark',
      descripcion: 'Secciones',
      path:'sections'
    },
    {
      icon: 'description',
      descripcion: 'Articulos',
      path:'articles'
    },
    {
      icon: 'format_align_left',
      descripcion: 'Parrafos',
      path:'paragraphs'
    }
  ];

  filterUsuarios() {
    const searchTermLower = this.searchTerm.toLowerCase();
    if (searchTermLower.includes('usuarios')) {
      return this.usuarios;
    } else {
      return this.usuarios.filter(usuario =>
        usuario.descripcion.toLowerCase().includes(searchTermLower)
      );
    }
  }
  
  filterLeyes() {
    const searchTermLower = this.searchTerm.toLowerCase();
    if (searchTermLower.includes('leyes')) {
      return this.leyes;
    } else {
      return this.leyes.filter(ley =>
        ley.descripcion.toLowerCase().includes(searchTermLower)
      );
    }
  }
  
  
  

  
  constructor() { }

  ngOnInit(): void {

  }
}