import {Component, Inject, OnInit} from '@angular/core'
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {throwError} from 'rxjs';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;
  defaultContent = {
    "Java" : `public class Example {
  public static void main(String[] args){
      //Type your code here
  }
}
`,
    'C++' : `#include <iostream> 
using namespace std;
    
int main(){
  //Type your C++ code here
  return 0;
}
`,
    'Python' : `class Solution:
    
def example():
  #Write your Python code here
`
  }
  public languages: string[] = ['Java', 'C++', 'Python'];
  language: string = 'Java';
  sessionId: string;

  constructor(@Inject('collaboration') private collaboration,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
      });
  }

  initEditor() {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();
    this.editor.$blockScrolling = Infinity;

    document.getElementsByTagName('textarea')[0].focus();

    this.collaboration.init(this.sessionId, this.editor);
    this.editor.lastAppliedChange = null;

    this.editor.on('change', (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    });

    this.editor.session.getSelection().on('changeCursor', () => {

      let cursor = this.editor.session.getSelection().getCursor();
      console.log('cursor N=move: ' + JSON.stringify(cursor));
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });
  }

  setLanguage(language: string): void{
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void{
    let lan = this.language.toLowerCase()
    if (lan == 'c++'){
      lan = 'c_cpp';
    }
    this.editor.session.setMode('ace/mode/' + lan);
    this.editor.setValue(this.defaultContent[this.language]);
  }

  sumbit(): void{
    let userCode = this.editor.getValue();
    console.log(userCode);
  }

}
