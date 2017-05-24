var express = require('express');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');

var app = new express();

app.set('port', (process.env.PORT || 3000));

// 設定靜態網頁
app.use(express.static(__dirname + '/public'));


// get image from client
var storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req, file, cb) {
        cb(null, file.originalname + '.jpg');
    }
});

app.post('/imageupload', multer({
    storage: storage
}).single('upload'), function(req, res) {


    console.log(req);
    console.log(req.file.originalname);


    var imageProcess = require("./image_generate.js");

    var options = {
        path: req.file.path,
        filename: req.file.filename
    }

    imageProcess.generate(options, (data) => {
        console.log(data);

        var result = {
            status: 'ok'
        };
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.write(JSON.stringify(result));
        res.end();
    });

    ///// execute style transfer pipieline start////////
    // var exec = require('child_process').exec;
    // var execProcess = require("./exec_process.js");
    // execProcess.result("git do_pipeline_works.sh " + req.file.path + " " + __dirname + "/public/", function(err, response) {

    //     if (!err) {
    //         console.log(response);
    //         var result = {
    //             status: 'ok'
    //         };
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Origin': '*'
    //         });
    //         res.write(JSON.stringify(result));
    //         res.end();
    //     } else {
    //         console.log(err);
    //     }
    // });
    /////////////////////////////////////////////////////


});



app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});