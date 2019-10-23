import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }
    baseUrl: string = 'http://localhost:3000/monty/';

    saveSystemConfig(configPayload: any) {
        console.log("service layer::::", configPayload);
        return this.http.post(`${this.baseUrl}config/storeConfig`, configPayload);
    }
    saveBlackList(blackListPayload: any) {
        console.log("service layer::::", blackListPayload);
        return this.http.post(`${this.baseUrl}black/storeBlackList`, blackListPayload);
    }
    saveWhiteList(whiteListPayload: any) {
        console.log("service layer::::", whiteListPayload);
        return this.http.post(`${this.baseUrl}white/storeWhiteList`, whiteListPayload);
    }
    fetchSystemConfig(){
        return this.http.get(`${this.baseUrl}config/`);
    }
    fetchWhiteList(){
        return this.http.get(`${this.baseUrl}white/`);
    }
    fetchBlackList(){
        return this.http.get(`${this.baseUrl}black/`);
    }

}