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
    // {
    //   icon: 'assignment_ind',
    //   descripcion: 'Perfiles',
    //   path: 'profiles'
    // },
    // {
    //   icon: 'view_module',
    //   descripcion: 'Módulos',
    //   path: 'modules'
    // },
    {
      icon: 'store',
      descripcion: 'Compañías',
      path: 'companies'
    }
  ];

  leyes: any[] = [
    {
      icon: 'widgets',
      descripcion: 'Leyes',
      path1: 'documents',
      path2: 'documents-edit'

    },
    {
      icon: 'insert_drive_file',
      descripcion: 'Libros',
      path1: 'books',
      path2: 'books-edit'
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
      path2:'articles-edit'
    },
    {
      icon: 'pie_chart',
      descripcion: 'Partes',
      path1:'parts',
      path2:'parts'
    },
    {
      icon: 'format_align_left',
      descripcion: 'Párrafos',
      path1:'paragraphs',
      path2:'paragraphs-edit'
    },
    {
      icon: 'line_style',
      descripcion: 'Fracciones',
      path1:'fractions',
      path2:'fractions'
    },
    {
      icon: 'list',
      descripcion: 'Puntos',
      path1:'points',
      path2:'points'
    }
  ];

  cumplimiento: any[] = [
    {
      icon: 'widgets',
      descripcion: 'Ver todos',
      path: 'compliance'
    },
    {
      icon: 'calendar_today',
      descripcion: 'Días Festivos',
      path: 'festive-days'
    },
    {
      icon: 'insert_drive_file',
      descripcion: 'Catálogo de documentaciones',
      path: 'documentations-catalog'
    },
  ];

  control: any[] = [
    {
      icon: 'alarm',
      descripcion: 'Capacitaciones',
      path: 'capacitations-table'
    },
    {
      icon: 'list',
      descripcion: 'Acciones',
      path: 'logs'
    },
    {
      icon:'question_answer',
      descripcion: 'Preguntas mensuales',
      path:'monthly-questions'
    }
  ]

  videos: any[] = [
    {
      icon: 'store',
      descripcion: 'Promocionales',
      path: 'promotionals'
    },
    {
      icon: 'book',
      descripcion: 'Intros',
      path: 'intro-videos'
    },
    {
      icon: 'linked_camera',
      descripcion: 'Noticias',
      path: 'news-videos'
    },
    {
      icon: 'build',
      descripcion: 'Capacitaciones',
      path: 'capacitations-videos'
    },
  ]
  

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
  
  filterVideos() {
    const searchTermLower = this.searchTerm.toLowerCase();
    if (searchTermLower.includes('videos')) {
      return this.videos;
    } else {
      return this.videos.filter(videos =>
        videos.descripcion.toLowerCase().includes(searchTermLower)
      );
    }
  }

  filterControl() {
    const searchTermLower = this.searchTerm.toLowerCase();
    if (searchTermLower.includes('control')) {
      return this.control;
    } else {
      return this.control.filter(control =>
        control.descripcion.toLowerCase().includes(searchTermLower)
      );
    }
  }
  
  

  
  constructor() { }

  ngOnInit(): void {

  }
}