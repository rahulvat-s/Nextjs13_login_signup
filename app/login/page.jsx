"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import formimage from "../../public/images/login.jpg";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMail } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Loader from "../component/loader";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  // const [loader, setLoader] = useState(true);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // setLoader(true); 
      router.push('/');
    } 
    // setLoader(false); 
  },[router]);
 
  const handelChange = (e) => {
    if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "password") {
      setPassword(e.target.value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setInvalidPassword(false);
    setInvalidEmail(false);
    let hasError = false;
    const newErrors = {};
    if (!email) {
      newErrors.email = "Please fill your email";
      hasError = true;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Please fill your password";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      setRegistering(true);
      setLoading(true);
      const data = { email, password };
      // console.log(data);
      setLoading(false);
      try {
        const response = await fetch('/api/login', {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password
          }),
        });
        if (response.status === 200) {
          const responseData = await response.json();
          console.log(responseData);
          const token=responseData.token;
          console.log(responseData);
          localStorage.setItem('token', responseData);
          toast.success("Login Successful", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setRegistering(false);
          setTimeout(() => {
            router.push('/'); 
          }, 2000);
        } else if (response.status === 404) {
          setInvalidEmail(true);
          setRegistering(false);
        } else if(response.status === 401){
          setInvalidPassword(true);
          setRegistering(false);
        }else {
          // Handle other error status codes
          toast.error("Some Error Occured", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.error("Error:", response.status);
          setRegistering(false);
        }
      } catch (error) {
        // Network errors or other errors during the fetch
        console.error("Error:", error);
        setRegistering(false);
      }
    }



  };

  // if (loader) {
  //   return <Loader />;
  // }

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="bg-white flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#04489c]">Login</h2>
          <p className="text-xs mt-4 text-[#04489c] font-normal">
            If you are already a member, easily log in
          </p>
          <form
            action=""
            noValidate
            onSubmit={handelSubmit}
            method="POST"
            className="flex flex-col gap-4"
          >
            <div className="relative mt-8">
              {invalidEmail && (
                <span className="mb-2 mt-[-1rem] block text-sm text-red-500">
                  User Not Found with this Email.
                </span>
              )}
              {invalidPassword && (
                <span className="mb-2 mt-[-1rem] block text-sm text-red-500">
                  Wrong Password. Please try again !
                </span>
              )}
              <input
                className={`p-2 pl-10 rounded-xl border w-full focus:border-2 focus:ring-blue-700 focus:outline-none focus:border-blue-700 ${errors.email || invalidEmail ? "border-red-500" : ""
                  } `}
                value={email}
                onChange={handelChange}
                name="email"
                placeholder="Email"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MdOutlineMail className="text-gray-500 text-xl" />
              </div>
            </div>
            {formSubmitted && errors.email && (
              <span className="mb-2 mt-[-1rem] block text-sm text-red-500">
                {errors.email}
              </span>
            )}
            <div className="relative">
              <input
                className={`p-2 pl-10 rounded-xl border w-full focus:border-2 focus:ring-blue-700 focus:outline-none focus:border-blue-700 ${errors.password || invalidPassword ? "border-red-500" : ""
                  }`}
                value={password}
                onChange={handelChange}
                type="password"
                name="password"
                placeholder="Password"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <RiLockPasswordLine className="text-gray-500 text-xl" />
              </div>
            </div>
            {formSubmitted && errors.password && (
              <span className="mb-2 mt-[-1rem] block text-sm text-red-500">
                {errors.password}
              </span>
            )}
            <button
              className={`${loading ? "bg-[#4985ce]" : "bg-[#0160d6]"
                } rounded-xl text-white py-2 hover:scale-105 duration-300`}
              disabled={loading}
            >
              {registering ? "Processing..." : "login"}
            </button>
          </form>
          {/* <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div> */}
          {/* <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#04489c] font-medium">
            <svg
              className="mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="25px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Login with Google
          </button> */}
          {/* <div className="mt-5 font-medium text-xs border-b border-[#04489c] py-4 text-[#04489c]">
            <Link href="/forgot">Forgot your password?</Link>
          </div> */}
          <div className="mt-3 text-xs flex justify-between items-center text-[#04489c] font-medium">
            <p>Dont have an account?</p>
            <button className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">
              <Link href="/signup">Signup</Link>
            </button>
          </div>
        </div>
        <div className="md:block hidden w-1/2">
          <Image
            className=""
            src={formimage}
            alt="formimage"
            layout="responsive"
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
