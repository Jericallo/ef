import { Injectable } from '@angular/core';

export interface BadgeItem {
    type: string;
    value: string;
}
export interface Saperator {
    name: string;
    type?: string;
}
export interface ChildrenItems {
    state: string;
    name: string;
    type?: string;
}
export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    badge?: BadgeItem[];
    saperator?: Saperator[];
    children?: ChildrenItems[];
    class?: string;
    id?:string;
}
const MENUITEMS = [
  {
    state: 'main',
    name: 'Escudo Fiscal',
    type: 'link',
    icon: 'brightness_1',
    class: 'circle-menu',
  },
    {
        state: 'main',
        name: 'Inicio',
        type: 'sub',
        icon: '',
        class: 'inicio-menu',
        children:[
            {state:'intro', name:'Intro',type:'link',icon:'home', class:'homeid'},
            {state:'news',name:'Noticias',type:'link', icon:'newspaper'},
            {state:'laws',name:'Leyes',type:'link', icon:'library_books'},
            {state:'topics',name:'Temario',type:'link', icon:'list_alt'},
            {state:'busqueda',name:'Busqueda',type:'link', icon:'manage_search'},
            {state:'',name:'Incentivos',type:'link',icon:'savings'},
            {state:'',name:'Números',type:'link',icon:'calculate'}
        ]
    },
    {
        state:'main',
        name: 'Cumplimiento',
        type:'sub',
        icon: '',
        class: 'cumplimiento-menu',
        children:[
            {state:'', name:'Impuestos',type:'link', icon:'checklist'},
            {state:'', name:'Sellos Buzón Fiscal',type:'link'},
            {state:'', name:'Materialidad Razon',type:'link',icon:'folder_open'},
            {state:'', name:'Informativas',type:'link',icon:'lightbulb'},
            {state:'', name:'Prevención Lavado',type:'link',icon:'security'},
            {state:'', name:'Legal Corporativo',type:'link',icon:'shield_lock'},
            {state:'', name:'Documentación',type:'link',icon:'archive'},
            {state:'', name:'Alertas',type:'link',icon:'notifications'}
        ]
    },
    {
        state:'control',
        name:'Control',
        type:'sub',
        icon:'',
        class: 'control-menu',
        children:[
            {state:'capacitaciones', name:'Capacitación',type:'link',icon:'local_library'},
            {state:'', name:'Ayuda',type:'link',icon:'help_center'},
            {state:'', name:'Supervisión',type:'link',icon:'supervisor_account'},
            {state:'', name:'Semaforo',type:'link',icon:'traffic'},
            {state:'', name:'Dictámen',type:'link', icon:'book'},
            {state:'', name:'Mejor',type:'link', icon:'star'}
        ]
    },
    {
        state:'',
        name:'Precaución',
        type:'sub',
        icon:'',
        class: 'precaucion-menu',
        children:[
            {state:'', name:'Respuesta SAT',type:'link',icon:'archive'},
            {state:'', name:'Incumplimientos',type:'link',icon:'crisis_alert'},
            {state:'', name:'Sanciones',type:'link',icon:'minor_crash'},
            {state:'', name:'Auditorías',type:'link',icon:'account_balance'},
            {state:'', name:'Responsabilidad',type:'link',icon:'fact_check'},
            {state:'', name:'Defensa',type:'link',icon:'gpp_maybe'},
            {state:'', name:'Pendiente',type:'link', icon:'star'}
        ]
    }
    /*{
        state: 'main',
        name: 'Inicio',
        type: 'sub',
        icon: 'shield',
        children:[
            {state:'intro', name:'Intro',type:'link',icon:'home'},
            {state:'news',name:'Noticias',type:'link', icon:'newspaper'},
            {state:'laws',name:'Leyes',type:'link', icon:'library_books'},
            {state:'topies',name:'Temario',type:'link', icon:'list_alt'},
            {state:'',name:'Incentivos',type:'link', icon:'request_quote'},
            {state:'',name:'Calculadora',type:'link',icon:'calculate'}
        ]
    },
    {
        state:'',
        name: 'Cumplimiento',
        type:'sub',
        icon: 'gavel',
        children:[
            {state:'', name:'Obligaciones',type:'link', icon:'checklist'},
            {state:'', name:'Legal Corporativo',type:'link'},
            {state:'', name:'Documentacion',type:'link',icon:'folder_open'},
            {state:'', name:'Alertas',type:'link',icon:'notifications'},
            {state:'', name:'Respuesta SAT',type:'link',icon:'archive'}
        ]
    },
    {
        state:'',
        name:'Control',
        type:'sub',
        icon:'supervisor_account',
        children:[
            {state:'', name:'Semaforo',type:'link',icon:'traffic'},
            {state:'', name:'Capacitación',type:'link',icon:'local_library'},
            {state:'', name:'Ayuda',type:'link',icon:'help_center'},
            {state:'', name:'Supervisión',type:'link',icon:'supervisor_account'},
            {state:'', name:'Dictámen',type:'link'},
            {state:'', name:'Mejor',type:'link'},
        ]
    },
    {
        state:'',
        name:'Precaución',
        type:'sub',
        icon:'warning',
        children:[
            {state:'', name:'Incumplimientos',type:'link',icon:'crisis_alert'},
            {state:'', name:'Sanciones',type:'link',icon:'problem'},
            {state:'', name:'Auditorías',type:'link',icon:'account_balance'},
            {state:'', name:'Responsabilidad',type:'link',icon:'fact_check'},
            {state:'', name:'Defensa',type:'link',icon:'gpp_maybe'},
            {state:'', name:'Pendiente',type:'link'}
        ]
    },*/
    /*{
        state: 'material',
        name: 'Material Ui',
        type: 'sub',
        icon: 'bubble_chart',
        badge: [{ type: 'red', value: '17' }],
        children: [
            { state: 'badge', name: 'Badge', type: 'link' },
            { state: 'button', name: 'Buttons', type: 'link' },
            { state: 'cards', name: 'Cards', type: 'link' },
            { state: 'grid', name: 'Grid List', type: 'link' },
            { state: 'lists', name: 'Lists', type: 'link' },
            { state: 'menu', name: 'Menu', type: 'link' },
            { state: 'tabs', name: 'Tabs', type: 'link' },
            { state: 'stepper', name: 'Stepper', type: 'link' },
            { state: 'ripples', name: 'Ripples', type: 'link' },
            { state: 'expansion', name: 'Expansion Panel', type: 'link' },
            { state: 'chips', name: 'Chips', type: 'link' },
            { state: 'toolbar', name: 'Toolbar', type: 'link' },
            { state: 'progress-snipper', name: 'Progress snipper', type: 'link' },
            { state: 'progress', name: 'Progress Bar', type: 'link' },
            { state: 'dialog', name: 'Dialog', type: 'link' },
            { state: 'tooltip', name: 'Tooltip', type: 'link' },
            { state: 'snackbar', name: 'Snackbar', type: 'link' },
            { state: 'slider', name: 'Slider', type: 'link' },
            { state: 'slide-toggle', name: 'Slide Toggle', type: 'link' }
        ]
    }*/
];

@Injectable()
export class HorizontalMenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}
