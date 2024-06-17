import React, { useState } from "react";
import Home from "./Home";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [inputUser, setinputUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setinputUser({
      ...inputUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://localhost:4040/login`, inputUser);
      if (res.status === 200) {
        Cookies.set("userName", res.data.user.name, { expires: 1 });
        // Cookies.set("userId", (res.data.user._id), { expires: 1 });
        Cookies.set("token", res.data.token, { expires: 1 });
        window.location = "/";
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Invalid credentials");
    }
  };

  // cookies check
  // useEffect(() => {
  //   // Read the token from the cookie
  //   const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  //   const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  //   const token = tokenCookie ? tokenCookie.split("=")[1] : null;

  //   if (token) {
  //     // Use Axios to send authenticated requests
  //     axios
  //       .get("/protected", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         // Handle response
  //         console.log("Response:", response.data);
  //       })
  //       .catch((error) => {
  //         // Handle error
  //         console.error("Error:", error);
  //       });
  //   }
  // }, []);

  // Google Login

  const onSuccess = (res) => {
    const data = jwtDecode(res.credential);
    console.log(data.name);
    Cookies.set("userName", data.name, { expires: 365 });
    Cookies.set("userEmail", encodeURIComponent(data.email), { expires: 365 });
    window.location.href = "/";
  };

  // captcha validation
  function generateCaptcha() {
    var alpha = [
      "A","B","C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ]; //, '!','@','#','$','%','^','&','*','+'
    var a = alpha[Math.floor(Math.random() * alpha.length)];
    var b = alpha[Math.floor(Math.random() * alpha.length)];
    var c = alpha[Math.floor(Math.random() * alpha.length)];
    var d = alpha[Math.floor(Math.random() * alpha.length)];
    var e = alpha[Math.floor(Math.random() * alpha.length)];
    var f = alpha[Math.floor(Math.random() * alpha.length)];

    return a + b + c + d + e + f;
  }

  const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [userInput, setUserInput] = useState("");

  function regenerateCaptcha() {
    const newCaptcha = generateCaptcha();
    setCaptchaText(newCaptcha);
    setUserInput("");
  }

  function handleInputChange(event) {
    setUserInput(event.target.value);
  }

  const CapCheck = (e) => {
    e.preventDefault();
    if (captchaText === userInput) {
      handleSubmit();
    } else {
      alert("Invalid captcha");
      regenerateCaptcha();
    }
  };

  return (
    <>
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
              <h1 className="text-2xl xl:text-3xl font-extrabold">Log In</h1>
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col items-center">
                  <GoogleLogin
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                  />

                  <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                    <div className="bg-white p-1 rounded-full">
                      <svg className="w-6" viewBox="0 0 32 32">
                        <path
                          fillRule="evenodd"
                          d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                        />
                      </svg>
                    </div>
                    <span className="ml-4">Log In with GitHub</span>
                  </button>
                </div>

                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or Log In with e-mail
                  </div>
                </div>

                <div className="mx-auto max-w-xs">
                  <form onSubmit={CapCheck}>
                    {/* <form onSubmit={handleSubmit}>  */}
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      name="email"
                      value={inputUser.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      name="password"
                      value={inputUser.password}
                      onChange={handleChange}
                      placeholder="Password"
                    />
                    <Link
                      to="/forgot-password"
                      className="block mb-2 text-sm font-medium text-red-500 text-right"
                    >
                      Forgot password
                    </Link>
                    <div className="flex">
                      <input
                        className="w-full px-8 m-1 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="text"
                        name="captcha"
                        readOnly
                        placeholder={captchaText}
                      />
                      <input
                        className="w-full px-8 m-1 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="text"
                        name="captcha"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Enter Captchd"
                      />
                    </div>
                    <button
                      // onClick={CapCheck}
                      type="submit"
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
                      <span className="ml-3">Log In</span>
                    </button>
                  </form>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    Not a member ?
                    <a
                      href="/signup"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Create account
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
    </>
  );
};

export default Login;
