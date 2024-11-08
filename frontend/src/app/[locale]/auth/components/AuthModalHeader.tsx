import { MdOutlineClose } from 'react-icons/md';
import { ModalHeader } from '@nextui-org/modal';
import { usePathname, useRouter } from '@/i18n/routing';
import { useEffect, useState } from 'react';

interface AuthModalHeaderProps {
    pageContent: any;
}

const AuthModalHeader = ({ pageContent }: AuthModalHeaderProps) => {
    const pathname = usePathname();

    const [title, setTitle] = useState('');

    useEffect(() => {
        const titles: { [key: string]: any } = {
            '/auth/sign-in/': pageContent?.sign_in_title || 'Sign In',
            '/auth/forgot-password/': pageContent?.forgot_password_title || 'Forgot Password',
            '/auth/reset-password/': pageContent?.reset_password_title || 'Reset Password',
            '/auth/verify-phone/': pageContent?.verify_your_number_title || '',
            '/auth/verify-email/': pageContent?.verify_your_email_title || 'Verify Your Email',
            '/auth/sign-up/': pageContent?.sign_up_title || 'Create A New Account'
        };

        const newTitle = titles[pathname] || pageContent?.welcome_meta_title;
        setTitle(newTitle);
        document.title = newTitle;
        return () => {
            document.title = pageContent?.welcome_meta_title || "";
        };
    }, [pathname, pageContent]);

        const router = useRouter()

    return (
        <ModalHeader className="flex flex-row items-center justify-between">
            <h3 className="text-2xl tracking-wide">{title}</h3>
            <div
                onClick={e => router.push('/')}
                className="p-0.5 left-0.5 relative hover:scale-110 active:scale-90 transition-all duration-300 ease-in-out cursor-pointer rounded-full"
            >
                <MdOutlineClose size={25} />
            </div>
        </ModalHeader>
    );
};

export default AuthModalHeader;
