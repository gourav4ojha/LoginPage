import React, { useState } from "react";
import Home from "./Home";
import axios from "axios";

const Signup = () => {
  const [inputUser, setinputUser] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
  });
  
  //set changes from input
  const handleChange = (e) => {
    setinputUser({
      ...inputUser,
      [e.target.name]: e.target.value,
    });
  };

  //save data to the server
  const handleSubmit = async () => {    
    try {
      const res = await axios.post("http://localhost:4040/signup", inputUser);
      console.log(res);
      if (res.status === 201) {
        alert("User created successfully");
        window.location = "/login";
      }
      if(res.status === 400){
        alert("User allready exist");
      }
      } catch (error) {
      console.error("An error occurred:", error);
      alert("User allready exist");

    }
  };

 
  
  //otp check
  const [otp, setOtp] = useState('');
   const isValidOTP = (e)=>{
    e.preventDefault();
    //  if(otp ===  inputUser.otp){
      handleSubmit();
      // setOtp= null 
  //  }
  }
  
  //sms otp verification 
  const sendOTP = async () => {
    try {
      const phoneNumber = inputUser.phone;
      const response = await axios.post('http://localhost:4040/sendotp',phoneNumber)
      if (response.data.success) {
        setOtp(response.data.otp);
      } else {
        alert('Failed to gunrate OTP');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP');
    }
  };
  

  return (
    <div>
      <Home />
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div>
              <img
                src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
                className="w-32 mx-auto"
                alt="logo"
              />
            </div>
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Sign Up</h1>
              <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-xs">
                  <form onSubmit={(e) => isValidOTP(e)}>
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={inputUser.email}
                      onChange={handleChange}
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Please enter a valid email address"
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={inputUser.name}
                      onChange={handleChange}
                    />
                    {/* <PhoneInput */}
                    <input
                      className=" flex w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="tel"
                      name="phone"
                      // country={'in'}
                      placeholder="contact"
                      value={inputUser.phone}
                      onChange={handleChange}
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password" 
                      name="password"
                      placeholder="Set Password"
                      value={inputUser.password}
                      onChange={handleChange}
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}"
                      title="Password must contain at least one digit, one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long"
                    />
                    <div className="flex">
                    <input
                      className="w-full px-8 py-4 rounded-l font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="tel"
                      name="otp"
                      placeholder="Enter OTP"
                      value={inputUser.otp}
                      onChange={handleChange}
                    />
                    
                    <button
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-r hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"        
                    // onClick={sendEmail}
                    onClick={sendOTP}
                    >
                    Send OTP
                    </button>
                                     

                    </div>


                    <button
                      type="submit"
                      // onClick={(e) => isValidOTP(e)}
                      className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <svg
                        className="w-6 h-6 -ml-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M20 8v6M23 11h-6" />
                      </svg>
                      <span className="ml-3">Sign Up</span>
                    </button>
                  </form>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    Allready Have an Account ?
                    <a
                      href="/login"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
