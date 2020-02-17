import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Definition } from './definition'
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class oxfordService {
    constructor(private http: HttpClient) { }


    getWordInfo(word: string): Observable<Definition[]> {
        return this.http.get<Definition[]>(`http://localhost:8000/?word=${word}`).pipe(
            tap(
                data => {
                    if (data.length) {
                        updateData(data);
                        setPartofSpeech()
                        setAudioSource()
                        setPronunciation()
                        setDefinitions()
                        setEtymology();
                        setExample();
                    }
                },
                error => {
                    console.log(error)
                }
            ));
    }

}


function updateData(data) {
    if (data) {
        this.resultsObj = data.results['0'];
        this.lexicalEntries = this.resultsObj['lexicalEntries'];
    }
    else throw ('Error getting word defintion')
    /*
    
        // Remove Residue data from the full data
        this.residueRemoved = this.lexicalEntries.filter(
          lexicalEntry => lexicalEntry.lexicalCategory !== 'Residual'
        ); */
}

function setPartofSpeech() {
    this.partOfSpeech = this.lexicalEntries[0]['lexicalCategory']['text'];
}
function setPronunciation() {
    this.pronunciation = this.lexicalEntries[0]['pronunciations'][0]["phoneticSpelling"];

}
function setAudioSource() {
    let aux = this.lexicalEntries[0]['pronunciations']
    if (aux) {
        for (let i = 0; i < aux.length; i++) {

            if (aux[i].audioFile) {
                this.audioSource = aux[i].audioFile;

                break;
            }

        }
    }
    else console.log("Error getting audio file");
}
function setDefinitions() {
    try {
        let aux = this.lexicalEntries[0]['entries'][0]["senses"];
        let subsenses = this.lexicalEntries[0]['entries'][0]["senses"][0]["subsenses"];
        // this.definition.push(aux['senses'][0]['definitions'][0]);
        aux.find(def => {
            if (def.definitions != undefined) {
                this.definition.push(def.definitions)
            }
        })
        if (this.definition.length == 0) {
            subsenses.find(def => {
                if (def.definitions != undefined) {
                    this.definition.push(def.definitions)
                }
            })
        }
    } catch (error) {
        console.log("Error setting Definitions", error)
    }

}
function setEtymology() {
    try {
        if (this.lexicalEntries[0]['entries'][0]['etymologies']) {
            this.etymology = this.lexicalEntries[0]['entries'][0]['etymologies'][0];
        }
        else this.etymology = "sorry, no etymology available"
    } catch (error) {
        console.log("Error setting etymology", error)
    }

}
function setExample() {
    try {
        if (this.lexicalEntries[0]['entries'][0]['senses'][0]['examples']) {
            this.exampleSentence = this.lexicalEntries[0]['entries'][0]['senses'][0]['examples'][0]['text'];
        }
        else if (this.lexicalEntries[0]['entries'][0]['senses'][0]['subsenses'][0]['examples'][0]['text']) {
            this.exampleSentence = this.lexicalEntries[0]['entries'][0]['senses'][0]['subsenses'][0]['examples'][0]['text'];
        }
    } catch (error) {
        console.log("Error setting example setence", error)
    }

}



