function validateLogin(){

let email=document.getElementById("loginEmail").value;
let password=document.getElementById("loginPassword").value;
let error=document.getElementById("loginError");

if(email==="" || password===""){
error.innerHTML="Please fill all fields";
error.style.display="block";
return false;
}

error.style.display="none";
return true;

}



function validateRegister(){

let name=document.getElementById("name").value;
let email=document.getElementById("email").value;
let password=document.getElementById("password").value;
let confirmPassword=document.getElementById("confirmPassword").value;

let error=document.getElementById("registerError");

if(name==="" || email==="" || password==="" || confirmPassword===""){
error.innerHTML="Please fill all fields";
error.style.display="block";
return false;
}

if(password!==confirmPassword){
error.innerHTML="Passwords do not match";
error.style.display="block";
return false;
}

error.style.display="none";
return true;

}