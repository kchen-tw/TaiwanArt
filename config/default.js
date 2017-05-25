module.exports = {
    local: {
        input_dir: './uploads',
        output_dir: './public',
        download_image_dir: './public/images',
        output_image_dir: './images'
    },
    cluster: {
        username: 'ecchen',
        password: 'rae0ooJ_eic5bah5',
        host: '140.112.51.222',
        port: 22,
        styleTransferDir: 'NTU2017DeepArt/src/chainer-fast-neuralstyle',
        model: 'NTU2017DeepArt/src/chainer-fast-neuralstyle/models/OCT1_06.model',
        input_dir: 'NTU2017DeepArt/ForApp/imagesFromApp',
        output_dir: 'NTU2017DeepArt/ForApp/imagesToApp'
    }
}