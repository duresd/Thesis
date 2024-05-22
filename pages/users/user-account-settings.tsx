import Link from 'next/link';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconHome from '@/components/Icon/IconHome';
import IconChecks from '@/components/Icon/IconChecks';
import IconUser from '@/components/Icon/IconUser';
import IconPhone from '@/components/Icon/IconPhone'
import { useRouter } from 'next/router';


const AccountSetting = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id: patientId } = router.query as { id: string }; // Extract patientId from router query

    // State variables to hold patient details
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // State variables for form inputs
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


    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`/api/patient/UpdatePatient`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientId: patientId,
                    patientName: name,
                    regisNum: registrationNumber,
                    gender: gender,
                    phoneNum: phoneNumber,
                    emergName: emergencyContactName,
                    emergPNum: emergencyContactNumber,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update patient details');
            }
            router.push('/apps/invoice/PatientList')
            // Optionally handle success response
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

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/apps/invoice/PatientList" className="text-primary hover:underline">
                        Өвчтөнүүд
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Хувийн мэдээлэл өөрчлөх</span>
                </li>
            </ul>
            <div className="pt-5">
                <div>
                    <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('home')}
                                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconHome />
                                Ерөнхий
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('payment-details')}
                                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconChecks />
                                Эрүүл мэндийн асуулга
                            </button>
                        </li>
                    </ul>
                </div>
                {tabs === 'home' ? (
                    <div>
                        <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black " onSubmit={handleSubmit}>
                            <h6 className="mb-5 text-lg font-bold">Өвчтөний хувийн мэдээлэл</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4">
                                    <img src="/assets//images/lightbox5.jpeg" alt="img" className="mx-auto h-20 w-20 rounded-full object-cover md:h-32 md:w-32" />
                                </div>
                                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="Patient_Name">Овог нэр</label>
                                        <input id="Patient_Name" className="form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="Regis_Num">Регистрийн дугаар</label>
                                        <input id="Regis_Num" type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="Gender">Хүйс</label>
                                        <select id="Gender" className="form-select" name="Gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                            <option value="Male">Эрэгтэй</option>
                                            <option value="Female">Эмэгтэй</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="PhoneNumber">Утасны дугаар</label>
                                        <input id="PhoneNumber" type="text" className="form-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="EmergeName">Яаралтай үед холбоо барих хүний нэр</label>
                                        <input id="EmergeName" type="text" className="form-input" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="EmergeNum">Яаралтай үед холбоо барих хүний утас</label>
                                        <input id="EmergeNum" type="text" className="form-input" value={emergencyContactNumber} onChange={(e) => setEmergencyContactNumber(e.target.value)} />
                                    </div>
                                    <div className="mt-3 sm:col-span-2">
                                        <button type="submit" className="btn btn-primary">
                                            Хадгалах
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    ''
                )}

            </div>
        </div>
    );
};

export default AccountSetting;