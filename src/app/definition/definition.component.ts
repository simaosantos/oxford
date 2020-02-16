import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { oxfordService } from '../oxford.service'

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.css']
})
export class DefinitionComponent implements OnInit {
  currentWord: ''
  selectedId: string;
  public partOfSpeech = '';
  public fullData;
  public resultsObj = {
    word: "",
    language: ""
  };
  public exampleSentence;
  public etymology;
  public definition = [];
  public audioSource;
  public pronunciation;
  public lexicalEntries = [];
  public residueRemoved = [];
  public wordOrigin = '';
  public varientForms = [];
  public show = false;
  public notes = [];
  public antonyms = [];
  public synonyms = [];
  constructor(private route: ActivatedRoute, private oxfordservice: oxfordService) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.currentWord = routeParams.id;
      this.oxfordservice.getWords(routeParams.id).then(
        data => {
          this.fullData = data;
          //console.log(this.fullData)
          this.updateData(this.fullData);
          this.setPartofSpeech()
          this.setAudioSource()
          this.setPronunciation()
          this.setDefinitions()
          this.setEtymology();
          this.setExample();
        },
        error => {
          console.log(error)
        }
      );
    });
  }

  updateData(data) {
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

  setPartofSpeech() {
    this.partOfSpeech = this.lexicalEntries[0]['lexicalCategory']['text'];
  }
  setPronunciation() {
    this.pronunciation = this.lexicalEntries[0]['pronunciations'][0]["phoneticSpelling"];

  }
  setAudioSource() {
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
  setDefinitions() {
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
  setEtymology() {
    try {
      if (this.lexicalEntries[0]['entries'][0]['etymologies']) {
        this.etymology = this.lexicalEntries[0]['entries'][0]['etymologies'][0];
      }
      else this.etymology = "sorry, no etymology available"
    } catch (error) {
      console.log("Error setting etymology", error)
    }

  }
  setExample() {
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

  play(audio) {
    audio.play(); // play audio on clicking speak icon
  }




}

