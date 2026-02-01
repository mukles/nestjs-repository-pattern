"use client";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui-kit/input";
import { useState } from "react";
import { cn } from "../lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function PasswordInput({ className, ...rest }: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        className={cn("pr-8.5 placeholder:text-gray-400", className)}
        id="password"
        type={isPasswordVisible ? "text" : "password"}
        {...rest}
      />

      {isPasswordVisible ? (
        <EyeOff
          onClick={() => setIsPasswordVisible(false)}
          className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-600"
        />
      ) : (
        <Eye
          onClick={() => setIsPasswordVisible(true)}
          className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-600"
        />
      )}
    </div>
  );
}
