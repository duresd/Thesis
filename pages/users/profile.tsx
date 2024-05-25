import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconPencilPaper from '@/components/Icon/IconPencilPaper';
import IconNotes from '@/components/Icon/IconNotes';
import IconUsers from '@/components/Icon/IconUsers';
import IconPhone from '@/components/Icon/IconPhone';
import IconClock from '@/components/Icon/IconClock';
import { useRouter } from 'next/router';
import IconCircleCheck from '@/components/Icon/IconCircleCheck';

interface Patient_history {
    History_Id: string,
    Appointment_Id: string,
    Appointment: {
        Startdate: string,
        Treatment: {
            Treatment_Name: string,
        },
        Category: {
            Category_Name: string,
        },
        Doctor: {
            Doctor_Name: string,
        },
    }
    Description: string,
}
interface Appointment {
    appointment: {
        Appointment_Id: string,
        Startdate: string,
    }
}

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
    const [isFilled, setIsFilled] = useState<boolean>(false); // Initialize as boolean
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('Өвчтөнүүд'));
        if (patientId) {
            fetchPatientDetails();
            fetchPatientHistory();
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
            // setPatient(data);
            // Populate form inputs with patient details
            setName(data.Patient_Name);
            setRegistrationNumber(data.Regis_Num);
            setGender(data.Gender);
            setPhoneNumber(data.Phone_Num);
            setEmergencyContactName(data.Emerg_Name);
            setEmergencyContactNumber(data.Emerg_PNum);
            setIsFilled(data.Is_Filled);
            setAppointments(data.appointments);
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

    const [patienthistory, setPatientHistory] = useState<Patient_history[]>([]);
    const fetchPatientHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/patienthistory/GetPatienHistorybyID?id=${patientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch patient details');
            }
            const data = await response.json();
            setPatientHistory(data);
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
                                <p className="text-xl font-semibold text-primary">{name}</p>
                            </div>
                            <ul className="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                                <li className="flex items-center gap-2">
                                    <IconNotes className="shrink-0" />
                                    {registrationNumber}
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCircleCheck className="shrink-0" />
                                    {isFilled ? 'Эрүүл мэндийн асуулга бөглсөн' : 'Эрүүд мэндийн асуулга бөглөөгүй'} {/* Display isFilled as Yes or No */}
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
                                            <th className="text-info">Эмчилгээний ангилал</th>
                                            <th className="text-info">Эмчилгээний төрөл</th>
                                            <th className="text-info">Эмчилгээ хийлгэсэн эмч</th>
                                            <th className="text-info">Эмчилгээ хийлгэсэн өдөр</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-white-dark">
                                        <tr>
                                            <td>
                                                {patienthistory.map((history) => (
                                                    <div key={history.History_Id}> {/* Assuming each history item has a unique id */}
                                                        {history.Appointment.Category.Category_Name}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {patienthistory.map((history) => (
                                                    <div key={history.History_Id}> {/* Assuming each history item has a unique id */}
                                                        {history.Appointment.Treatment.Treatment_Name}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="text-center">
                                                {patienthistory.map((history) => (
                                                    <div key={history.History_Id}> {/* Assuming each history item has a unique id */}
                                                        {history.Appointment.Doctor.Doctor_Name}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="text-center">
                                                {patienthistory.map((history) => (
                                                    <div key={history.History_Id}> {/* Assuming each history item has a unique id */}
                                                        {history.Appointment.Startdate}
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
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="panel">
                        <div className="mb-10 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Цаг захиалгын түүх</h5>
                            <button className="btn btn-primary">Нэмэх</button>
                        </div>
                        <div className="group">
                            <ul className="mb-7 list-inside list-disc space-y-2 font-semibold text-white-dark">
                                <li>{appointments && appointments.map((appointment) => (
                                    <div key={appointment.appointment.Appointment_Id}>
                                        {appointment.appointment.Startdate}
                                    </div>
                                ))}</li>
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
                </div>
            </div>
        </div>
    );
};

export default Profile;
