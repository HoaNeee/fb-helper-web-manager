import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
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
import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { logError } from "@/utils/utils";
import { getExceptionText, type CustomError } from "@/utils/exception";

export default function RegisterPage() {
  useLanguage();

  const navigate = useNavigate();
  const { register } = useAuth();

  const [error, setError] = useState("");

  const form = useRef<HTMLFormElement>(null);

  const handleRegister = async () => {
    const formData = new FormData(form.current);

    let err = "";
    const payload = {};

    formData.forEach((v, k) => {
      if (!v || !v.toString().trim()) {
        err = getTextWithLanguage({
          en: k + " is required",
          vi: k + " là bắt buộc",
        });
        return;
      }
      payload[k] = v;
    });

    if (err) {
      setError(err);
      return;
    }

    const username = formData.get("username").toString();
    const email = formData.get("email").toString();
    const password = formData.get("password").toString();

    try {
      const res = await register(username, email, password);
      if (res) {
        navigate("/login");
      }
    } catch (error) {
      logError("Error at handleRegister: ", error);
      setError(getTextWithLanguage(getExceptionText(error)));
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            {getTextWithLanguage({
              en: "Sign up for an account",
              vi: "Đăng ký tài khoản",
            })}
          </CardTitle>
          <CardDescription>
            {getTextWithLanguage({
              en: "Enter your information below to create an account",
              vi: "Nhập thông tin bên dưới để tạo tài khoản",
            })}
          </CardDescription>
          <CardAction>
            <Button
              link
              text={getTextWithLanguage({ en: "Sign in", vi: "Đăng nhập" })}
              to="/login"
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <form ref={form} onSubmit={handleRegister}>
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
                  name="username"
                  type="text"
                  placeholder="user123, user456,..."
                  required
                  onChange={() => setError("")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  onChange={() => setError("")}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    {getTextWithLanguage({ en: "Password", vi: "Mật khẩu" })}
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={() => setError("")}
                />
              </div>
            </div>
            {error && (
              <div className="mt-3 text-destructive">
                <p>{error}</p>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full justify-center text-base"
            text={getTextWithLanguage({ en: "Register", vi: "Đăng ký" })}
            onClick={handleRegister}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
