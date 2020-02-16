import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { oxfordService } from '../oxford.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-search',
  templateUrl: './word-search.component.html',
  styleUrls: ['./word-search.component.css']
})

export class WordSearchComponent implements OnInit {
  searchWord = ''
  definition: any;
  words = []
  filteredWords = []
  searchForm = new FormControl('');
  errorMessage = ''
  userWord = ''
  isLoading = false;

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
    this.oxfordservice.getWords(this.searchWord)
      .then(
         data => 
         {
           this.definition = data
           this.router.navigate(['/definition', this.definition.id]);
         },
         err => console.log('Error finding word', err) 
       
      )


      console.log('after')
  //  console.log('definition', this.definition)
  //  this.router.navigate(['/definition', this.definition.id]);

    //let teste =
    //this.http.getWords(this.searchWord)//.subscribe(data => console.log(data.json()))
    //  console.log(teste)
    //.subscribe(data => console.log('data', data))
  }

}



