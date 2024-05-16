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
import { Questionnaire, QuestionnaireSave } from '../interfaces/questionnaire-interface';

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

  public getConversation(from: string, to: string): Observable<any> {
    const url = `https://api.escudofiscal.alphadev.io/v2/mensajes/conversation?from=${from}&to=${to}`;
    let headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(url, { headers: headers });
  }

  public getUnread(from: string, to: string): Observable<any> {
    const url = `https://api.escudofiscal.alphadev.io/v2/mensajes/unread?from=${from}&to=${to}`;
    let headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(url, { headers: headers });
  }
  
  

  public getUserById(id:number):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v1/usuarios?id=' + id
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
      // if(res.token) return res.token;
      // else return environment.token;
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoyLCJpYXQiOjE3MTQ0NTA2NDh9.1vVf38Moc3dt-KCSJEVDz7j0aZT_TUo55mikizCLB88'
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

  public getUnreadNotifications(){
    if(localStorage['ef_notifications_unread']){
      let res = JSON.parse(localStorage.getItem('ef_notifications_unread' || '{[]}'))
      return res
    }
  }

  public getUnreadNotificationsAmmount(){
    if(localStorage['ef_notifications_unread_ammount']){
      let res = JSON.parse(localStorage.getItem('ef_notifications_unread_ammount' || '0'))
      return res
    } else{
      return '0'
    }
  }

  public postUnreadNotificationsAmmount(ammount:number) {
    localStorage.setItem('ef_notifications_unread_ammount', ammount.toString())
  }

  public postUnreadNotifications(object:any) {
    localStorage.setItem('ef_notifications_unread', JSON.stringify(object))
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

  public getCumplimientosControl(params?:HttpParams):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v1/cumplimiento_control';
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url ,{params:params,headers:headers});
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

  public getQuestionnaire(id: number): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = "https://api.escudofiscal.alphadev.io/v1/getAll?model=capacitaciones_preguntas&id_video=" + id;
    console.log(url)
    return this.http.get<Questionnaire[]>(url,{headers:headers});
  }

  public saveQuestionnaire(request: QuestionnaireSave): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = this.insert;
    const body = {
      model: "capacitaciones_historial",
      data: request
    }

    const encryptedBody = this.encrypt(body,'private')
    return this.http.post(url, {text:encryptedBody}, {headers:headers});
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

  public postModules(body:any):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/module'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.post(url, body, {headers:headers})
  }

  public putModules(body:any):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/module'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.put(url, body, {headers:headers})
  }

  public putPerfilesModulos(body:any):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/perfiles_modulos'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.put(url, body, {headers:headers})
  }

  public addProfileModulos(body:any):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/module/add_profile'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.put(url, body, {headers:headers})
  }

  public deleteProfileModule(body:any):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/module/delete_profile'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.put(url, body, {headers:headers})
  }

  //ENDPOINTS PARA CUMPLIMIENTO CONTROL

  public getCumplimientos(start:number, end:number):Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/task/dates?start=' + start + '&end=' + end
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  public editDates(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    body = JSON.stringify(body)
    const url = 'https://api.escudofiscal.alphadev.io/v2/task'
    console.log(body)
    return this.http.put(url, body,{headers:headers});  
  }

  public getMissing():Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/task/uncompleted_tasks'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  //ENDPOINTS PARA LOS DÍAS FESTIVOS

  public getDiasFestivos():Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/dia_festivo'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  public postDiasFestivos(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v2/dia_festivo'
    return this.http.post(url, body,{headers:headers});  
  }

  public deleteDiaFestivo(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v2/dia_festivo/delete'
    return this.http.put(url, body,{headers:headers});  
  }

  //ENDPOINTS PARA LAS EMPRESAS

  public getEmpresas():Observable<any>{
    const url = 'https://api.escudofiscal.alphadev.io/v2/empresa'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  public postEmpresas(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v2/empresa'
    return this.http.post(url, body,{headers:headers});  
  }

  public putEmpresas(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v2/empresa'
    return this.http.put(url, body,{headers:headers});  
  }

  public deleteEmpresas(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v2/empresa/delete'
    return this.http.put(url, body,{headers:headers});  
  }

  //ENDPOINTS PARA LAS OBLIGACIONES

  public postObligations( data: any): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/obligation';
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(url, data, { headers: headers })
  }

  public putObligations( data: any ): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/obligation';
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put(url, data, { headers: headers })
  }

  //ENDPOINTS PARA VIDEOS

  public getVideos(type:string):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/video?category=' + type
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  public getAllVideos():Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/video'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  public getNews():Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/video?category=news&orderby=date:desc&limit=12'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  public async watch(name:string):Promise<Blob> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/video/watch?route=' + name
    console.log(url)
    // let headers = new HttpHeaders({
    //   //'Content-type':'application/json',
    //   'Authorization':`Bearer ${this.getToken()}`
    // });
    const response = await fetch(url, {
      method:'GET',
      headers: {
        //'Content-type':'application/json',
        'Authorization':`Bearer ${this.getToken()}`
      }
    })
    console.log(response)
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const data = await response.blob();
    return data;
  }

  public postVideos(data:FormData):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/video'
    let headers = new HttpHeaders({
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.post(url, data, {headers:headers})
  }

  public putVideos(data:FormData):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/video'
    let headers = new HttpHeaders({
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.put(url, data, {headers:headers})
  }

  public deleteVideos(data:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/video'  
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.delete(url, { headers: headers, body: data });  
  }

  //ENDPOINTS PARA CAPACITACIONES

  public getAllCapacitations():Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/capacitaciones'
    let headers = new HttpHeaders({
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url, {headers:headers})
  }

  public postCapacitations(data:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/capacitaciones'
    let headers = new HttpHeaders({
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.post(url, data, {headers:headers})
  }

  public putCapacitations(data:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/capacitaciones'
    let headers = new HttpHeaders({
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.put(url, data, {headers:headers})
  }

  public deleteCapacitation(id:number):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/capacitaciones/' + id
    let headers = new HttpHeaders({
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.delete(url, {headers:headers})
  }

  public postQuestionAndAnswer(body:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/questionarie'
    let headers = new HttpHeaders({
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.post(url, body, {headers:headers})
  }

  public getQuestionAndAnswer(id:number):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/questionarie/' + id
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{headers:headers})
  }

  public putQuestionAndAnswer(body:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/questionarie'
    let headers = new HttpHeaders({
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.put(url, body, {headers:headers})
  }

  //ENDPOINTS PARA LIGAR OBLIGACIONES CON COSAS

  public relateCumplimientoArticulo(body:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/obligation/add_articles'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.put(url, body, {headers:headers})
  }

  public deleteCumplimientoArticulo(body:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/obligation/delete_articles'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.delete(url, { headers: headers, body: body });  
  }

  public relateCumplimientoParrafo(body:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/obligation/add_paragraphs'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.put(url, body, {headers:headers})
  }

  public deleteCumplimientoParrafo(body:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/obligation/delete_paragraphs'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.delete(url, { headers: headers, body: body });  
  }

  public relateCumplimientoTopics(body):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    const url = 'https://api.escudofiscal.alphadev.io/v2/obligation/add_subjects'
    return this.http.put(url, body,{headers:headers});  
  }

  public deleteCumplimientoTopics(body:any):Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/obligation/delete_subjects'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.delete(url, { headers: headers, body: body });  
  }

  //ENDPOINTS PARA LOGS

  public getAllLogs():Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v2/action'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url, {headers: headers});  
  }
}
