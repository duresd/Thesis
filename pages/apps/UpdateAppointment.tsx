import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FormEvent, ChangeEvent } from 'react';
import dayjs from "dayjs";

interface Appointment {
    Appointment_Id: number;
    Startdate: string;
    Enddate: string;
    Doctor: {
        Doctor_id: string;
        Doctor_Name: string;
    };
    Patient: {
        Patient_id: string;
        Patient_Name: string;
        Phone_Num: string;
    };
    Category: {
        Category_Id: string;
        Category_Name: string;
    };
    Employee: {
        Employee_Name: string;
    };
    Employee_Id: number;
    Status: {
        Status_Id: string;
        Status_Name: string;
    };
    Description: string;
    created_At: string;
}

interface Doctor {
    Doctor_id: string;
    Doctor_Name: string;
}

interface Status {
    Status_Id: string;
    Status_Name: string;
}

interface FormData {
    startDate?: string,
    endDate?: string,
    doctorId: string
    patientName: string
    categoryId: string
    statusId: string
    description: string
}

const UpdateAppointment = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id: AppointmentID } = router.query as { id: string };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [formData, setFormData] = useState<FormData>({
        doctorId: '',
        patientName: '',
        categoryId: '',
        statusId: '',
        description: '',
    });
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('Өвчтөнүүд'));
        if (AppointmentID) {
            fetchAppointmentDetail();
        }
    }, [dispatch, AppointmentID]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('/api/doctor/GetDoctorList');
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await axios.get('/api/status/GetStatus');
                setStatuses(response.data);
            } catch (error) {
                console.error('Error fetching statuses\:', error);
            }
        };
        fetchStatuses();
    }, []);

    const fetchAppointmentDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/appointment/GetAppointmentbyID?id=${AppointmentID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch appointment details');
            }
            const data = await response.json();
            setAppointment(data);
            setFormData({
                startDate: dayjs(data.Startdate).format("YYYY-MM-DDTHH:mm"),
                endDate: dayjs(data.Enddate).format("YYYY-MM-DDTHH:mm"),
                doctorId: data.Doctor.Doctor_id,
                patientName: data.Patient.Patient_Name,
                categoryId: data.Category.Category_Id,
                statusId: data.Status.Status_Id,
                description: data.Description,
            });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                showMessage('Error fetching appointment details', 'error');
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/appointment/UpdateAppointmentStatus`, {
                appointmentId: AppointmentID,
                doctorId: formData.doctorId,
                statusId: formData.statusId,
                description: formData.description,
            });

            if (response.status === 200) {
                showMessage('Appointment updated successfully');
                router.push('/apps/calendar');
            } else {
                throw new Error('Failed to update appointment');
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                showMessage('Error updating appointment', 'error');
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/apps/calendar" className="text-primary hover:underline">
                        Цаг захиалга
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Цаг захиалгын төлөв</span>
                </li>
            </ul>

            <div className="panel" id="forms_grid">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Цаг захиалгын ерөнхий мэдээлэл</h5>
                </div>
                <div className="mb-5">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="startDatetimeInput">Эмчилгээ эхлэх огноо</label>
                                <input
                                    type="datetime-local"
                                    id="startDatetimeInput"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    disabled

                                />
                            </div>
                            <div>
                                <label htmlFor="endDatetimeInput">Эмчилгээ дуусах огноо</label>
                                <input
                                    type="datetime-local"
                                    id="endDatetimeInput"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="patientSelect">Өвчтөний нэр</label>
                                <input
                                    id="patientSelect"
                                    name="patientId"
                                    value={formData.patientName}
                                    className="form-input text-sm"
                                    disabled
                                />
                            </div>
                            <div>
                                <label htmlFor="doctorSelect">Эмч сонгоно уу</label>
                                <select
                                    id="doctorSelect"
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleInputChange}
                                    className="form-select text-sm"
                                >
                                    {doctors.map((doc) => (
                                        <option key={doc.Doctor_id} value={doc.Doctor_id}>
                                            {doc.Doctor_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="statusSelect">Төлөв</label>
                                <select
                                    id="statusSelect"
                                    name="statusId"
                                    value={formData.statusId}
                                    onChange={handleInputChange}
                                    className="form-select text-sm"
                                >
                                    {statuses.map((stat) => (
                                        <option key={stat.Status_Id} value={stat.Status_Id}>
                                            {stat.Status_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="description">Нэмэлт тайлбар</label>
                                <textarea
                                    name="description"
                                    id="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="form-textarea"
                                    placeholder="Тайлбар оруулна уу"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary !mt-6">
                            Хадгалах
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpdateAppointment;
