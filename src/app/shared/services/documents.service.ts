import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Documents } from '../interfaces/documents-interface';
import { Article, Article_Chapter, Article_Section, Article_Title } from '../interfaces/article-interface';
import { Classifications } from '../interfaces/classifications-interface';
import { Obligations, ObligationsClient, ObligationsGet, ObligationsPeriod, ObligationsRegime, ObligationsType } from '../interfaces/obligations-interface';
import { Clients, ClientsObligations } from '../interfaces/clients-interface';
import { Regime } from '../interfaces/regime-interface';

import { SaveQuestion } from '../components/questions/questions.component';
import { DocumentationActDct, Documentations, DocumentationSet } from '../interfaces/documentations-interface';
import { Capacitations } from '../interfaces/capacitations-interface';
import { Questionnaire, QuestionnaireSave } from '../interfaces/questionnaire-interface';
import { VideoResumeInterface } from '../interfaces/video-resume-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  readonly TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYXNlIjoiZGFuaWVsQGFscGhhZGV2LmlvIiwiaWF0IjoxNjgzMTcwNDk2fQ.4bv05c7XwJ4ScTTTPYPJPgt0JqWWZJe63AikoGbEv9o";

  get:string = `${environment.url_base}getAll?model=`
  insert: string = 'https://apief.globalbusiness.com.mx/v1/insert';
  update: string = 'https://apief.globalbusiness.com.mx/v1/update';
  models = {clasificaciones:"clasificaciones",documentos:"documentos",documentaciones:"documentaciones",
    articulo_titulos:"articulo_titulos",articulo_capitulos:"articulo_capitulo", 
    articulo_secciones:"articulo_secciones",articulos:"articulos",clientes:"clientes",obligaciones:"obligaciones",
    obligaciones_tipos:"obligaciones_tipos",regimen_fiscal:"regimen_fiscal"}

  constructor(public http: HttpClient) {}
  /** GETS */
  public getAll(model:string,params?:HttpParams):Observable<any>{
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.TOKEN}`
    });
    return this.http.get<any>(this.get + model,{params:params,headers:headers})
  }

  public getDocuments(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.TOKEN}`
    });
    return this.http.get<Documents[]>(this.get + this.models.documentos,{headers:headers});
  }

  public getTitles(params?:HttpParams):Observable<any>{
    return this.http.get<Article_Title[]>(this.get + this.models.articulo_titulos,{params:params})
  }

  public getObligations(): Observable<any> {
    return this.http.get<ObligationsGet>(this.get + this.models.obligaciones);
  }

  public getObligationsType(): Observable<any> {
    return this.http.get<ObligationsType[]>(this.get + this.models.obligaciones_tipos);
  }

  public getClassifications(): Observable<any> {
    return this.http.get<Classifications[]>(this.get + this.models.clasificaciones);
  }

  public getClients(): Observable<any> {
    return this.http.get<Clients[]>(this.get + this.models.clientes);
  }

  public getClientObligations(id: number): Observable<any> {
    const url = 'https://apief.globalbusiness.com.mx/v1/getAll?model=clientes' + '&id=' + id + '&template=obligaciones';
    return this.http.get<ClientsObligations[]>(url);
  }

  public getDates(day: number, type?: string): Observable<any> {
    type === 'month' ? type = "" : "";
    const url = 'https://apief.globalbusiness.com.mx/v1/dates?day=' + day + '&period=' + type;
    return this.http.get(url);
  }

  public getRegime(): Observable<any> {
    return this.http.get<Regime[]>(this.get + this.models.regimen_fiscal);
  }
  
  public getDocumentations(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.TOKEN}`
    });
    return this.http.get<Documentations[]>(this.get + this.models.documentaciones,{headers:headers});
  }

  public getDocumentationsTemplate(): Observable<any> {
    const url = 'https://apief.globalbusiness.com.mx/v1/getAll?model=documentaciones&template=obligaciones';
    return this.http.get<Documentations[]>(url);
  }

  public getCapacitations(): Observable<any> {
    const url = 'https://apief.globalbusiness.com.mx/v1/getAll?model=capacitaciones&id_usuario=2';
    return this.http.get<Capacitations[]>(url);
  }

  public getQuestionnaire(id: number): Observable<any> {
    const url = "https://apief.globalbusiness.com.mx/v1/getAll?model=capacitaciones_preguntas&id_video=" + id;
    return this.http.get<Questionnaire[]>(url);
  }

  /**POSTS */

  public saveArticle(request: Article): Observable<any> {
    const url = this.insert;
    const body = {model: this.models.articulos,data: request};
    return this.http.post(url, body);
  }

  public saveDocument(request: Documents): Observable<any> {
    const url = this.insert;
    const body = {model: this.models.documentos,data: request};
    return this.http.post(url, body);
  }

  public saveClasification(name: string | undefined): Observable<any> {
    const url = this.insert;
    const body = {model: this.models.clasificaciones,data:{nombre: name,}};
    return this.http.post(url, body);
  }

  public saveArticleTitle(request:Article_Title):Observable<any>{
    return this.http.post(this.insert, {model:this.models.articulo_titulos,data:request});
  }

  public saveArticleChapter(request:Article_Chapter):Observable<any>{
    return this.http.post(this.insert, {model:this.models.articulo_capitulos,data:request});
  }

  public save(request:any, model:any):Observable<any>{
    if(request && model)  return this.http.post(this.insert,{model:model,data:request}) 
    else return new Observable<void>(observer => observer.next())
  }

  public saveObligationsTypes(request: ObligationsType): Observable<any> {
    const body = {
      model: "obligaciones_tipos",
      data: {
        nombre: request.nombre,
        color: request.color,
      }
    };
    return this.http.post(this.insert, body);
  }

  public saveObligationsPeriod(request: ObligationsPeriod): Observable<any> {
    const body = {
      model: "obligaciones_periodos",
      data: {
        nombre: request.nombre,
        minutos: request.minutos,
      }
    };
    return this.http.post(this.insert, body);
  }

  public getObligationsPeriod(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type':'application/json',
      'Authorization':`Bearer ${this.TOKEN}`
    });
    const url = 'https://apief.globalbusiness.com.mx/v1/getAll?model=obligaciones_periodos';
    return this.http.get<ObligationsPeriod[]>(url,{headers:headers});
  }

  public saveObligations(request: Obligations): Observable<any> {
    const url = this.insert;
    const body = {
      model: "obligaciones",
      data: request,
    };
    return this.http.post(url, body);
  }

  public saveClientObligations(request: ObligationsClient): Observable<any> {
    const url = this.insert;
    const body = {
      model: "obligaciones_clientes",
      data: request
    };
    return this.http.post(url, body);
  }

  public saveRegimeObligations(request: ObligationsRegime): Observable<any> {
    const url = this.insert;
    const body = {
      model: "regimen_obligaciones",
      data: request
    };
    return this.http.post(url, body);
  }

  public saveQuestion(data: SaveQuestion): Observable<any> {
    const url = this.insert;
    const body = {
      model: "preguntas",
      data: data
    }
    return this.http.post(url, body);
  }

  public searchArticle(id: number, request: string): Observable<any> {
    const url = 'https://apief.globalbusiness.com.mx/v1/search?model=articulos&id_documento=' + id + '&query=' + request;
    return this.http.get(url);
  }

  public searchRelated(word: string | undefined): Observable<any> {
    const url = 'https://apief.globalbusiness.com.mx/v1/search?query=' + word;
    return this.http.get(url);
  }

  public searchObligations(word: string | undefined): Observable<any> {
    const url = 'https://apief.globalbusiness.com.mx/v1/search?model=obligaciones&query=' + word;
    return this.http.get(url);
  }

  public saveDocumentations(request: DocumentationSet): Observable<any> {
    const url = this.insert;
    const body = {
      model: "documentaciones",
      data: request
    }
    return this.http.post(url, body);
  }

  public actDctDocumentation(opt: string, request: DocumentationActDct): Observable<any> {
    const url = this.insert + "?template=" + opt;
    const body = {
      model: "documentaciones",
      data: request
    }
    return this.http.post(url, body);
  }

  

  public saveVideoSecond(request: VideoResumeInterface): Observable<any> {
    const url = this.update;
    const body = {
      model: 'videos_resumenes',
      data: request 
    }
    return this.http.put(url, body);
  }

}