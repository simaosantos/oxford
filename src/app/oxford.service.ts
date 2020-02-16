import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rejects } from 'assert';

@Injectable({ providedIn: 'root' })
export class oxfordService {
    constructor(private http: HttpClient) { }
    

    getWords(word: string) {
        const promise = this.http.get(`http://localhost:8000/?word=${word}`).toPromise();
        console.log(promise);
        promise.then((data) => {
            console.log("Promise resolved with: " + JSON.stringify(data));
            
        }).catch((error) => {
            console.log("Promise rejected with " + JSON.stringify(error));
        });
        return promise;
    }


}

