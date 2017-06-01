// 當文件都下載完後執行
$(document).ready(function() {
    $('#btn-upload').attr('disabled', true);

    $('body').scrollspy({
        target: 'section.logo',
        offset: 60
    });

    $('img.painting-img').on('click', function(event) {
        var name = $(this).attr('data-name');
        var model = $(this).attr('data-model');
        $('#imgUploadModal .modal-title').text(name);
        $('#imgUploadModal').modal('show')
    });
    $('#painter-select').bind('change', function(event) {
        console.log(this.value);
        var artist = this.value;

        $('html, body').stop().animate({
            scrollTop: ($('#' + artist).offset().top - 30)
        }, 1450, 'easeInOutExpo');
        event.preventDefault();
    });

    $.uploadPreview({
        input_field: '#intput-image-upload',
        preview_box: '#intput-image-preview',
        label_field: '#intput-image-label',
        label_default: '選擇影像',
        label_selected: '改變影像',
        success_callback: (file) => {
            // $('#btn-upload').attr('disabled', false);

            // $('#btn-upload').on('click', function() {
            var loader = new Loader($('.loader-wrapper'));
            loader.start();
            // var data = new FormData();
            if (file) {
                // data.append('file', file);
                var data = new FormData();
                data.append('upload', file);
                $.ajax({
                    type: "POST",
                    url: 'imageupload',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        $('#output-image-preview')
                            .css('background-image', 'url(' + data.image + ')')
                            .css('background-size', 'cover')
                            .css('background-position', 'center center');
                        loader.end();
                    }
                });
            }
            // });
        }
    });


    // function sendFileToServer(formData, status) {
    //     var uploadURL = "http://hayageek.com/examples/jquery/drag-drop-file-upload/upload.php"; //Upload URL
    //     var extraData = {}; //Extra Data.
    //     var jqXHR = $.ajax({
    //         xhr: function() {
    //             var xhrobj = $.ajaxSettings.xhr();
    //             if (xhrobj.upload) {
    //                 xhrobj.upload.addEventListener('progress', function(event) {
    //                     var percent = 0;
    //                     var position = event.loaded || event.position;
    //                     var total = event.total;
    //                     if (event.lengthComputable) {
    //                         percent = Math.ceil(position / total * 100);
    //                     }
    //                     //Set progress
    //                     status.setProgress(percent);
    //                 }, false);
    //             }
    //             return xhrobj;
    //         },
    //         url: uploadURL,
    //         type: "POST",
    //         contentType: false,
    //         processData: false,
    //         cache: false,
    //         data: formData,
    //         success: function(data) {
    //             status.setProgress(100);

    //             $("#status1").append("File upload Done<br>");
    //         }
    //     });

    //     status.setAbort(jqXHR);
    // }

    // var rowCount = 0;

    // function createStatusbar(obj) {
    //     rowCount++;
    //     var row = "odd";
    //     if (rowCount % 2 == 0) row = "even";
    //     this.statusbar = $("<div class='statusbar " + row + "'></div>");
    //     this.filename = $("<div class='filename'></div>").appendTo(this.statusbar);
    //     this.size = $("<div class='filesize'></div>").appendTo(this.statusbar);
    //     this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);
    //     this.abort = $("<div class='abort'>Abort</div>").appendTo(this.statusbar);
    //     obj.after(this.statusbar);

    //     this.setFileNameSize = function(name, size) {
    //         var sizeStr = "";
    //         var sizeKB = size / 1024;
    //         if (parseInt(sizeKB) > 1024) {
    //             var sizeMB = sizeKB / 1024;
    //             sizeStr = sizeMB.toFixed(2) + " MB";
    //         } else {
    //             sizeStr = sizeKB.toFixed(2) + " KB";
    //         }

    //         this.filename.html(name);
    //         this.size.html(sizeStr);
    //     }
    //     this.setProgress = function(progress) {
    //         var progressBarWidth = progress * this.progressBar.width() / 100;
    //         this.progressBar.find('div').animate({ width: progressBarWidth }, 10).html(progress + "% ");
    //         if (parseInt(progress) >= 100) {
    //             this.abort.hide();
    //         }
    //     }
    //     this.setAbort = function(jqxhr) {
    //         var sb = this.statusbar;
    //         this.abort.click(function() {
    //             jqxhr.abort();
    //             sb.hide();
    //         });
    //     }
    // }

    // function handleFileUpload(files, obj) {
    //     for (var i = 0; i < files.length; i++) {
    //         var fd = new FormData();
    //         fd.append('file', files[i]);

    //         var status = new createStatusbar(obj); //Using this we can set progress.
    //         status.setFileNameSize(files[i].name, files[i].size);
    //         sendFileToServer(fd, status);

    //     }
    // }

    // $(document).on('dragenter', function(e) {
    //     e.stopPropagation();
    //     e.preventDefault();
    // });
    // $(document).on('dragover', function(e) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     obj.css('border', '2px dotted #0B85A1');
    // });
    // $(document).on('drop', function(e) {
    //     e.stopPropagation();
    //     e.preventDefault();
    // });
    // var obj = $("#dragandrophandler");
    // obj.on('dragenter', function(e) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     $(this).css('border', '2px solid #0B85A1');
    // });
    // obj.on('dragover', function(e) {
    //     e.stopPropagation();
    //     e.preventDefault();
    // });
    // obj.on('drop', function(e) {

    //     $(this).css('border', '2px dotted #0B85A1');
    //     e.preventDefault();
    //     var files = e.originalEvent.dataTransfer.files;

    //     //We need to send dropped files to Server
    //     handleFileUpload(files, obj);
    // });

});