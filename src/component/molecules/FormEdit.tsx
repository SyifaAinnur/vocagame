"use client";

import React, { useEffect, useState } from "react";
import { MoveRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootStater } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { decrypt, removeCookie, setEncryptedCookie } from "@/utils/session";
import Cookies from "js-cookie";
import { UserRegister } from "@/types/schemma";
import { editSchemma } from "@/types/validation";
import { addUserRegis } from "@/lib/redux/features/auth/registerSlice";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";

export function FormEdit() {
  const login = Cookies.get("login");
  const users = useSelector((state: RootStater) => state.register);
  const [newPassword, setNewPassword] = useState<string>();
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<UserRegister>({
    resolver: zodResolver(editSchemma),
  });

  const [dataRegister, setDataRegister] = useState<UserRegister>();

  useEffect(() => {
    const register = Cookies.get("register");
    if (typeof window !== undefined && register) {
      const data = decrypt(register);
      setDataRegister(data);
      dispatch(addUserRegis(data));
    }
  }, [dispatch, login]);

  const onSubmit = (data: UserRegister) => {
    const reRegister: UserRegister = {
      noHp: dataRegister?.noHp ?? "",
      name: dataRegister?.name ?? "",
      password: data.password,
      confirmPassword: data.password,
    };
    setEncryptedCookie("register", reRegister);
    dispatch(addUserRegis(reRegister));
    removeCookie("login");
    alert("Please login again..");
    router.replace("/login");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-start items-start gap-3 w-full"
      >
        <label
          htmlFor="name"
          className="w-full text-[#374151] text-sm sm:text-lg font-medium sm:font-bold"
        >
          Nama
        </label>
        <Controller
          control={control}
          name="name"
          render={() => {
            return (
              <Input
                disabled
                {...register("name")}
                id="name"
                name="name"
                type="text"
                className="w-full mt-1 bg-transparent text-[#374151] border border-gray-300 dark:border-gray-300 h-[38px] "
                value={users[0]?.name}
              />
            );
          }}
        />
        <label
          htmlFor="handphone"
          className="w-full text-[#374151] text-sm sm:text-lg font-medium sm:font-bold"
        >
          Handphone
        </label>
        <Controller
          control={control}
          name="noHp"
          render={() => {
            return (
              <Input
                disabled
                {...register("noHp")}
                id="noHp"
                name="noHp"
                type="text"
                className="w-full mt-1 bg-transparent text-[#374151] border border-gray-300 dark:border-gray-300 h-[38px] "
                value={users[0]?.noHp}
              />
            );
          }}
        />
        <label
          htmlFor="confirmPassword"
          className="w-full text-[#374151] text-sm sm:text-lg font-medium sm:font-bold"
        >
          Old Password
        </label>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <>
              <Input
                disabled
                {...field}
                {...register("confirmPassword")}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="w-full mt-1 bg-transparent text-[#374151] border border-gray-300 dark:border-gray-300 h-[38px]"
                value={users[0]?.password}
              />
              {errors.confirmPassword && (
                <span className="text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </>
          )}
        />

        <label
          htmlFor="password"
          className="w-full text-[#374151] text-sm sm:text-lg font-medium sm:font-bold"
        >
          New Password
        </label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <>
              <Input
                {...field}
                {...register("password")}
                id="password"
                name="password"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 bg-transparent text-[#374151] border border-gray-300 dark:border-gray-300 h-[38px]"
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </>
          )}
        />
        <Button
          disabled={newPassword?.trim() ? false : true}
          className="rounded-full flex items-center gap-2 bg-[#E3E7FD] hover:bg-slate-300 dark:bg-orange-100 dark:hover:bg-orange-200"
        >
          <p className="text-sm sm:text-lg text-[#374151]">Edit Profile</p>
          <MoveRight className="text-[#374151]" />
        </Button>
      </form>
    </>
  );
}
