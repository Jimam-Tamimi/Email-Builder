import Cookies from 'js-cookie';

// Get the domain from environment variables
const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

const cookieStorage = {
    getItem: (key: string): Promise<any> => {
        return new Promise((resolve) => {
            const value = Cookies.get(key);
            resolve(value !== undefined ? JSON.parse(value) : null);
        });
    },
    setItem: (key: string, value: any): Promise<void> => {
        return new Promise((resolve) => {
            Cookies.set(key, JSON.stringify(value), {
                secure: true, // Ensure the cookie is only sent over HTTPS
                sameSite: 'Strict', // Mitigate CSRF attacks
                domain: cookieDomain, // Use domain from the environment variable
            });
            resolve();
        });
    },
    removeItem: (key: string): Promise<void> => {
        return new Promise((resolve) => {
            Cookies.remove(key, {
                secure: true, // Ensure the cookie is only sent over HTTPS
                sameSite: 'Strict', // Mitigate CSRF attacks
                domain: cookieDomain, // Use domain from the environment variable
            });
            resolve();
        });
    },
};

export default cookieStorage;
