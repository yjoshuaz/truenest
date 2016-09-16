var express = require('express')
var exphbs  = require('express-handlebars');
var path = require('path')
var multiparty = require('multiparty')
var fs = require('fs')
var util = require('util')
var uuid = require('uuid')
var db = require('monk')('localhost/seedshot')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())

app.get('/', function(req, res){
  res.render('index')
})

app.get('/404', function(req, res){
  res.render('404')
})

app.get('/:uuid', function(req, res){
  var images = db.get('images')

  images.findOne({ uuid: req.params.uuid }).on('success', function (doc) {
    if (doc){
      res.render("image", {
        base64: doc.base64,
        infoHash: doc.infoHash
      })
    } else {
      res.redirect('404')
    }
  });
})

app.post('/:uuid', function(req, res){
  var hash = req.body.infoHash
  var images = db.get('images')
  images.findAndModify({query: { uuid: req.params.uuid},
                       update: { uuid: req.params.uuid, infoHash: hash}})
  res.json({
    infoHash: hash
  })
})

app.post('/', function(req, res){
  var form = new multiparty.Form();
  var images = db.get('images')
  var id = uuid.v1()
  form.parse(req, function(err, fields, files) {
    images.insert({
      uuid: id,
      base64: fs.readFileSync(files["file"][0]["path"]).toString('base64')
    }, function(err, doc){
      if (err) throw err;
    })
    res.json({
      uuid: id
    })
  });
})

app.set('views', path.join(__dirname, 'views'))
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('x-powered-by', false)
app.use('/public', express.static(path.join(__dirname, '../public')))

var server = app.listen(3000, function () {
  var port = server.address().port;

  console.log('Example app listening at http://127.0.0.1:%s', port);
});
