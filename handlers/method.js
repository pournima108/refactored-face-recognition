var kairos =require('./kairosApi')
var messenger= require('./func')
var checkDefaulter =require('./tracker')
var detailsArray = require('../emp.json');
var moment = require('moment');

class Handler{

    enrollfunction(req,res){
        console.log("enroll function")
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
        new kairos().enrollData(img,subjectid,(callback)=>{
            var body=callback.body;
            console.log(body)
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
                //  return callback(response)
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
                    // console.log(JSON.stringify(record))
                    new checkDefaulter().recordDefaulter(record);
                    detailsArray.employeeDetails.forEach((element) =>{
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


    recognizeFunction(req,res){
        console.log("recognize function")
        var data = JSON.stringify(req.body.myImage);
        // console.log("data",data)
        var img = req.body.myImage;
        console.log('recognize function')
        // new kairos().recognize(data,(callback)=>{
        //     console.log("inside upar wala function")
        //     console.log(callback.body)
        // }),
        new kairos().recognize(data,(callback)=>{
            console.log("recognize kairos function");
            // console.log("response body",JSON.parse(response))
            console.log(callback.body)
            var body=callback.body
            console.log(JSON.parse(body).images[0].transaction.subject_id)
            // console.log("body is",body)
                if (JSON.parse(body) === "Authentication failed"){
                    response =JSON.parse(body)
                    res.render('index')
                    // return callback(response)
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
                    console.log(subject_id)
                    var today = new Date();
                    var formatted = moment(today).format('D MMMM YYYY');
                    var record = {
                            "empId" : subject_id,
                            "date" : formatted
                    }
                    new checkDefaulter().recordDefaulter(record);
                    new checkDefaulter().filterRegularDefaulter(subject_id,(error,record)=>{
                        if(error){
                            console.log(error)
                        }else{
                            console.log(record)
                            console.log("inside filter regular data")
                            return record;
                            
                        }
                    });
                    console.log(JSON.stringify(record)) 
                    detailsArray.employeeDetails.forEach((element) => {
                        if(element.employeeid == subject_id) {
                            today =formatted
                            res.render('welcomeCard',{
                                details:element,
                                image:img,
                                date:today
                            });
                            // return callback;
                        }
                    })
                }
        })
    }

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

    }
    
    giveResponse(req,res){
        var image=req.body.imageData;
        //console.log(img);
        console.log("response page");
        var subjectid = req.body.employeeid;
        console.log(subjectid)
        detailsArray.employeeDetails.forEach((element) => {
            if(element.employeeid == subjectid) {
                //console.log(element.employeeid)
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
    }


    smsHandler(req,res){
        var imageData=req.body.imageData;
        var employeeid=req.body.employeeid;
        new messenger().sendSms((message)=>{
            // console.log(message)
            // console.log(message.status)
            if(message.status == "queued"){
                res.render('otpPage',{
                    imageData:imageData,
                    employeeid:employeeid,
                    message:message
                })     
            }
    
        })
    }


    otpHandler(req,res){
        var otp=req.body.otp;
        var image =req.body.imageData;
        var subject_id=req.body.employeeid
        if (otp==546700){
            detailsArray.employeeDetails.forEach((element) => {
                if(element.employeeid == subject_id) {
                    var today = new Date();
                    var formatted = moment(today).format('DD.MMMM.YYYY');
                    today =formatted
            res.render('response',{
                    image:image,
                    details:element,
                    date:today

                })
        }
             })
        }   
        else   
        {
            console.log("otp is wrong please enter thr correct otp")
        }
    }

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
}
module.exports=Handler;