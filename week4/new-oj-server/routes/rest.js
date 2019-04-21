var express = require("express")
var router = express.Router();
var problemService = require('../services/problemService')
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var nodeRestClient = require('node-rest-client').Client;
var restClient = new nodeRestClient();

EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run'

restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');

router.get("/problems", function( req, res ){
  problemService.getProblems()
                .then(problems => res.json(problems));
});

router.get("/problems/:id", function( req, res) {
  var id = req.params.id; //express
  problemService.getProblem(+id)
                .then(problem => res.json(problem));
});


router.post("/problems",jsonParser, function( req, res ) {
  problemService.addProblem(req.body)
                .then(function (problem) {
                  res.json(problem);
                }, function( error ){
                  res.status(400).send("Problem name already exists");
                });
});



router.post("/build_and_run", jsonParser, function( req, res) {
  const userCode = req.body.userCode;
  const lang = req.body.lang;

  console.log(lang + ";" + userCode);
  var args = {
    data : {code: userCode, lang: lang},
    headers: { "Content-Type": "application/json"}
  };
  restClient.methods.build_and_run(
    args,
    (data, response) => {
      var d = JSON.parse(data.toString());
      console.log(JSON.parse(data.toString()));
    const text = `Build Output: ${d.build}
    Execute output: ${d['run']}`;

    d['text'] = text;
    console.log(text);
    console.log("Received response from execution server: " + d);
    res.send(d);
  });
});

module.exports = router;
