from flask import Flask, request
import executor_util as eu
import json
import sys

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hell!"

@app.route('/build_and_run', methods=["POST"])
def build_and_run():
    print request.data
    data = json.loads(request.data)
    print data
    if 'code' not in data or 'lang' not in data:
        return "You should provide both code and lang"
    code = data['code']
    lang = data['lang']

    print "Api get called with code: %s in %s" % (code, lang)

    result = eu.build_and_run(code, lang)
    print result
    return json.dumps(result)


if __name__ == "__main__":
    eu.load_image()
    port = int(sys.argv[1])
    app.run(port=port)
