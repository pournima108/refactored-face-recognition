var request =require('request')
var fs=require('fs')

class EmpJson {
   empJsonById(id,callback){
        var options1 ={
            method:'GET',
            url: "http://172.25.121.24/StationHUATApi/api/content/EmployeeOfficialInfoForSearchEmpListPage/"+id,
            headers:{
                "Content-Type": "application/json",
                Authorization : process.env.token
            },
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
}
module.exports=EmpJson;

// var jsonParse=new EmpJson();

// jsonParse.empJsonById(42652,(callback)=>{
//     var body=callback.body
//     console.log(JSON.parse(body).ipagedetails_official_info)
//     if(JSON.parse(body).ipagedetails_official_info == []){
//         console.log("your details are not updated")
//     }
//     // console.log(body)
// })

