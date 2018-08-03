var kairos =require('./kairosApi')
var messenger= require('./Sendsms')
var checkDefaulter =require('./tracker')
var detailsArray = require('./empjson');
var moment = require('moment');
var mailingFunction = require('./mailer')

class Handler{

    enrollfunction(req,res){
        console.log("enroll function")
        var img = JSON.stringify(req.body.imageData);
        var data=req.body.imageData
        var subjectid=JSON.stringify(req.body.employeeid);
        var subject_id=req.body.employeeid;
        var otp=req.body.otp;
        new kairos().enrollData(img,subjectid,(callback)=>{
            var body=callback.body;
            if (JSON.parse(body) === "Authentication failed"){
                response =JSON.parse(body)
                res.render('index')
                // return callback(response)
            }
            else if(JSON.parse(body).hasOwnProperty('Errors[0].ErrCode') ==5000 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5001|| JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5002 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5003 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5004 ||JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5010){
                 response =JSON.JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')
                 res.render('index_old',{
                    msg: 'Face not recognized .Please start again ',
                    vis: 'visible',
                })
            }
            else if(JSON.parse(body).images[0].transaction.subject_id != null) {
                var subjectid=JSON.parse(body).images[0].transaction.subject_id 
                new detailsArray().empJsonById(subject_id,(callback)=>{
                    var body =callback.body
                   if (JSON.parse(body).ipagedetails_official_info ==[]){
                       console.log("Your details are not updated in the stationh")
                        res.render('noDetailsAvailable',{
                            subject:subject,
                            image:data
                        })
                    }
                    else{
                        var today = new Date();
                        var formatted = moment(today).format('DD.MM.YYYY');
                        var record = {
                            "empId" :subjectid,
                            "date" : formatted
                        }
                        new checkDefaulter().recordDefaulter(record)
                        var detailsArray=JSON.parse(body).ipagedetails_official_info
                        for(var i=0;i<detailsArray.length ;i++){
                            var mailingaddress=detailsArray[i].employeeemail
                        }
                        console.log("mailing address is",mailingaddress)
                        new checkDefaulter().filterRegularDefaulter(subject_id,(error,callback)=>{
                            console.log("inside filter defaulter in method class")
                            if(error) {  
                                console.log(error)
                            }else {
                                console.log("value of callback is",callback)
                                console.log("inside filter regular data")
                                if(callback == "yes"){
                                new mailingFunction().Sendmail(mailingaddress,'39344_#Test@hexaware.com');
                                }
                                else{
                                    console.log("Not a defaulter")
                                }                 
                            }
                        })
                        JSON.parse(body).ipagedetails_official_info.forEach((element)=>{
                        if(element.employeeid == subjectid && otp=="546700"){
                            today=formatted,
                            res.render('fillingConfirmation',{
                                 details:element,
                                image:data,
                                date:today
                            })               
                        }
                        })
                    }
                })  
            }
        })

    }//enroll data function

    recognizeFunction(req,res){
        var data = JSON.stringify(req.body.myImage);
        var img = req.body.myImage;
        new kairos().recognize(data,(callback)=>{
            var body=callback.body
            console.log(JSON.parse(body).images[0].transaction.subject_id)
            if (JSON.parse(body) === "Authentication failed"){
                response =JSON.parse(body)
                res.render('index')
            }
            else if(JSON.parse(body).hasOwnProperty('Errors[0].ErrCode') ==5000 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5001|| JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5002 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5003 || JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5004 ||JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')==5010){
                response =JSON.JSON.parse(body).hasOwnProperty('Errors[0].ErrCode')
                res.render('index_old', {
                msg: 'Face not recognized. Please try again',
                vis: 'visible'
                 })
            }
            else if(Array.isArray(JSON.parse(body).images) && JSON.parse(body).images[0].transaction.message === "no match found")
                {
                res.render('fillData',{
                    msg: 'Face not recognized .Please fill the data',
                     vis: 'visible',
                    details:req.body,
                    image :img
                })
            }
            else {
                var subject_id = JSON.parse(body).images[0].transaction.subject_id;
                new detailsArray().empJsonById(subject_id,(callback)=>{
                var body =callback.body
                if (JSON.parse(body).ipagedetails_official_info ==[]){
                    console.log("Your details are not updated in the stationh")
                    res.render('noDetailsAvailable',{
                        subject:subject,
                        image:data
                    })
                }
                else{
                    var today = new Date();
                    var formatted = moment(today).format('DD.MM.YYYY');
                    var record = {
                        "empId" :subject_id,
                        "date" : formatted
                    }
                    new checkDefaulter().recordDefaulter(record)
                    var detailsArray=JSON.parse(body).ipagedetails_official_info
                    for(var i=0;i<detailsArray.length ;i++){
                        var mailingaddress=detailsArray[i].employeeemail
                    }
                    console.log("mailing address is",mailingaddress)
                    new checkDefaulter().filterRegularDefaulter(subject_id,(error,record)=>{
                        console.log("inside filter defaulter in method recognize function class")
                    if(error) {  
                        console.log(error)
                    }else {
                        console.log("callback value is", record)
                        var recordValue =record
                        console.log("record value is",recordValue)
                        console.log("inside filter regular data")
                        if(recordValue != "no"){
                        new mailingFunction().Sendmail(mailingaddress,'39344_#Test@hexaware.com')    
                        }  
                        else 
                        if(recordValue =="no"){
                            console.log("not a defaulter")
                        }                   
                    }
                })
                    detailsArray.forEach((element)=>{
                    if(element.employeeid == subject_id){
                        today=formatted,
                        res.render('welcomeCard',{
                            details:element,
                            image:img,
                            date:today
                        });             
                    }
                    })
                 
                 
                }   
            })
        }
        })
    }//recognize data function

    detrainFunction(req,res){
        console.log("inside detrain")
        var subjectid=JSON.stringify(req.body.employeeData)
        new kairos().detrain(subjectid,(callback)=>{
            var body=callback.body;
            if(error){
                console.log("error")
            }
            else{
                console.log("sucessfull")
                res.render('index')
            }
        })

    }//detrain function
    
    giveResponse(req,res){
        var image=req.body.imageData;
        console.log("response page");
        var subject_id = req.body.employeeid;
        console.log(subject_id)
        new detailsArray().empJsonById(subject_id,(callback)=>{
        var body =callback.body
        var detailsArray=JSON.parse(body).ipagedetails_official_info
        detailsArray.forEach((element)=> {
            if(element.employeeid == subject_id) {
                var today = new Date();
                var formatted = moment(today).format('DD.MMMM.YYYY');
                today =formatted
                console.log("response page");
                res.render('response', {
                    msg:'response page',
                    details:element,
                    date:today,
                    image:image
                });
            }   
        })
        })
    }//give response function

    fillUserData(req,res){
        var image=req.body.imageData;
        console.log("filldata page")
        new messenger().sendSms((message)=>{       
            if(message.status == "queued"){
                res.render('fillData',{
                    image:image
                })
            }
        })
    }
}//fill user data function
module.exports=Handler;