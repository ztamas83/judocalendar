import { cn } from "~/utils/utils";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Card, TextField, Button } from "@mui/material";
import { useAuth } from "~/services/auth-provider";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { loginWithGoogle, user } = useAuth();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
            <p className="text-red-400">
              Currently only Google login supported
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <TextField
                  disabled={true}
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <TextField
                  disabled={true}
                  id="password"
                  type="password"
                  label="Password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={true}>
                Login
              </Button>
              <Button
                className="w-full hover:bg-gray-300"
                onClick={loginWithGoogle}
              >
                Login with Google
              </Button>
            </div>
            {/* <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
