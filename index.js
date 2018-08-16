var express      = require("express");
var util           = require('util');
var multer       = require('multer');
var fs             = require('fs');
var path = require('path');
var moment = require('moment');

var app           = express();

var i = 0; // 파일 개수
var maxFileCount = 2; //
var maxFileSize = 3 * 1000 * 1000;
var filePath = './upload';
var storage = multer.diskStorage({ destination : function (req, file, callback) {
                                                                  callback(null, filePath);
                                                             },
                                filename : function (req, file, callback) {
											i ++; //
											console.log('file:', file);
											let extension = path.extname(file.originalname);
											let basename = path.basename(file.originalname, extension);
		
                                            callback(null, basename + i  + '-' + moment().format('YYYYMMDDHHmmss') + extension); 
											if( maxFileCount == i ){ 
												i = 0; 
											}
								}
                  });

var upload = multer({ storage : storage, limits: { fileSize: maxFileSize } }).array('userPhoto', maxFileCount ); //÷������ 2������ ���, userPhoto = 'file' Ÿ���±��� field ��

app.get('/', function(req, res){
	fs.readFile('./fileupMulti.html', function(error, data){
		res.writeHead(200, {'Content-Type':'text/html'});
		res.end(data);
	});
});

app.post('/api/photo',function(req,res){
     upload(req,res,function(err) { //
        //console.log(req.body);
		var fileId = req.body.fileId; 
		var fileDesc = req.body.fileDesc; 
		console.log("fileId : '%s', fileDesc : '%s'", fileId, fileDesc);
		
		/*test*/console.log('=======================================');
		/*test*/console.log(req.files);
		/*test*/console.log("=======================================");

		var files = req.files; 
		var fileCount = files.length;
		var log; 

 		for (var i = 0 ; i < fileCount; i++) {
 			var originalFileNm = files[i].originalname;
 			var savedFileNm = files[i].filename;// + i ;//+ '-' + Date.now();
			var fileSize = files[i].size;
			log =  `originalFileNm : ${originalFileNm}, savedFileNm : ${savedFileNm}, size : ${savedFileNm}`;
 			console.log(log);
 		}
 	         
 	    if(err) {
 	        return res.end("Error uploading file." );
 	     }
 	    
 	     res.end("File is uploaded:"+log); 			
     });
});

 app.listen(8000,function(){
     console.log("Working on port 8000");
});