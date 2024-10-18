const validator= require('validator')

const validateSignupData =(req)=>{
    const {firstName,lastName,emailId,password}=req.body  

    if(!firstName || !lastName){
        throw new Error("name is not valid")
    }else if(firstName.length<4 || firstName.length>50){
        throw new Error("name should be 4-50 character")
    }

    if(lastName.length<4 || lastName.length>40){
        throw new Error("name should be 4-40 character")
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password")
    }

}

module.exports={
    validateSignupData
}