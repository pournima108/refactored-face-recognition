var kairos =require('./kairosApi')
var messenger= require('./func')
var checkDefaulter =require('./tracker')
var detailsArray = require('./emp.json');
var moment = require('moment');
class Handler{

    enrollfunction(callback){
        var img = JSON.stringify(req.body.imageData);
        var data=req.body.imageData
        var subjectid=JSON.stringify(req.body.employeeid);
        var subject_id=req.body.employeeid;
        var otp=req.body.otp;
        var i;
        var data1 = []; 
        for (i=0;i<detailsArray.employeeDetails.length;i++){
            data1.push(detailsArray.employeeDetails[i].employeeid)
        }
        new kairos().enrollData(img,subjectid,(error,response,body)=>{
            if (JSON.parse(body) === "Authentication failed"){
                response =JSON.parse(body)
                return callback(response)
            }
            else if(JSON.parse(body).hasOwnProperty('Errors[0].ErrCode') ==5000 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5001|| JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5002 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5003 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5004 ||JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5010){
                 response =JSON.JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')
                 return callback(response)
            }
            else if(error){
                console.log('error')
                return callback(error)
            }
            else if(JSON.parse(body).images[0].transaction.subject_id != null) {
                var subjectid=JSON.parse(body).images[0].transaction.subject_id 
                if(data1.includes(subjectid)){
                    var today = new Date();
                    var formatted = moment(today).format('DD.MMMM.YYYY');
                    var record = {
                        "empId" :subjectid,
                        "date" : formatted
                    }
                    console.log(JSON.stringify(record))
                    new checkDefaulter().recordDefaulter(record);
                    detailsArray.employeeDetails.forEach((element) =>{
                        if(element.employeeid == subject_id && otp=="546700"){
                            today=formatted,
                            res.render('fillingConfirmation',{
                                details:element,
                                image:data,
                                date:today
                            })               
                        }
                    })   
                }
                else{
                    var subject =subject_id;
                    console.log("no subject id matched")
                    res.render('noDetailsAvailable',{
                        subject:subject,
                        image:data
                    })
                }
              
            }
        })

    }


    recognizeFunction(callback){
        var data = JSON.stringify(req.body.myImage);
        var img = req.body.myImage;
        new kairos().recognize(img,(error,response,body)=>{
                if (JSON.parse(body) === "Authentication failed"){
                    response =JSON.parse(body)
                    return callback(response)
                }
                else if(JSON.parse(body).hasOwnProperty('Errors[0].ErrCode') ==5000 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5001|| JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5002 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5003 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5004 ||JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5010){
                     response =JSON.JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')
                     return callback(response)
                }
                else if(error){
                    console.log('error')
                    return callback(error)
                }
                else if(Array.isArray(JSON.parse(body).images) && JSON.parse(body).images[0].transaction.message === "no match found")
                {
                    return callback;
                }
                else {
                    subject_id = JSON.parse(body).images[0].transaction.subject_id;
                    var today = new Date();
                    var formatted = moment(today).format('D MMMM YYYY');
                    var record = {
                            "empId" : subject_id,
                            "date" : formatted
                    }
                    new checkDefaulter().filterRegularDefaulter(subject_id,(error,record)=>{
                        if(error){
                            console.log(error)
                        }else{
                            console.log(record)
                            console.log("inside filter regular data")
                            return record;
                            
                        }
                    });
                  
                    // console.log(JSON.stringify(record))
                    new checkDefaulter().recordDefaulter(record);
                    
                    detailsArray.employeeDetails.forEach((element) => {
                        if(element.employeeid == subject_id) {
                            today =formatted
                            return callback;
                        }
                    })
                }
        })
    }
}


module.exports=Handler;