var express = require('express');
var multer = require('multer');
var path = require('path');
var bodyParser = require('body-parser')
var config = require('config');
var app = new express();

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());

// 設定靜態網頁
app.use(express.static(config.local.output_dir));


// get image from client
var storage = multer.diskStorage({
    destination: config.local.input_dir,
    filename: function(req, file, cb) {
        cb(null, file.originalname + '.jpg');
    }
});

app.post('/imageupload', multer({
    storage: storage
}).single('upload'), function(req, res) {

    // var imageProcess = require("./image_generate.js");
    var ssh = require("./ssh_connect.js");
    var options = {
        path: req.file.path,
        filename: req.file.filename
    }
    console.log(options);
    ssh.setOptions(options)
        .then(() => {
            return ssh.upload();
        })
        .then(() => {
            return ssh.process();
        })
        .then(() => {
            return ssh.download();
        })
        .then((result) => {
            res.json({ result: true, image: result })
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