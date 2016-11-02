var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser')
var conf = require('./config')



var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        temp = dir + '/' + file
        var stat = fs.statSync(temp)
        var back = file.split('.');
        var filter = ['pdf', 'doc', 'docx', 'zip', 'ppt', 'sql', 'pptx', 'jpg', 'png', 'bmp', 'rar', 'td', 'cfg'];
        // var filter = [];
    
        if(stat.isFile() && file[0] != '.'  && filter.indexOf(back[back.length-1]) == -1)
        	results.push(file)
    })
    return results
}

function remove(path) {
    return fs.unlinkSync(path)
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname))
app.use(express.static(conf.path))
app.use(express.static(__dirname +  '/node_modules'))


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
})

app.post('/download', function(req, res) {
    var url = req.body.url;
    console.log(url);
})

app.post('/search', function(req, res) {
    var fileName = req.body.fileName;
    res.send({
        name : fileName
    })
})

app.post('/fileList', function(req, res) {
	var fileList = walk(conf.path);
	res.send(fileList)
})

app.get('/see/:name', function(req,res){
    res.send(req.params.name)
})

app.post('/delete', function(req, res) {
    var name = req.body.name
    var pass = req.body.pass
    var msg = {}
    if(pass == 'xhz') {
        remove( conf.path + '/' + name)
        msg.error = true;
    } else {
        msg.error = false
    }
    

    res.send(msg)
})

app.listen(3000, function() {
	console.log('server is run on : 3000');
})


