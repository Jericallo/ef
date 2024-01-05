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
      descripcion: 'Módulos',
      path: 'modules'
    }
  ];

  leyes: any[] = [
    {
      icon: 'widgets',
      descripcion: 'Categorías',
      path1: 'categories',
      path2: 'categories-edit'

    },
    {
      icon: 'insert_drive_file',
      descripcion: 'Documentos',
      path1: 'documents',
      path2: 'documents-edit'
    },
    {
      icon: 'text_fields',
      descripcion: 'Títulos',
      path1: 'titles',
      path2: 'titles-edit'
    },
    {
      icon: 'book',
      descripcion: 'Capítulos',
      path1: 'chapters',
      path2: 'chapters-edit',
      
    },
    {
      icon: 'bookmark',
      descripcion: 'Secciones',
      path1:'sections',
      path2: 'sections-edit',
    },
    {
      icon: 'description',
      descripcion: 'Artículos',
      path1:'articles',
      path2:'articles'
    },
    {
      icon: 'format_align_left',
      descripcion: 'Parrafos',
      path1:'paragraphs',
      path2:'paragraphs'
    }
  ];

  cumplimiento: any[] = [
    {
      icon: 'widgets',
      descripcion: 'Ver todos',
      path: 'compliance'
    },

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

  filterCumplimiento() {
    const searchTermLower = this.searchTerm.toLowerCase();
    if (searchTermLower.includes('cumplimiento')) {
      return this.cumplimiento;
    } else {
      return this.cumplimiento.filter(cumplimiento =>
        cumplimiento.descripcion.toLowerCase().includes(searchTermLower)
      );
    }
  }
  
  
  

  
  constructor() { }

  ngOnInit(): void {

  }
}