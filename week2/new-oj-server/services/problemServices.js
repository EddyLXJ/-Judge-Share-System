var problems = [{
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
    },
    {
      id: 4,
      name: 'taajj',
      desc: 'asdfasdfsggas',
      difficulty: 'super'
    }
];

var getProblems = function () {
    return new Promise((resolve, reject) => {
        resolve(problems);
    });
}

var getProblem = function (id) {
    return new Promise((resolve, reject) => {
        resolve(problems.find(problem => problem.id === id));
    });
}

var addProblem = function (newProblem) {
    return new Promise((resolve, reject) =>{
        if (problems.find(problem => problem.name === newProblem.name)){
            reject("Problem already exists");
        } else {
            newProblem.id = problems.length + 1;
            problems.push(newProblem);
            resolve(newProblem);
        }
    });
} 

module.exports = {
    getProblems: getProblems,
    getProblem: getProblem,
    addProblem: addProblem
}