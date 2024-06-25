import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconPencilPaper from '@/components/Icon/IconPencilPaper';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

const Profile = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id: Doctor_id } = router.query; // Extract patientId from router query

    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [registrationNumber, setRegistrationNumber] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [profession, setProfession] = useState<string>('');
    const [appointments, setAppointment] = useState<any[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('Эмч мэргэжилтэн'));
        if (Doctor_id) {
            fetchDoctorDetails();
        }
    }, [dispatch, Doctor_id]);

    const fetchDoctorDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/doctor/GetDoctorbyID?id=${Doctor_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch doctor details');
            }
            const data = await response.json();
            setProfession(data.Profession.Profession_Name);
            setName(data.Doctor_Name);
            setRegistrationNumber(data.Doctor_Rnum);
            setGender(data.Gender);
            setPhoneNumber(data.Doctor_Pnum);
            setAppointment(data.appointment);
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



    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/apps/invoice/DoctorList" className="text-primary hover:underline">
                        Эмч мэргэжилтэн
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
                            <h5 className="text-lg font-semibold dark:text-white-light">Эмчийн мэдээлэл</h5>
                            <Link href="/users/" className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto">
                                <IconPencilPaper />
                            </Link>
                        </div>
                        <div className="mb-5">
                            <div className="flex flex-col items-center justify-center">
                                <img src="/assets/images/lightbox5.jpeg" alt="img" className="mb-5 h-24 w-24 rounded-full  object-cover" />
                                <p className="text-lg font-semibold text-primary">Овог, нэр: {name}</p>
                            </div>
                            <ul className="m-auto mt-5 flex max-w-[260px] flex-col space-y-1 font-semibold text-white-dark">
                                <li className="flex items-center gap-1">
                                    {/* <IconInfoCircle className="shrink-0" /> */}
                                    <label className='mt-1 text-primary'>Мэргэшил: </label>
                                    {profession}
                                </li>
                                <li className="flex items-center gap-1">
                                    {/* <IconNotes className="shrink-0" /> */}
                                    <label className='mt-1 text-primary'>Регистрийн дугаар: </label>
                                    {registrationNumber}
                                </li>
                                <li className="flex items-center gap-2">
                                    {/* <IconPhone /> */}
                                    <label className='mt-1 text-primary'>Утасны дугаар: </label>
                                    <span className="" dir="ltr">
                                        {phoneNumber}
                                    </span>
                                </li>
                                <li>
                                    <button className="flex items-center gap-2">
                                        {/* <IconUsers className="w-5 h-5 shrink-0" /> */}
                                        <label className='mt-1 text-primary'>Хүйс: </label>
                                        <span className="">{gender}</span>
                                    </button>
                                </li>

                            </ul>
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 xl:col-span-3">
                        <div className="mb-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Эмч дээр хийгдсэн цаг захиалгууд</h5>
                        </div>
                        <div className="mb-5">
                            <div className="table-responsive font-semibold text-[#515365] dark:text-white-light">
                                <table className="whitespace-nowrap">
                                    <thead>
                                        <tr>
                                            <th className="text-info">Өвчтөн</th>
                                            <th className="text-info">Эмчилгээний ангилал</th>
                                            <th className="text-info">Эмчилгээний төрөл</th>
                                            <th className="text-info">Эмчилгээ эхлэх цаг</th>
                                            <th className="text-info">Эмчилгээ дуусах цаг</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-white-dark ">
                                        <tr>
                                            <td>
                                                {appointments.map((history) => (
                                                    <div key={history.Appointment_Id} className="mb-4">
                                                        {/* Create a link element with `href` and `onClick` */}
                                                        <Link href={`/users/user-account-settings?id=${history.Patient.Patient_id}`}>
                                                            {history.Patient.Patient_Name}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {appointments.map((history) => (
                                                    <div key={history.Appointment_Id} className="mb-4"> {/* Assuming each history item has a unique id */}
                                                        {history.Category.Category_Name}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {appointments.map((history) => (
                                                    <div key={history.Appointment_Id} className="mb-4"> {/* Assuming each history item has a unique id */}
                                                        {history.Treatment.Treatment_Name}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="text-center">
                                                {appointments.map((history) => (
                                                    <div key={history.Appointment_Id} className="mb-4"> {/* Assuming each history item has a unique id */}
                                                        {dayjs(history.Startdate).format('YYYY-MM-DDTHH:MM')}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="text-center">
                                                {appointments.map((history) => (
                                                    <div key={history.Appointment_Id} className="mb-4"> {/* Assuming each history item has a unique id */}
                                                        {dayjs(history.Enddate).format('YYYY-MM-DDTHH:MM')}
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
