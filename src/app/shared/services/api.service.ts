import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Classifications } from '../interfaces/classifications-interface';
import { Documents } from '../interfaces/documents-interface';
import { Article, Article_Chapter, Article_Section, Article_Title } from '../interfaces/article-interface';
import { Capacitations } from '../interfaces/capacitations-interface';
import { VideoResumeInterface } from '../interfaces/video-resume-interface';

import { environment } from 'src/environments/environment';
import { Paragraph } from '../interfaces/paragraph-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  id = 0
  get:string = `${environment.url_base}getAll?model=`
  insert: string = 'https://api.escudofiscal.alphadev.io/v1/insert';
  update: string = 'https://api.escudofiscal.alphadev.io/v1/update';
  models = {clasificaciones:"clasificaciones",documentos:"documentos",documentaciones:"documentaciones",
    articulo_titulos:"articulo_titulo",articulo_capitulos:"articulo_capitulos", 
    articulo_secciones:"articulo_secciones",articulos:"articulos",clientes:"clientes",obligaciones:"obligaciones",
    obligaciones_tipos:"obligaciones_tipos",regimen_fiscal:"regimen_fiscal"}
  
    private title: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public title$: Observable<string> = this.title.asObservable();
    

  public readonly TOKEN = "token_escudo";

   readonly MODELS = {articles:"articulos",article_title:"articulo_titulo",
    article_chapter:"articulo_capitulo", article_sections:"articulo_secciones",
    intros:"intros", news:"noticias", topics:"temario"};

  constructor(private http:HttpClient) {
    /*if(!localStorage[this.TOKEN]){
      this.login({correo:"daniel@alphadev.io",contraseña:"asdfghji"}).subscribe({
        next:(res)=>{
          res = JSON.parse(this.decrypt(res.message,''));//--- PARA DESENCRIPTAR LA RESPUESTA
          //console.log(res);
          localStorage.setItem(this.TOKEN,JSON.stringify(res.data));
        },
        error:(err)=>{
          console.log(err);
        }
      });
    }*/
    localStorage.removeItem("token");
  }

  public getAll(model:string="", where:string="", orderby:string="",limit:number=-1, offset:number=-1, querys:Object=null): Observable<any> {
    const url = environment.baseUrl+`getAll`;
    let params = new HttpParams();
    if(model) params = params.set("model",model);
    if(where) params =  params.set("where",where);
    if(orderby) params = params.set("orderby",orderby);
    if(limit > 0) params = params.set("limit", limit);
    if(offset > 0) params = params.set("offset", offset);
    if(querys)
      for (const que in querys)
        if(querys[que])
          params = params.set(que,querys[que]);
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
      //'Authorization':`Bearer ${environment.token}`
    });
    return this.http.get(url,{params:params,headers:headers});
  }

  public emergencyContent(model:string='', params=''): Observable<any>{
    const url = environment.baseUrl+`content?` + params + '&model=' + model;
    console.log('URL:',url)
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers});
  }

  public content(model:string="", where:string="", orderby:string="",limit:number=-1, offset:number=-1, querys:Object=null): Observable<any>{
    const url = environment.baseUrl+`content`;
    //const url = 'https://api.escudofiscal.alphadev.io/v1/content?model=articulos&id_articulo=89&more=1'
    let params = new HttpParams();
    if(model) params = params.set("model",model);
    if(where) params =  params.set("where",where);
    if(orderby) params = params.set("orderby",orderby);
    if(limit > 0) params = params.set("limit", limit);
    if(offset > 0) params = params.set("offset", offset);
    params.set("more",1);
    if(querys)
      for (const que in querys)
        if(querys[que])
          params = params.set(que,querys[que]);

    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });

    return this.http.get(url,{params:params,headers:headers});
  }

  /**
   * Function to get obligations by date and period
   * @param params date param it's neccesary to get results, and period it's optional
   * @returns response with obligations
   */
  public dates(params:HttpParams):Observable<any>{
    console.log(params)
    //const url = 'http://192.168.100.154:3000/v1/getAll?model=obligaciones'
    const url = 'https://api.escudofiscal.alphadev.io/v1/getAll?model=obligaciones'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{params:params,headers:headers});
  }

  public historial(params:HttpParams):Observable<any>{
    console.log(params)
    //const url = 'http://192.168.100.154:3000/v1/getAll?model=obligaciones'
    const url = 'https://api.escudofiscal.alphadev.io/v1/getAll?model=obligaciones_historial'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{params:params,headers:headers});
  }

  public getObligationsForToday(momento:string):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/getAll?model=obligaciones&where='+ momento +'&id_usuario=' + this.id
    //&where='+ momento +'&id_usuario=' + this.id
    return this.http.get(url,{headers:headers});
  }

  public login(body: any): Observable<any> {
    //console.log("body",body)
    const encryptedBody = this.encrypt(body, '');
    //console.log("encrybtedBody", encryptedBody)
    //console.log("llave",this.publicKey)
    return this.http.post(environment.baseUrl + 'login', {"text":encryptedBody}, {});
  }

  public postResetPass(data: any): Observable<any>{
    const encryptedData = this.encrypt(data, '');
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      //'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(environment.baseUrl + 'requestNewPassword',{"text":encryptedData},{headers:headers})
  }
  
  public setNewPassword(data: any): Observable<any> {
    console.log(data)
    const encryptedData = this.encrypt(data, '');
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      //'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(environment.baseUrl + 'setNewPassword', { text: encryptedData }, { headers: headers });
  }

  public getUsers():Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/user'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  public deleteUser(userId: number): Observable<any> {
    const url = `https://api.escudofiscal.alphadev.io/v2/user/delete`; 
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });  
    const body = {
      id: userId
    }
    return this.http.put(url, body);
  }

  public deleteProfile(userId: number): Observable<any> {
    const url = environment.baseUrl + 'delete'; 
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });  
         
    let params = new HttpParams().set('model', 'perfiles');
    params = params.append('id', userId.toString());
    return this.http.delete(url, { headers, params });
  }

  public postUser(data: any): Observable<any> {
    const url = environment.baseUrl + 'insert'; 
    const encryptedData = this.encrypt(data, "1")
    let body = ({
      text:encryptedData
    })
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(url, body, { headers });
  }

  public putUser(data: any): Observable<any> {
    const url = environment.baseUrl + 'update'; 
    const encryptedData = this.encrypt(data, "1")
    let body = ({
      text:encryptedData
    })
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put(url, body, { headers });
  }

  public post(data: any): Observable<any> {
    const url = environment.baseUrl + 'insert'; 
    const encryptedData = this.encrypt(data, "1")
    let body = ({
      text:encryptedData
    })
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(url, body, { headers });
  }

  public put(data: any): Observable<any> {
    const url = environment.baseUrl + 'update'; 
    const encryptedData = this.encrypt(data, "1")
    let body = ({
      text:encryptedData
    })
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put(url, body, { headers });
  }

  public deleteModule(moduleId: number): Observable<any> {
    const url = environment.baseUrl + 'delete'; 
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });    
    let params = new HttpParams().set('model', 'modulos');
    params = params.append('id', moduleId);
    return this.http.delete(url, { headers, params });
  }

  public postModule(data: any): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/module'; 
    console.log(data)
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(url, data, { headers });
  }


  /*
  public login(body:any):Observable<any>{
    return this.http.post(environment.baseUrl+'login',body,{});
  }
  */

  public postObligations( data: any): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v1/insert';
    const encryptedData = this.encrypt(data, "1");
    if(encryptedData == "") {
      //console.log("PP", this.privateKey)
      this.encrypt(data,"private")
    }
    
    let body = ({
      text:encryptedData
    });
    //console.log("body",body);
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(url, body, { headers: headers }).pipe(
      catchError((error) => {
        console.error(this.decrypt(error.error.message,'private'));
        return throwError('An error occurred while sending the post request.');
      })
    );
  }

  public getPeriods():Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v1/getAll?model=obligaciones_periodos'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  
  private getToken(){
    if(localStorage[this.TOKEN]){
      let res = JSON.parse(localStorage.getItem(this.TOKEN) || "");
      this.id = res.id
      if(res.token) return res.token;
      else return environment.token;
    }
  }

  public getId(){
    if(localStorage[this.TOKEN]){
      let res = JSON.parse(localStorage.getItem(this.TOKEN) || "");
      return res.id
    }
  }

  public getWholeUser(){
    if(localStorage[this.TOKEN]){
      let res = JSON.parse(localStorage.getItem(this.TOKEN) || "");
      return res
    }
  }

  public getPrivateKey(){
    if(localStorage[this.TOKEN]){
      let res = JSON.parse(localStorage.getItem(this.TOKEN) || "");
      this.id = res.id
      //console.log(res)
      if(res.llave) return res.llave;
      else return '';
    }
  }


  privateKey = '';
  publicKey = 'krmhNDxjib2pcllpk8zKABzauZgz4pc/';//'ex0ix+S22lFhQXcEVrcT1nYmqD+6OAS5';//'64963515cacd41b683cb4ca8305a30ae';
  secureIV = '1ae68ad336c3a81e';
  public decrypt(data:any, keyP:string = ''){
    this.privateKey = keyP;
    let key = (keyP === '') ? this.publicKey : this.getPrivateKey();
    if(key.length != 32){return '';}
    ////this.secureIV = key.substring(0,16);
    let _key = CryptoJS.enc.Utf8.parse(key);
    let _iv = CryptoJS.enc.Utf8.parse(this.secureIV);

    /*let decrypted = CryptoJS.AES.decrypt(data, _key,
      {keySize:128, iv:_iv, mode:CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})
      .toString();*///(CryptoJS.enc.Utf8);
    let decrypted = CryptoJS.AES.decrypt(data,_key,
        {keySize:256, iv:_iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7})
        .toString(CryptoJS.enc.Utf8);
    //let decrypted = CryptoJS.AES.decrypt(data,_key).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }

  
  public encrypt(data: any, keyP:string = '') {
    let key = (keyP === '' ? this.publicKey : this.getPrivateKey())
    console.log(this.publicKey, this.privateKey)
    if (key.length != 32) { return ''; }
    let _key = CryptoJS.enc.Utf8.parse(key)
    let _iv = CryptoJS.enc.Utf8.parse(this.secureIV)
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), _key, {
      keySize: 256,iv: _iv,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7})

    return encrypted.toString();
  }
  

  public getDocumentations(): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v1/getAll?model=documentaciones'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get<Documents[]>(url,{headers:headers});
  }

  public getDocuments(): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v1/documentos?estatus=1'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get<Documents[]>(url,{headers:headers});
  }

  public getSections(): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v1/getAll?model=articulo_secciones'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get<Documents[]>(url,{headers:headers});
  }

  public getAllArticles(model:string,params?:HttpParams, queries:string = ''):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v1/getAll?model=' + model + queries
    console.log(url)
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get<any>(url,{params:params,headers:headers})
  }

  public getClassifications(): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v1/getAll?model=clasificaciones&estatus=1'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get<Classifications[]>(url,{headers:headers});
  }

  public searchArticle(id: number, request: string): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v1/content?model=articulos&id_documento=' + id + '&where=' + request;
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url ,{headers:headers});
  }

  public searchArticleInEndpointArticle(id: number, request: string): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulos?id_documento=' + id + '&where=' + request;
    console.log('URL', url)
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url ,{headers:headers});
  }

  updateGlobalTitle(globalTitle: string) {
    this.title.next(globalTitle);
  }

  public saveArticle(request: Article): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = this.insert;
    const body = {model: this.models.articulos,data: {
      id_documento:request.id_documento,
      id_titulo:request.id_titulo,
      id_capitulo:request.id_capitulo,
      id_seccion:request.id_seccion,
      articulo:request.articulo,
      indicador:request.indicador,
      indice_numerico:request.indice_numerico,
      indice_alfanumerico:request.indice_alfanumerico,
      contenido:request.contenido, 
      nombre:request.nombre,
      ids_relacionados:request.ids_relacionados,
      fragmentos:request.fragmentos,
      parrafos:request.parrafos}};
    const encryptedBody = this.encrypt(body,'private');
    return this.http.post(url, {text:encryptedBody},{headers:headers});
  }

  public saveClasification(name: string | undefined): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = this.insert;
    const body = {model: this.models.clasificaciones,data:{nombre: name,}};
    const encryptedBody = this.encrypt(body,'private');
    return this.http.post(url, {text:encryptedBody},{headers:headers});
  }

  public saveArticleChapter(request:Article_Chapter):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = this.insert;
    const body = {model:this.models.articulo_capitulos,data:{nombre:request.nombre, id_documento:request.id_documento,id_titulo:request.id_titulo,fecha_creacion:request.fecha_creacion,fecha_modificacion:request.fecha_modificacion}};
    const encrybtedBody = this.encrypt(body,'private')
    return this.http.post(url,{text:encrybtedBody},{headers:headers});
  }

  public saveParagraph(request:Paragraph):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = this.insert
    const body = {model:'articulo_parafo',data:{indicador:request.indicador, orden:request.orden, id_articulo:request.id_articulo, contenido:request.contenido,tipo:request.tipo,numero:request.numero,nombre:request.nombre, relaciones:request.relaciones}};
    console.log(body)
    const encrybtedBody = this.encrypt(body,'private')
    return this.http.post(url,{text:encrybtedBody},{headers:headers});
  }

  public saveDocument(request: Documents): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = this.insert;
    const body = {model: this.models.documentos,data: {titulo:request.titulo, editorial:request.editorial, abreviatura:request.abreviatura, num_articulos:request.num_articulos, ayo:request.ayo, fecha_modificacion:request.fecha_modificacion, fecha_creacion:request.fecha_creacion, clasificacion:request.clasificacion}};
    const encryptedBody = this.encrypt(body,'private');
    return this.http.post(url, {text:encryptedBody},{headers:headers});
  }

  public save(request:any, model:any):Observable<any>{
    if(request && model){
      let headers = new HttpHeaders({
        'Content-type':'application/json',
        'Authorization':`Bearer ${this.getToken()}`
      });
      const url = this.insert;
      const body = {model:model,data:request};
      const encryptedBody = this.encrypt(body);
      return this.http.post(url,{text:encryptedBody},{headers:headers}) 
    }  
    else return new Observable<void>(observer => observer.next())
  }

  public saveArticleTitle(request:Article_Title):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulo_titulo'
    const body = {data:{nombre: request.nombre, id_documento:request.id_documento}};
    console.log(body)
    const encryptedBody = this.encrypt(body, 'private');
    return this.http.post(url,{text:encryptedBody},{headers:headers});
  }

  public saveSection(request:Article_Section):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = this.insert;
    const body = {model:this.models.articulo_secciones,data:{id_capitulo: request.id_capitulo, id_titulo:request.id_titulo, id_documento:request.id_documento, nombre:request.nombre}};
    console.log(body)
    const encryptedBody = this.encrypt(body, 'private');
    return this.http.post(url,{text:encryptedBody},{headers:headers});
  }

  public delete(model:string,id:number):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v1/'+model+'?&id=' + id
    console.log('URL:',url)
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.delete<any>(url,{headers:headers})
  }

  public getCapacitations(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/capacitaciones?id_usuario=' + this.id;
    console.log(url)
    return this.http.get<Capacitations[]>(url, {headers:headers});
  }

  public saveVideoSecond(request: VideoResumeInterface): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = this.update;
    const body = {
      model: 'videos_resumenes',
      data: request 
    }
    const encryptedBody = this.encrypt(body,'private')
    return this.http.put(url, {text:encryptedBody},{headers:headers});
  }

  public saveVideoPeriod(request:any):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/capacitaciones_usuarios_tiempo'
    const body = {
      data:{
        id_usuario:request.id_usuario,
        segundos:request.segundo,
        id_periodo:1
      }
    }
    const encryptedBody = this.encrypt(body,'private')
    return this.http.post(url, {text:encryptedBody},{headers:headers});
  }

  public returnToken(){
    return this.getToken()
  }

  public getCumplimientos(params?:HttpParams):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v1/cumplimiento_mensual';
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url ,{params:params,headers:headers});
  }

  public getCumplimientosControl(params?:HttpParams):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v1/cumplimiento_control';
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url ,{params:params,headers:headers});
  }

  public relateCumplimientoArticulo(body, ext):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/' + ext
    const encryptedBody = this.encrypt(body,'private')
    return this.http.post(url, {text:encryptedBody},{headers:headers});  
  }

  public getArticleById(id):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulos?id=' + id
    return this.http.get(url, {headers:headers});  
  }

  public getTopics():Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/temario'
    return this.http.get(url, {headers:headers});  
  }

  public relateCumplimientoTopics(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/cumplimiento_temario'
    const encryptedBody = this.encrypt(body,'private')
    return this.http.post(url, {text:encryptedBody},{headers:headers});  
  }

  public relateCumplimientoDocumentaciones(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/documentaciones_obligaciones'
    const encryptedBody = this.encrypt(body,'private')
    return this.http.post(url, {text:encryptedBody},{headers:headers});  
  }

  public getCapacitationsSinId(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/capacitaciones';
    console.log(url)
    return this.http.get(url, {headers:headers});
  }

  public relateCumplimientoCapacitaciones(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/cumplimiento_capacitaciones'
    const encryptedBody = this.encrypt(body,'private')
    return this.http.post(url, {text:encryptedBody},{headers:headers});  
  }

  public deleteCumplimientoArticulo(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/cumplimiento_articulos'
    console.log('BODY', body)
    const encryptedBody = this.encrypt(body,'private')
    return this.http.request('delete', url, {body:{text:encryptedBody}, headers:headers, observe:'response'}, );
    //return this.http.delete(url, {data: {text:encryptedBody}}, headers: headers});  
  }

  public getParapgraphs(id_articulo):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulos?id='+id_articulo;
    console.log(url)
    return this.http.get(url, {headers:headers});
  }

  public getParrafo():Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulo_parafo';
    console.log(url)
    return this.http.get(url, {headers:headers});
  }

  public editCumplimiento(body):Observable<any>{
    console.log('BODY', body)
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v2/cumplimiento_control'
    //const encryptedBody = this.encrypt(body,'private')
    return this.http.put(url, {body},{headers:headers});  
  }

  public getAllDocuments(params?):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = `https://api.escudofiscal.alphadev.io/v1/documentos?estatus=1&id=${params}`;
    return this.http.get(url, {headers:headers});
  }

  public getAllChapters(model:string,params?:HttpParams, id:string = ''):Observable<any>{
    const url = `https://api.escudofiscal.alphadev.io/v1/getAll?model=articulo_capitulos`
    console.log(url)
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get<any>(url,{params:params,headers:headers})
  }

  public getAllSections(model:string,params?:HttpParams, id:string = ''):Observable<any>{
    const url = `https://api.escudofiscal.alphadev.io/v1/getAll?model=articulo_secciones`
    console.log(url)
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get<any>(url,{params:params,headers:headers})
  }

  public getAllDocuments2(params?):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = `https://api.escudofiscal.alphadev.io/v1/documentos?estatus=1`;
    return this.http.get(url, {headers:headers});
  }

  public editDoc(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/documentos'
    const encryptedBody = this.encrypt(body,'private')
    console.log(encryptedBody)
    return this.http.put(url, {text:encryptedBody},{headers:headers});  
  }

  public editTit(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulo_titulo'
    const encryptedBody = this.encrypt(body,'private')
    return this.http.put(url, {text:encryptedBody},{headers:headers}); 
  }

  public editClassif(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/clasificaciones'
    const encryptedBody = this.encrypt(body,'private')
    return this.http.put(url, {text:encryptedBody},{headers:headers});  
  }

  public editChapter(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulo_capitulo'
    const encryptedBody = this.encrypt(body,'private')
    return this.http.put(url, {text:encryptedBody},{headers:headers});  
  }


  public editSection(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulo_secciones'
    const encryptedBody = this.encrypt(body,'private')
    return this.http.put(url, {text:encryptedBody},{headers:headers});  
  }

  public editArticle(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulos'
    const encryptedBody = this.encrypt(body,'private')
    return this.http.put(url, {text:encryptedBody},{headers:headers});  
  }

  public editParagraph(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v1/articulo_parafo'
    const encryptedBody = this.encrypt(body,'private')
    return this.http.put(url, {text:encryptedBody},{headers:headers});  
  }

  //-------ENDPOINTS DE LA VERSION 2-------//

  //ENDPOINTS PARA PERFILES

  public getProfiles():Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/profile'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  public createProfile(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v2/profile'
    return this.http.post(url, body,{headers:headers}); 
  }

  //ENDPOINTS PARA MÓDULOS

  public getModules():Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/module'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  //ENDPOINTS PARA CUMPLIMIENTO CONTROL

  public editDates(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v2/cumplimiento_control'
    return this.http.put(url, body,{headers:headers});  
  }
}
