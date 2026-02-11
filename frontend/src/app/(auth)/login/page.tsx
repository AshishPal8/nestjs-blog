"use client";
import { Facebook, Google, LoginBg } from "@/src/assets";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { envConfig } from "@/src/config/env.config";
import Image from "next/image";

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${envConfig.apiUrl}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${envConfig.apiUrl}/auth/facebook`;
  };

  return (
    <div className="w-full h-screen flex justify-center items-center px-5 sm:px-0">
      <Card className="w-full sm:w-6/8 md:w-4/8 lg:w-3/8 xl:w-2/8 py-0 overflow-hidden rounded-3xl">
        <div className="relative w-full h-48">
          <Image
            src={LoginBg}
            alt="Logo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent" />
        </div>
        <CardHeader className="">
          <CardTitle className="text-primary text-2xl font-extrabold">
            Share Your Voice.
          </CardTitle>
          <CardDescription>
            Join the community of thinkers and creators today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex items-center justify-center my-5">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              size={"lg"}
              className=" w-full text-md"
            >
              <Image src={Google} alt="Google" width={25} height={25} />{" "}
              Continue with Google
            </Button>
          </div>
          <div className="w-full flex items-center justify-center my-5">
            <Button
              variant="outline"
              size={"lg"}
              onClick={handleFacebookLogin}
              className=" w-full text-md"
            >
              <Image src={Facebook} alt="Google" width={25} height={25} />{" "}
              Continue with Facebook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
