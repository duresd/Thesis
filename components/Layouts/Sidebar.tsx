"use client"

import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IconCaretsDown from '@/components/Icon/IconCaretsDown';
import IconMenuDashboard from '@/components/Icon/Menu/IconMenuDashboard';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconMinus from '@/components/Icon/IconMinus';
import IconMenuChat from '@/components/Icon/Menu/IconMenuChat';
import IconMenuMailbox from '@/components/Icon/Menu/IconMenuMailbox';
import IconMenuTodo from '@/components/Icon/Menu/IconMenuTodo';
import IconMenuNotes from '@/components/Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '@/components/Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '@/components/Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '@/components/Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '@/components/Icon/Menu/IconMenuCalendar';
import IconMenuComponents from '@/components/Icon/Menu/IconMenuComponents';
import IconMenuElements from '@/components/Icon/Menu/IconMenuElements';
import IconMenuCharts from '@/components/Icon/Menu/IconMenuCharts';
import IconMenuWidgets from '@/components/Icon/Menu/IconMenuWidgets';
import IconMenuFontIcons from '@/components/Icon/Menu/IconMenuFontIcons';
import IconMenuDragAndDrop from '@/components/Icon/Menu/IconMenuDragAndDrop';
import IconMenuTables from '@/components/Icon/Menu/IconMenuTables';
import IconMenuDatatables from '@/components/Icon/Menu/IconMenuDatatables';
import IconMenuForms from '@/components/Icon/Menu/IconMenuForms';
import IconMenuUsers from '@/components/Icon/Menu/IconMenuUsers';
import IconMenuPages from '@/components/Icon/Menu/IconMenuPages';
import IconMenuAuthentication from '@/components/Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '@/components/Icon/Menu/IconMenuDocumentation';
import IconFolderPlus from '../Icon/IconFolderPlus';
import IconPlusCircle from '../Icon/IconPlusCircle';

const Sidebar = () => {
    const router = useRouter();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const { t } = useTranslation();

    const [user, setUser] = useState({ Role: '' })
    let link
    useEffect(
        () => {
            const info = localStorage.getItem("userInfo")
            if (info) {
                let data = JSON.parse(info)
                setUser(data);
                console.log(data);
                if (data.Role === 'Doctor') {
                    console.log('safdsafaaaaaaaaaaaaaaaaaaa');
                    const href = "/user/doctorProfile?id=" + data.Doctor_id;
                    link = <li className="menu nav-item">
                        <Link href={href} className="group">
                            <div className="flex items-center">
                                <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('dfdg')}</span>
                            </div>
                        </Link> </li>
                } else {
                    <li className="menu nav-item">
                        <Link href="/apps/invoice/DoctorList" className="group">
                            <div className="flex items-center">
                                <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Эмч, мэргэжилтэн')}</span>
                            </div>
                        </Link>
                    </li>
                }
            }
        }, []
    )

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [router.pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    const dispatch = useDispatch();


    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="ml-[5px] w-8 flex-none" src="" alt="" />
                            <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">{t('Dental')}</span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('Үндсэн цэс')}</span>
                            </h2>
                            {
                                user.Role === 'Employee' &&
                                <li className="menu nav-item">
                                    <Link href="/" className="group">
                                        <div className="flex items-center">
                                            <IconMenuWidgets className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Нүүр хуудас')}</span>
                                        </div>
                                    </Link>
                                </li>
                            }


                            <li className="menu nav-item">
                                <Link href="/apps/calendar" className="group">
                                    <div className="flex items-center">
                                        <IconMenuCalendar className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Цагийн хуваарь')}</span>
                                    </div>
                                </Link>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/apps/invoice/PatientList" className="group">
                                    <div className="flex items-center">
                                        <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Өвчтөнүү')}</span>
                                    </div>
                                </Link>
                            </li>
                            {

                                (user.Role === 'Doctor') ?
                                    <li className="menu nav-item">
                                        <Link href={`/users/doctorProfile?id=${user.Doctor_id}`} className="group">
                                            <div className="flex items-center">
                                                <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Хувийн мэдээлэл')}</span>
                                            </div>
                                        </Link> </li>
                                    :
                                    <li className="menu nav-item">
                                        <Link href="/apps/invoice/DoctorList" className="group">
                                            <div className="flex items-center">
                                                <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Эмч, мэргэжилтэн')}</span>
                                            </div>
                                        </Link>
                                    </li>

                            }

                            {
                                user.Role === 'Employee' &&
                                <li className="menu nav-item">
                                    <Link href="/datatables/export" className="group">
                                        <div className="flex items-center">
                                            <IconFolderPlus className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Тайлан')}</span>
                                        </div>
                                    </Link>
                                </li>
                            }

                            {
                                user.Role === 'Employee' &&
                                <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                    <IconMinus className="hidden h-5 w-4 flex-none" />
                                    <span>{t('Туслах цэs')}</span>
                                </h2>
                            }

                            {
                                user.Role === 'Employee' &&
                                <li className="menu nav-item">
                                    <Link href="/sub/AddCategory" className=" group">
                                        <div className="flex items-center">
                                            <IconPlusCircle className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark ">{t('Эмчилгээний Ангилал')}</span>
                                        </div>
                                    </Link>
                                </li>
                            }
                            {
                                user.Role === 'Employee' &&
                                <li className="menu nav-item">
                                    <Link href="/sub/AddTreatment" className=" group">
                                        <div className="flex items-center">
                                            <IconPlusCircle className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark ">{t('Эмчилгээний Төрөл')}</span>
                                        </div>
                                    </Link>
                                </li>
                            }
                            {
                                user.Role === 'Employee' &&
                                <li className="menu nav-item">
                                    <Link href="/sub/AddQuestion" className=" group">
                                        <div className="flex items-center">
                                            <IconPlusCircle className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark ">{t('Богино асуулт нэмэх')}</span>
                                        </div>
                                    </Link>
                                </li>
                            }

                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
