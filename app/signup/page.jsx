"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import formimage from "../../public/images/login.jpg";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMail } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Registerpage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picerror, setPicError] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [userExistsError, setUserExistsError] = useState(false);
  const [matchPasswordError, setMatchPasswordError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    } 
  },[router]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const picChange = (pics) => {
    setPicError(false);
    if (pics === undefined) {
      setPicError(true);
      return;
    }
    setPicLoading(true);
    const fileName = pics ? pics.name : "Upload Photo";
    document.getElementById("file-label").textContent = fileName;
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat_app");
      data.append("cloud_name", "rahulvatschatapp");
      fetch("https://api.cloudinary.com/v1_1/rahulvatschatapp/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          // console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      console.log("Please select an image to upload");
      setPicLoading(false);
      return;
    }
  };

  const handelChange = (e) => {
    if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "password") {
      setPassword(e.target.value);
    } else if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "confirmpassword") {
      setConfirmPassword(e.target.value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setMatchPasswordError(false);
    setUserExistsError(false);
    let hasError = false;
    const newErrors = {};
    if (!email) {
      newErrors.email = "Please fill your email";
      hasError = true;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }
    if (!name) {
      newErrors.name = "Please fill your name";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Please fill your password";
      hasError = true;
    }
    if (!confirmpassword) {
      newErrors.confirmpassword = "Please fill your confirm password";
      hasError = true;
    }
    if (password && confirmpassword) {
      if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        hasError = true;
      }
      if (confirmpassword.length < 6) {
        newErrors.confirmpassword =
          "Confirm password must contains at least 6 characters";
        hasError = true;
      } else {
        if (password !== confirmpassword) {
          setMatchPasswordError(true);
          hasError = true;
        }
      }
    }

    setErrors(newErrors);

    if (!hasError) {
      setRegistering(true);
      const data = { name, email, password, pic };
      // console.log(data);
      try {
        const response = await fetch('/api/signup', {
          method: "POST",
          body: JSON.stringify({
            name: name,         
            email: email,         
            password: password,
            otp:'12345',         
            pic: pic         
          }),
        });
        // console.log("response: ",response);
        if (response.status === 200) {
          const responseData = await response.json();
          const token=responseData.token;
          // console.log("Success", responseData);
          localStorage.setItem('token', responseData);
          toast.success("Signup Successful", {
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
          // Redirect after some time
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else if (response.status === 400) {
          // Handle specific 400 status (or any other status as needed)
          // console.error("Error 400: Bad Request");
          setUserExistsError(true);
          setRegistering(false);
        } else {
          // Handle other error status codes
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
          <h2 className="font-bold text-2xl text-[#04489c]">Signup</h2>
          <p className="text-xs mt-4 text-[#04489c] font-normal">
            Join us by sign up !
          </p>
          <form
            action=""
            noValidate
            onSubmit={handelSubmit}
            method="POST"
            className="flex flex-col gap-4"
          >
            <div className="relative mt-8">
              <input
                className={`p-2 pl-10 rounded-xl border w-full focus:border-2 focus:ring-blue-700 focus:outline-none focus:border-blue-700 ${
                  errors.name ? "border-red-500" : ""
                } `}
                value={name}
                onChange={handelChange}
                type="text"
                name="name"
                placeholder="Name"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <BsPerson className="text-gray-500 text-xl" />
              </div>
            </div>
            {formSubmitted && errors.name && (
              <span className="mb-2 mt-[-1rem] block text-sm text-red-500">
                {errors.name}
              </span>
            )}
            <div className="relative">
              <input
                className={`p-2 pl-10 rounded-xl border w-full focus:border-2 focus:ring-blue-700 focus:outline-none focus:border-blue-700 ${
                  errors.email || userExistsError ? "border-red-500" : ""
                } `}
                value={email}
                onChange={handelChange}
                type="email"
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
            {formSubmitted && userExistsError && (
              <span className="mb-2 mt-[-1rem] block text-sm text-red-500">
                User exists with this email
              </span>
            )}
            <div className="relative">
              <input
                className={`p-2 pl-10 rounded-xl border w-full focus:border-2 focus:ring-blue-700 focus:outline-none focus:border-blue-700 ${
                  errors.password || matchPasswordError ? "border-red-500" : ""
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
            <div className="relative">
              <input
                className={`p-2 pl-10 rounded-xl border w-full focus:border-2 focus:ring-blue-700 focus:outline-none focus:border-blue-700 ${
                  errors.confirmpassword || matchPasswordError
                    ? "border-red-500"
                    : ""
                }`}
                value={confirmpassword}
                onChange={handelChange}
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <RiLockPasswordLine className="text-gray-500 text-xl" />
              </div>
            </div>
            {formSubmitted && errors.confirmpassword && (
              <span className="mb-2 mt-[-1rem] block text-sm text-red-500">
                {errors.confirmpassword}
              </span>
            )}
            {formSubmitted && matchPasswordError && (
              <span className="mb-2 mt-[-1rem] block text-sm text-red-500">
                Confirm password and password should be same
              </span>
            )}
            <label className="p-2 rounded-xl border w-full focus:border-2 focus:ring-blue-700 focus:outline-none focus:border-blue-700 cursor-pointer">
              <input
                type="file"
                name="pic"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => picChange(e.target.files[0])}
              />
              <div className="relative">
                <span
                  id="file-label"
                  className="text-gray-400 ml-[2rem] text-sm font-semibold"
                >
                  Click here to Upload Photo
                </span>
                <div className="absolute top-1/2 -translate-y-1/2 pr-8 ml-[0.2rem]">
                  <AiOutlineCloudUpload className="text-gray-600 text-xl" />
                </div>
              </div>
            </label>
            {picerror && (
              <span className="mb-2 mt-[-1rem] block text-sm text-red-500">
                Please select an image to upload
              </span>
            )}
            <button
              className={`${
                picLoading || registering ? "bg-[#4985ce]" : "bg-[#0160d6]"
              } rounded-xl text-white py-2 hover:scale-105 duration-300`}
              disabled={picLoading || registering}
            >
              {registering
                ? "Processing..."
                : picLoading
                ? "Uploading..."
                : "Signup"}
            </button>
          </form>
          {/* <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>
          <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#04489c] font-medium">
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
            Signup with Google
          </button> */}
          <div className="font-medium text-xs border-b border-[#04489c] py-4 text-[#04489c]"></div>
          <div className="mt-3 text-xs flex justify-between items-center text-[#04489c] font-medium">
            <p>Already have an account?</p>
            <button className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">
              <Link href="/login">Login</Link>
            </button>
          </div>
        </div>
        {/* image */}
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

export default Registerpage;
