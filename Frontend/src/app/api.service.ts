import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  uri = 'https://localhost:8000/api/v1';
  account: any;
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(loginName: string, password: string) {
    this.http.post(this.uri + '/user/login', { login: loginName, password: password })
      .subscribe((resp: any) => {
        if (resp.status = true) {
          this.account = resp.account
          localStorage.setItem('token', this.account.token);
          var decoded = jwt_decode(this.account.token); 
          this.router.navigate(['explorer']);
        }
      });
  }
  logout() {
    localStorage.removeItem('token');
  }
 
  public loggedIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }

  public GetAccountID(): any {
    var tokenInfo = jwt_decode(localStorage.getItem('token')); 
    
    return tokenInfo.UserId;
  }

  public GetToken(): any {
    return localStorage.getItem('token'); 
  }

  public newDocument(name: string) {

    const myHeaders = new HttpHeaders().set('Authorization', this.GetToken());

    const body = { name: name, authorID: this.GetAccountID() };
    this.http.post(this.uri + '/document/new', body, { headers: myHeaders })
      .subscribe((resp: any) => {
        if (resp.status = true) {
          console.log(resp)
          this.router.navigate(['explorer']);
        }
      });
  }

  public getDocuments() : Observable<any> {
    const myHeaders = new HttpHeaders().set('Authorization', this.GetToken());
    return this.http.get<any>(this.uri + '/documents', { headers: myHeaders });    
  } 

  public getSnapshots(DocID : number) : Observable<any> {
    const headerDict = {
      'Authorization': this.GetToken(),
      'DocumentID': DocID.toString()
    }
    const myHeaders = new HttpHeaders(headerDict)
    return this.http.get<any>(this.uri + '/snapshots', { headers: myHeaders });    
  }
  
  public loadSnapshot(SnapshotID : number) : Observable<any> {
    const headerDict = {
      'Authorization': this.GetToken(),
      'SnapshotID': SnapshotID.toString()
    }
    const myHeaders = new HttpHeaders(headerDict)
    return this.http.get<any>(this.uri + '/snapshot', { headers: myHeaders });    
  }

  public saveSnapshot(Snapshot : any) : Observable<any> {
    const headerDict = {
      'Authorization': this.GetToken()
    }
    const myHeaders = new HttpHeaders(headerDict)
    const body = { DocID: +Snapshot.DocID, Data: Snapshot.Data };
    return this.http.post<any>(this.uri + '/snapshot', body, { headers: myHeaders });
  }
} 
