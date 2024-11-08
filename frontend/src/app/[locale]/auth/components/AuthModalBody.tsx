import { PagesNameType } from "./Auth";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import { ModalBody } from "@nextui-org/modal";
import VerifyEmail from "./screens/VerifyEmail";
import VerifyNumber from "./screens/VerifyNumber";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import { usePathname } from "@/i18n/routing";

interface AuthModalBodyProps {
  pageContent: any;
  countryCodes: any[];
}

const AuthModalBody = ({
  pageContent,
  countryCodes,
}: AuthModalBodyProps) => {
    const pathname = usePathname()
    
  return (
    <ModalBody className="gap-6 ">
      {pathname === '/auth/sign-in/' ? (
        <SignIn
          pageContent={pageContent}
          
        />
    ) : pathname === "/auth/forgot-password/" ? (
        <ForgotPassword
          pageContent={pageContent}
          
        />
    ) : pathname === '/auth/reset-password/' ? (
        <ResetPassword
          pageContent={pageContent}
          
        />
    ) : pathname === '/auth/verify-email/' ? (
        <VerifyEmail
          pageContent={pageContent}
          
        />
    ) : pathname === '/auth/verify-phone/' ? (
        <VerifyNumber
          pageContent={pageContent}
          
        />
    ) : pathname === '/auth/sign-up/' ? (
        <SignUp
          pageContent={pageContent}
          countryCodes={countryCodes}
          
        />
      ) : <></>}
    </ModalBody>
  );
};

export default AuthModalBody;
