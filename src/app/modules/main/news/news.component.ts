import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  @ViewChild('noticia', {static:true}) noticia:ElementRef
  @ViewChild('scrollElement') scrollElement: ElementRef;

 // noticia = "https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4";
  numVideo = 0;
  // Timeline
  mytimelines: any[] = []; // Aquí se declara mytimelines como un arreglo vacío
  /*[
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Nirav joshi',time: 'Mayo 2023',image: 'assets/images/users/1.jpg',
      attachment: 'assets/images/big/img2.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Sunil joshi',time: 'Junio 2023',image: 'assets/images/users/2.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
      buttons: 'primary',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Vishal Bhatt',time: 'Julio 2023',image: 'assets/images/users/3.jpg',
      attachment: 'assets/images/big/img1.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Dhiren Adesara',time: 'Agosto 2023',
      image: 'assets/images/users/4.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
      buttons: 'warn',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Dhiren Adesara',time: 'Septiembre 2023',
      image: 'assets/images/users/4.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
      buttons: 'warn',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Vishal Bhatt',time: 'Octubre 2023',image: 'assets/images/users/3.jpg',
      attachment: 'assets/images/big/img1.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Sunil joshi',time: 'Noviembre 2023',image: 'assets/images/users/2.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
      buttons: 'primary',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Nirav joshi',time: 'Diciembre 2023',image: 'assets/images/users/1.jpg',
      attachment: 'assets/images/big/img2.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Nirav joshi',time: 'Enero 2024',image: 'assets/images/users/1.jpg',
      attachment: 'assets/images/big/img2.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Sunil joshi',time: 'Febrero 2024',image: 'assets/images/users/2.jpg',
      selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
      buttons: 'primary',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Vishal Bhatt',time: 'Marzo 2024',image: 'assets/images/users/3.jpg',
      attachment: 'assets/images/big/img1.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
    },
    {
      video:'https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4',
      from: 'Dhiren Adesara',time: 'Abril 2024',image: 'assets/images/users/4.jpg',selected:false,
      content:
        // tslint:disable-next-line:max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
      buttons: 'warn',
    }
  ];*/

  constructor(private apiService:ApiService) { moment.locale("es"); }

  ngOnInit(): void {
    //
      this.playNew(this.mytimelines[0])//"https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4");
      this.get();
  }

  idIntVideo = null;
  playNew(obj:any, numVideo=-1){
    if(typeof obj === "undefined"){
      return
    }
    this.mytimelines.forEach(mtl => {mtl.selected = false;});
    obj.selected=true;
    this.noticia.nativeElement.src = obj.video.url;
    this.noticia.nativeElement.muted = true;
    this.noticia.nativeElement.load();
    //this.noticia.nativeElement.onended = () => {console.log('ended');}
    //this.noticia.nativeElement.onended = (event) => {alert(event);}
    this.noticia.nativeElement.play();
    if(this.idIntVideo == null){
      clearInterval(this.idIntVideo); this.idIntVideo = null;
    }
    this.idIntVideo = setInterval(()=>{
      if(this.noticia.nativeElement.ended || this.noticia.nativeElement.src == 'http://localhost:4200/null'){
        console.log('ended');
        if(numVideo < 0){
          if(this.numVideo == 11) this.numVideo = 0;
          else this.numVideo++;
        }else this.numVideo = numVideo + 1;
        this.playNew(this.mytimelines[this.numVideo]);
      }
    },1000);
  }

  get(){
    this.apiService.getAll(this.apiService.MODELS.news).subscribe({
      next:(res)=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        if(res.status == "OK"){
          res.result.forEach(res => {
            res.fecha = (moment(res.fecha * 60000).format('MMMM/YYYY')).toUpperCase();
          });
          this.mytimelines = res.result;
          if(this.mytimelines.length > 0) this.playNew(this.mytimelines[this.numVideo]);
          console.log(res)
        }
      }
    });
  }

  vidEnded(){
    console.log('ended');
  }

  scrollDown() {
    this.scrollElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

}
