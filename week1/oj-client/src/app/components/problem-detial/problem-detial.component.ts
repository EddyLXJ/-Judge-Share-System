import {Component, Inject, OnInit} from '@angular/core';
import {Problem} from '../../models/problem.model';
import { ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-problem-detial',
  templateUrl: './problem-detial.component.html',
  styleUrls: ['./problem-detial.component.css']
})
export class ProblemDetialComponent implements OnInit {
  problem: Problem;
  constructor(
    private route: ActivatedRoute,
    @Inject('data') private data
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.problem = this.data.getProblem(+params['id']);
    });
  }

}
