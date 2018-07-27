class kairos {
    enrollData(img,subject_id,callback){
        var options1 ={
            method:'POST',
            url: 'https://api.kairos.com/enroll',
            headers:{
                "Content-Type": "application/json",
                app_key: process.env.API_KEY,
                app_id: process.env.API_ID
            },
            body: '{"image":' + img + ',"subject_id": '+ subjectid +', "gallery_name":"MyGallery"}'
        };request(options1,function(error,response,body) {
            if(error){
                console.log(error)

                return callback(error);
            }
            else{
                callback =JSON.parse(body)
                console.log(callback)
                return callback;
            }
        })
    }

    recognize(img,callback){
        var options = {
            method: 'POST',
            url: 'https://api.kairos.com/recognize',
            headers: {
                "Content-Type": "application/json",
                app_key: process.env.API_KEY,
                app_id: process.env.API_ID
            },
            body: '{"image":' + data + ',"gallery_name":"MyGallery"}'
        };
        request(options, function (error, response, body) {
            if(error){
                console.log(error)

                return callback(error);
            }
            else{
                callback =JSON.parse(body)
                console.log(callback)
                return callback;
            }

        })
    }


}

module.exports =kairos;