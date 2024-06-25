import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleLocale, toggleRTL } from '../../store/themeConfigSlice';
import { useRouter } from 'next/router';
import BlankLayout from '@/components/Layouts/BlankLayout';
import Dropdown from '@/components/Dropdown';
import { useTranslation } from 'react-i18next';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconMail from '@/components/Icon/IconMail';
import IconLockDots from '@/components/Icon/IconLockDots';
import IconInstagram from '@/components/Icon/IconInstagram';
import IconFacebookCircle from '@/components/Icon/IconFacebookCircle';
import IconTwitter from '@/components/Icon/IconTwitter';
import IconGoogle from '@/components/Icon/IconGoogle';
import IconPhoneCall from '@/components/Icon/IconPhoneCall';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';
// import { cookies } from 'next/headers';

const LoginBoxed = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Нэвтрэх'));
    });
    const router = useRouter();
    const [Employee_Pnum, setP_number] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Employee_Pnum, password }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                localStorage.setItem("userInfo", JSON.stringify(data.user))
                // if (data) {
                //     const oneDay = 24 * 60 * 60 * 1000;
                //     cookies().set('authToken', data.employee.Employee_Id, { expires: Date.now() - oneDay });
                // }
                // Redirect to dashboard or any other page on successful login
                router.push('/');
            } else {
                // Check if the response status is 401 Unauthorized
                if (response.status === 401) {
                    // Display an alert indicating wrong email or password
                    alert('Incorrect email or password. Please try again.');
                    // if(response.message){
                    //     toast.success(response.message);
                    // }
                } else {
                    // For other errors, log the error message
                    const errorData = await response.json();
                    console.error('Login error:', errorData.message);
                    // Handle login error, show error message to user
                    // For example, you can display a generic error message
                    alert('Failed to login. Please try again later.');
                    // toast.error('Алдаа гарлаа');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            // Handle network error
            // Display a generic error message to the user
            // toast.error('Алдаа гарлаа');
            alert('Failed to login. Please try again later.');
        }
    };

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState('');
    useEffect(() => {
        setLocale(localStorage.getItem('i18nextLng') || themeConfig.locale);
    }, []);

    const { t, i18n } = useTranslation();

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center  bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">

                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="md:text-1xl text-2xl font-extrabold uppercase !leading-snug text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    A Time Management System Of Dental Clinic
                                </h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Шүдний эмнэлгийн цаг захиалгын систем</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Employee_Pnum">Утасны дугаар</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Employee_Pnum"
                                            type="text"
                                            placeholder="+97612345678"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            value={Employee_Pnum}
                                            onChange={(e) => setP_number(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconPhoneCall fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Нууц үг</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type="password"
                                            placeholder="Нууцүг123@"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="flex cursor-pointer items-center">
                                        <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                                        <span className="text-white-dark">Нэвтрэх нэр сануулах</span>
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Нэвтрэх
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
LoginBoxed.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default LoginBoxed;
