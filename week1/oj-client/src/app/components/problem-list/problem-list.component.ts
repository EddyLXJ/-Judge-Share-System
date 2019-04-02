import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';

const PROBLEMS: Problem[] = [{
  id: 1,
  name: 'haha',
  desc: 'Given an arrasdf asdfsvdasvhajbsfjhbjbjhasbdjf ajshbf hjasbfhjasbdfjhb asdhjbf jahsb lsab jhab ',
  difficulty: 'easy'
},
  {
    id: 2,
    name: 'hahaa',
    desc: 'Givena an arrasdf asdfsvdasvhajbsfjhbjbjhasbdjf ajshbf hjasbfhjasbdfjhb asdhjbf jahsb lsab jhab ',
    difficulty: 'medium'
  },
  {
    id: 3,
    name: 'hahasdfaa',
    desc: 'Giasdfvena an arrasdf asdfsvdasvhajbsfjhbjbjhasbdjf ajshbf hjasbfhjasbdfjhb asdhjbf jahsb lsab jhab ',
    difficulty: 'hard'
  }
];
@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

  problems: Problem[];
  constructor() { }

  ngOnInit() {
    this.problems = PROBLEMS;
  }

}
