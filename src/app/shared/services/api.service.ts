import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

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


  public content(model:string="", where:string="", orderby:string="",limit:number=-1, offset:number=-1, querys:Object=null): Observable<any>{
    const url = environment.baseUrl+`content`;
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
    });
    return this.http.get(url,{params:params,headers:headers});
  }

  /**
   * Function to get obligations by date and period
   * @param params date param it's neccesary to get results, and period it's optional
   * @returns response with obligations
   */
  public dates(params:HttpParams):Observable<any>{
    //const url = 'http://192.168.100.154:3000/v1/getAll?model=obligaciones'
    const url = 'https://api.escudofiscal.alphadev.io/v1/getAll?model=obligaciones'
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.getToken()}`
    });
    return this.http.get(url,{params:params,headers:headers});
  }

  public login(body: any): Observable<any> {
    console.log("body",body)
    const encryptedBody = this.encrypt(body, '');
    console.log("encrybtedBody", encryptedBody)
    console.log("llave",this.publicKey)
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

  public deleteUser(userId: number): Observable<any> {
    const url = environment.baseUrl + 'delete'; 
    console.log("id", userId);
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });  
         
    let params = new HttpParams().set('model', 'usuarios');
    params = params.append('id', userId.toString());
    return this.http.delete(url, { headers, params });
  }

  public postUser(data: any): Observable<any> {
    const url = environment.baseUrl + 'insert'; 
    console.log("data",data)
    const encryptedData = this.encrypt(data, "1")
    let body = ({
      text:encryptedData
    })
    console.log("body",body)
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(url, body, { headers });
  }
  

  /*
  public login(body:any):Observable<any>{
    return this.http.post(environment.baseUrl+'login',body,{});
  }
  */

  public postObligations( data: any): Observable<any> {
    const url = 'https://api.escudofiscal.alphadev.io/v1/insert';
    console.log("data",data)
    //let dataStr = JSON.stringify(data);
    const encryptedData = this.encrypt(data, "1");
    if(encryptedData == "") {
      console.log("PP", this.privateKey)
      this.encrypt(data,"private")
    }
    let body = ({
      text:encryptedData
    });
    console.log("body",body);
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(url, body, { headers: headers }).pipe(
      catchError((error) => {
        console.error(error);
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
    console.log(localStorage)
    if(localStorage[this.TOKEN]){
      let res = JSON.parse(localStorage.getItem(this.TOKEN) || "");
      console.log('res',res)
      if(res.token) return res.token;
      else return environment.token;
    }
  }

  public getPrivateKey(){
    if(localStorage[this.TOKEN]){
      let res = JSON.parse(localStorage.getItem(this.TOKEN) || "");
      if(res.token) return res.llave;
      else return '';
    }
  }


  privateKey = '';
  publicKey = 'krmhNDxjib2pcllpk8zKABzauZgz4pc/';//'ex0ix+S22lFhQXcEVrcT1nYmqD+6OAS5';//'64963515cacd41b683cb4ca8305a30ae';
  secureIV = '1ae68ad336c3a81e';
  public decrypt(data:any, keyP:string = ''){
    this.privateKey = keyP;
    let key = (keyP === '') ? this.publicKey : this.privateKey;
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
    console.log(data)
    return decrypted;
  }

  
public encrypt(data: any, keyP:string = '') {
    let key = (keyP === '' ? this.publicKey : this.privateKey)
    console.log(this.publicKey, this.privateKey)
    if (key.length != 32) { return ''; }
    let _key = CryptoJS.enc.Utf8.parse(key)
    let _iv = CryptoJS.enc.Utf8.parse(this.secureIV)
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), _key, {
      keySize: 256,iv: _iv,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7})

    return encrypted.toString();
  }
  




}
