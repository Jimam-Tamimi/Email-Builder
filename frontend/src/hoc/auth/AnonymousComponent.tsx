import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface AnonymousComponentProps {
    children: React.ReactNode;
}

const AnonymousComponent = ({ children }: AnonymousComponentProps) => {
    const { data: authData } = useSelector((state: RootState) => state.auth);

    // If a user is authenticated, render nothing
    if (authData?.access) {
        return null;  // Return null to render nothing
    }

    // If no user is authenticated, render the children (anonymous content)
    return <>{children}</>;
};

export default AnonymousComponent;