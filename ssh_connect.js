var Client = require('ssh2').Client;
var config = require('config');

var connSettings = {

    host: config.cluster.host,
    port: config.cluster.port,
    username: config.cluster.username,
    password: config.cluster.password
}

var options = {};

exports.setOptions = function(option) {
    return new Promise(function(resolve, reject) {
        options = option;
        resolve();
    });
};

exports.upload = function() {
    return new Promise(function(resolve, reject) {
        var conn = new Client();
        conn.on('ready', function() {
            console.log('Client :: ready');
            conn.sftp(function(err, sftp) {
                if (err) throw err;

                var fs = require("fs"); // Use node filesystem
                var local_file = config.local.input_dir + '/' + options.filename;
                var remote_file = './' + config.cluster.input_dir + '/' + options.filename;
                var readStream = fs.createReadStream(local_file);
                var writeStream = sftp.createWriteStream(remote_file);
                writeStream.on('close', function() {
                    console.log("- file transferred succesfully");
                    resolve();
                });

                writeStream.on('end', function() {
                    console.log("sftp connection closed");
                    conn.close();
                    resolve();
                });

                readStream.pipe(writeStream);
                // writeStream.end();
            });
        }).connect(connSettings);
    });
}

exports.process = function() {
    return new Promise(function(resolve, reject) {
        var conn = new Client();
        conn.on('ready', function() {
            console.log('Client :: ready');
            conn.shell(function(err, stream) {
                if (err) throw err;
                stream.on('close', function() {
                    console.log('Stream :: close');
                    conn.end();
                    resolve();
                }).on('data', function(data) {
                    // console.log(`Received ${chunk.length} bytes of data.`);
                    console.log(`STDOUT: ${data}`);
                }).stderr.on('data', function(data) {
                    console.log('STDERR: ' + data);
                });
                var input_filename = '~/' + config.cluster.input_dir + '/' + options.filename;
                var output_filename = '~/' + config.cluster.output_dir + '/' + options.filename;
                var model_filename = '~/' + config.cluster.model + '/' + options.model + '.model';
                // stream.write('cd ' + config.cluster.output_dir + '\n');
                stream.write(`rm ${output_filename}\n`);
                stream.write(`cd ~/${config.cluster.styleTransferDir}\n`);
                stream.write('python generate.py ' + input_filename + ' -m ' + model_filename + ' -o ' + output_filename + ' -g ' + config.cluster.gpu + ' \n');
                stream.write(`rm ${input_filename}\n`);
                stream.end('exit\n');
            });
        }).connect(connSettings);
    });
}

exports.download = function() {
    return new Promise(function(resolve, reject) {
        var conn = new Client();
        conn.on('ready', function() {
            conn.sftp(function(err, sftp) {
                if (err) throw err;

                var local_file = config.local.download_image_dir + '/' + options.filename;
                var remote_file = './' + config.cluster.output_dir + '/' + options.filename;

                sftp.fastGet(remote_file, local_file, {}, function(downloadError) {
                    if (downloadError) throw downloadError;

                    console.log("Succesfully downloaded");
                    resolve(config.local.output_image_dir + '/' + options.filename);
                });
            });
        }).connect(connSettings);
    });
}