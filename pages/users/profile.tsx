import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconPencilPaper from '@/components/Icon/IconPencilPaper';
import IconCalendar from '@/components/Icon/IconCalendar';
import IconMenuUsers from '@/components/Icon/Menu/IconMenuUsers';
import IconMapPin from '@/components/Icon/IconMapPin';
import IconNotes from '@/components/Icon/IconNotes';
import IconUsers from '@/components/Icon/IconUsers';
import IconPhone from '@/components/Icon/IconPhone';
import IconTwitter from '@/components/Icon/IconTwitter';
import IconDribbble from '@/components/Icon/IconDribbble';
import IconGithub from '@/components/Icon/IconGithub';
import IconClock from '@/components/Icon/IconClock';
import { useRouter } from 'next/router';

const Profile = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id: patientId } = router.query; // Extract patientId from router query

    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [registrationNumber, setRegistrationNumber] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [emergencyContactName, setEmergencyContactName] = useState<string>('');
    const [emergencyContactNumber, setEmergencyContactNumber] = useState<string>('');


    useEffect(() => {
        dispatch(setPageTitle('Өвчтөнүүд'));
        if (patientId) {
            fetchPatientDetails();
        }
    }, [dispatch, patientId]);

    const fetchPatientDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/patient/GetPatientbyID?id=${patientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch patient details');
            }
            const data = await response.json();
            setPatient(data);
            // Populate form inputs with patient details
            setName(data.Patient_Name);
            setRegistrationNumber(data.Regis_Num);
            setGender(data.Gender);
            setPhoneNumber(data.Phone_Num);
            setEmergencyContactName(data.Emerg_Name);
            setEmergencyContactNumber(data.Emerg_PNum);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };
    console.log(registrationNumber)

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/apps/invoice/PatientList" className="text-primary hover:underline">
                        Өвчтөнүүд
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Дэлгэрэнгүй</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Өвчтөний мэдээлэл</h5>
                            <Link href="/users/user-account-settings" className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto">
                                <IconPencilPaper />
                            </Link>
                        </div>
                        <div className="mb-5">
                            <div className="flex flex-col items-center justify-center">
                                <img src="/assets/images/lightbox2.jpeg" alt="img" className="mb-5 h-24 w-24 rounded-full  object-cover" />
                                <p className="text-xl font-semibold text-primary" >{name}</p>
                            </div>
                            <ul className="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                                <li className="flex items-center gap-2">
                                    <IconNotes className="shrink-0" />
                                    {registrationNumber}
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconMapPin className="shrink-0" />
                                    Баянзүрх Дүүрэг 6-р хороо 23-р байр 41 тоот
                                </li>
                                <li>
                                    <button className="flex items-center gap-2">
                                        <IconUsers className="w-5 h-5 shrink-0" />
                                        <span className="truncate text-primary">{gender}</span>
                                    </button>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconPhone />
                                    <span className="whitespace-nowrap" dir="ltr">
                                        {phoneNumber}
                                    </span>
                                </li>
                            </ul>
                            <ul className="mt-7 flex items-center justify-center gap-2">
                                <li>
                                    <button className="btn btn-info flex h-10 w-10 items-center justify-center rounded-full p-0">
                                        <IconTwitter className="w-5 h-5" />
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-danger flex h-10 w-10 items-center justify-center rounded-full p-0">
                                        <IconDribbble />
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-dark flex h-10 w-10 items-center justify-center rounded-full p-0">
                                        <IconGithub />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 xl:col-span-3">
                        <div className="mb-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Эмчилгээний түүх</h5>
                        </div>
                        <div className="mb-5">
                            <div className="table-responsive font-semibold text-[#515365] dark:text-white-light">
                                <table className="whitespace-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Эмчилгээний нэр</th>
                                            <th>Үйл явц</th>
                                            <th>Хувь</th>
                                            <th className="text-center">Эмчилгээ хийлгэсэн өдөр</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-white-dark">
                                        <tr>
                                            <td>Шүд цайруулах эмчилгээ</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-1/2 rounded-full bg-info"></div>
                                                </div>
                                            </td>
                                            <td className="text-info">50%</td>
                                            <td className="text-center">19/04/2024 </td>
                                        </tr>
                                        <tr>
                                            <td>Шүдний чулуу түүх</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[100%] rounded-full bg-success"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">100%</td>
                                            <td className="text-center">15/04/2024</td>
                                        </tr>
                                        <tr>
                                            <td>Гажиг заслын оношилгоо</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[100%] rounded-full  bg-success"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">100%</td>
                                            <td className="text-center">20/03/2024</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div className="panel">
                        <div className="mb-10 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Цаг захиалгын түүх</h5>
                            <button className="btn btn-primary">Нэмэх</button>
                        </div>
                        <div className="group">
                            <ul className="mb-7 list-inside list-disc space-y-2 font-semibold text-white-dark">
                                <li>19/04/2024 12:00</li>
                                <li>15/04/2024 14:00</li>
                                <li>20/03/2024 12:00</li>
                            </ul>
                            <div className="mb-4 flex items-center justify-between font-semibold">
                                <p className="flex items-center rounded-full bg-dark px-2 py-1 text-xs font-semibold text-white-light">
                                    <IconClock className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                                    5 Days Left
                                </p>
                                <p className="text-info">Дараагийн үзлэг</p>
                            </div>
                            <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-dark-light p-0.5 dark:bg-dark-light/10">
                                <div className="relative h-full w-full rounded-full bg-gradient-to-r from-[#f67062] to-[#fc5296]" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Payment History</h5>
                        </div>
                        <div>
                            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                <div className="flex items-center justify-between py-2">
                                    <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                        March
                                        <span className="block text-white-dark dark:text-white-light">Pro Membership</span>
                                    </h6>
                                    <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                        <p className="font-semibold">90%</p>
                                        <div className="dropdown ltr:ml-4 rtl:mr-4">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                btnClassName="hover:text-primary"
                                                button={<IconHorizontalDots className="opacity-80 hover:opacity-100" />}
                                            >
                                                <ul className="!min-w-[150px]">
                                                    <li>
                                                        <button type="button">View Invoice</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Download Invoice</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                <div className="flex items-center justify-between py-2">
                                    <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                        February
                                        <span className="block text-white-dark dark:text-white-light">Pro Membership</span>
                                    </h6>
                                    <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                        <p className="font-semibold">90%</p>
                                        <div className="dropdown ltr:ml-4 rtl:mr-4">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                button={<IconHorizontalDots className="opacity-80 hover:opacity-100" />}
                                            >
                                                <ul className="!min-w-[150px]">
                                                    <li>
                                                        <button type="button">View Invoice</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Download Invoice</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between py-2">
                                    <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                        January
                                        <span className="block text-white-dark dark:text-white-light">Pro Membership</span>
                                    </h6>
                                    <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                        <p className="font-semibold">90%</p>
                                        <div className="dropdown ltr:ml-4 rtl:mr-4">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                button={<IconHorizontalDots className="opacity-80 hover:opacity-100" />}
                                            >
                                                <ul className="!min-w-[150px]">
                                                    <li>
                                                        <button type="button">View Invoice</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Download Invoice</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Profile;
