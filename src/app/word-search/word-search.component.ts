import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-word-search',
  templateUrl: './word-search.component.html',
  styleUrls: ['./word-search.component.css']
})

export class WordSearchComponent implements OnInit {

  words = []
  filteredWords = []
  searchWord = new FormControl('');
  errorMessage = ''
  userWord = ''
  isLoading = false;

  constructor(private https: HttpClient) {

  }
  ngOnInit() {
    this.searchWord.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMessage = '';
          this.words = [];
          this.isLoading = true;
        }),
        switchMap(value => this.https.get("https://api.datamuse.com/sug?s=" + value)
          .pipe(
            map(result => JSON.parse(JSON.stringify(result))),
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        const filteredwords = data.map(word => word.word)
        if (filteredwords[0] == undefined) {
          this.errorMessage = filteredwords['Error'];
          this.words = [];
        } else {
          this.errorMessage = "";
          this.words = filteredwords;
        }
      });
  }

 public onClick(){
   
 }

}



