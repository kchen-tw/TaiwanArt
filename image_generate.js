let path = require('path');
let Client = require('ssh2-sftp-client');
let sftp = new Client();

// let config = {
//     timeout: 10,
//     user: 'XXXXX',
//     pass: 'XXXXX',
//     host: 'XXX.XXX.XXX.XXX',
//     styleTransferDir: './NTU2017DeepArt/src/chainer-fast-neuralstyle',
//     model: './NTU2017DeepArt/src/chainer-fast-neuralstyle/models/OCT1_06.model',
//     input_dir: './NTU2017DeepArt/ForApp/imagesFromApp',
//     output_dir: './NTU2017DeepArt/ForApp/imagesToApp'
// };

let config = {
    timeout: 10,
    user: 'ecchen',
    pass: 'rae0ooJ_eic5bah5',
    host: '140.112.51.222',
    styleTransferDir: './NTU2017DeepArt/src/chainer-fast-neuralstyle',
    model: './NTU2017DeepArt/src/chainer-fast-neuralstyle/models/OCT1_06.model',
    input_dir: './NTU2017DeepArt/ForApp/imagesFromApp',
    output_dir: './NTU2017DeepArt/ForApp/imagesToApp'
};

var generate = function(options, callback) {
    sftp.connect({
        host: config.host,
        port: '22',
        username: config.user,
        password: config.pass
    }).then(() => {
        sftp.put(path.join(__dirname, options.path), config.input_dir + '/' + options.filename)
            .then(() => {

                if (typeof callback === "function")
                    callback();
            })

    }).catch((err) => {
        console.log(err, 'catch error');
    });
}

exports.generate = generate;