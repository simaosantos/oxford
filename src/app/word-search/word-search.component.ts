import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { oxfordService } from '../oxford.service';
import { Router } from '@angular/router';
import { Definition } from '../definition';

@Component({
  selector: 'app-word-search',
  templateUrl: './word-search.component.html',
  styleUrls: ['./word-search.component.css']
})

export class WordSearchComponent implements OnInit {
  searchWord = ''
  definition: Definition;
  words = []
  filteredWords = []
  searchForm = new FormControl('');
  errorMessage = ''
  userWord = ''
  isLoading = false;
  definitionOLD
  
  constructor(private https: HttpClient, private oxfordservice: oxfordService, private router: Router, ) {

  }
  ngOnInit() {
    this.searchForm.valueChanges
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

  public async redirect(event: any) {
    this.searchWord =  await event.target.value;
    console.log('ola', this.searchWord)
    this.oxfordservice.getWordInfo(this.searchWord)
      .subscribe(
         data => 
         {
           this.definitionOLD = data
           this.router.navigate(['/definition', this.definition.word]);
         },
         err => console.log('Error finding word', err) 
       
      )


  }

}



