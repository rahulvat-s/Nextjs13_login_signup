"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Loader from "./component/loader";

export default function Home() {
  const router = useRouter();
  const [tokenPayload, setTokenPayload] = useState(null);
  const [loader, setLoader] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const decodedToken = jwtDecode(token);
      setTokenPayload(decodedToken);
      setLoader(false); 
      // console.log(decodedToken);
    }
  }, [router]);

  if (loader) {
    return <Loader />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <div className="flex flex-col items-center gap-4 bg-gray-100 p-12 shadow-xl">
        <div className="text-center">
          <h1 className="text-gray-600 text-5xl gradient-bg leading-[1.15] font-extrabold">
            Welcome,{" "}
            <span className="text-blue-500">
              {tokenPayload && tokenPayload.name}
            </span>
          </h1>
          <div className="flex items-center justify-center">
            <img
              className="w-40 h-40 rounded-full border my-4"
              src={tokenPayload && tokenPayload.pic}
              alt="User"
            />
          </div>
          <p className="text-gray-500 font-semibold text-2xl">
            {tokenPayload && tokenPayload.email}
          </p>
        </div>
        <button
          className="text-white bg-blue-500 hover-bg-blue-800 font-bold focus:ring-4 focus:ring-blue-400 rounded-lg text-sm px-5 py-2.5 dark-bg-blue-600 dark:hover-bg-blue-700 focus:outline-none dark-focus:ring-blue-800"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
