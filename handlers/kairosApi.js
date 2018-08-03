var request =require('request')

class kairos {
    enrollData(img,subjectid,callback){
        console.log("kairos api enrollData function")
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
                callback(response);
            }
        })
    }

    recognize(img,callback){
        // console.log("kairos api recognize function")
        var options = {
            method: 'POST',
            url: 'https://api.kairos.com/recognize',
            headers: {
                "Content-Type": "application/json",
                app_key: process.env.API_KEY,
                app_id: process.env.API_ID
            },
            body: '{"image":' + img + ',"gallery_name":"MyGallery"}'
        };
        request(options, function (error, response, body) {
            if(error){
                console.log(error)
                return callback(error);
            }
            else{
                 callback(response);
            }

        })
    }

    detrain(subjectid,callback){
        console.log("kairos api detrain function")
        var options2 ={
            method:'POST',
            url: 'https://api.kairos.com/gallery/remove_subject',
            headers:{
                "Content-Type": "application/json",
                app_key: process.env.API_KEY,
                app_id: process.env.API_ID
            },
            body: '{"subject_id": '+ subjectid +', "gallery_name":"MyGallery"}'
        };
        request(options2, function (error, response, body) {
            if(error){
                console.log(error)
                return callback(error);
            }
            else{
                callback(response);
            }

        })
    }
}

module.exports =kairos;