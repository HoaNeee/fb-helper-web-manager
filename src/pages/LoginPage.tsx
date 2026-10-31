import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import AlertComponent from "@/components/AlertComponent";
import { Button } from "@/components/Button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import type { CustomError } from "@/utils/exception";
import { useEffect, useRef, useState } from "react";
import Loading from "@/components/Loading";

export default function LoginPage() {
  useLanguage();
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );

  const { login, state: authState } = useAuth();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (authState.loading) return;
    if (authState.is_authenticated) {
      location.href = "/";
    }
  }, [authState.is_authenticated, authState.loading]);

  const handleLogin = async () => {
    const formData = new FormData(formRef.current);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    try {
      await login(username, password);
    } catch (error) {
      setError({
        title: getTextWithLanguage({
          en: "Login failed",
          vi: "Đăng nhập thất bại",
        }),
        message: (error as CustomError).message,
      });
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {authState.loading && <Loading type="dialog" />}
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="w-full max-w-sm"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {getTextWithLanguage({
                en: "Login to your account",
                vi: "Đăng nhập vào tài khoản",
              })}
            </CardTitle>
            <CardDescription>
              {getTextWithLanguage({
                en: "Enter your username below to login to your account",
                vi: "Nhập tên đăng nhập bên dưới để đăng nhập vào tài khoản",
              })}
            </CardDescription>
            <CardAction>
              <Button
                link
                text={getTextWithLanguage({ en: "Sign up", vi: "Đăng ký" })}
                to="/register"
              />
            </CardAction>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="pt-2 pb-6">
                <AlertComponent
                  type="error"
                  title={error.title}
                  message={error.message}
                  showIcon={false}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">
                  {getTextWithLanguage({
                    en: "Username",
                    vi: "Tên đăng nhập",
                  })}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="user123, user456,..."
                  required
                  name="username"
                  tabIndex={1}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    {getTextWithLanguage({ en: "Password", vi: "Mật khẩu" })}
                  </Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                  >
                    {getTextWithLanguage({
                      en: "Forgot your password?",
                      vi: "Quên mật khẩu?",
                    })}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                  tabIndex={2}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full justify-center text-base"
              text={getTextWithLanguage({ en: "Login", vi: "Đăng nhập" })}
              // onClick={handleLogin}
            />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
