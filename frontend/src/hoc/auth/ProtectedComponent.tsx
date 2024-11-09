"use client"
import { useSelector } from 'react-redux';
import { AuthType, Role } from '@/types/auth';
import { useRouter } from '@/i18n/routing';
import { RootState } from '@/redux/store';

interface ProtectedComponentProps {
  allowedRoles?: Role[]; // Array of roles allowed to access this component
  children: React.ReactNode;
}

const ProtectedComponent = ({ allowedRoles, children }: ProtectedComponentProps) => {
  const { data: authData } = useSelector((state: RootState) => state.auth);

  // If no user is authenticated or the user does not have the required role, render nothing
  if (!allowedRoles || allowedRoles.length === 0) {
    return authData?.access ? <>{children}</> : null;
  }
  if (!authData?.access || !authData.user?.role ||  !allowedRoles.includes(authData.user?.role)) {
    return null;  // Return null to render nothing
  }

  // If the user has the required role, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedComponent;
