
var ProblemModel = require("../models/problemModel");

var getProblems = function () {
  return new Promise((resolve, reject) => {
    ProblemModel.find({}, function(error, problems) {
      if (error){
        reject(error);
      } else {
        resolve(problems);
      }
    });
  });
}

var getProblem = function (id) {
  return new Promise((resolve, reject) => {
    ProblemModel.findOne({id: id}, function(error, problem) {
      if (error){
        reject(error);
      } else {
        resolve(problem);
      }
    });
  })
}

var addProblem = function (newProblem) {
  return new Promise((resolve, reject) => {
    ProblemModel.findOne({name: newProblem.name}, function(error, problem) {
      if (problem){
        reject("Problem name already exists");
      } else {
        ProblemModel.count({}, function(err, num){
          newProblem.id = num + 1;
          var mProblem = new ProblemModel(newProblem);
          mProblem.save();
          resolve(mProblem);
        });
      }
    });
  })
}

module.exports = {
  getProblems:getProblems,
  getProblem:getProblem,
  addProblem:addProblem
}
