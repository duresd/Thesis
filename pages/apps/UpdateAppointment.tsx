import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Appointment {
    Appointment_Id: number;
    Startdate: string;
    Enddate: string;
    Doctor: {
        Doctor_Name: string;
    };
    Patient: {
        Patient_id: string;
        Patient_Name: string;
        Phone_Num: string;
    };
    Category: {
        Category_Name: string;
    };
    Employee: {
        Employee_Name: string;
    };
    Employee_Id: number;
    Status: {
        Status_Name: string;
    };
    Description: string;
    created_At: string;
}

const UpdateAppointment = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appointment, setAppointment] = useState<Appointment | null>(null);

    const [formData, setFormData] = useState({
        Startdate: '',
        Enddate: '',
        Status_Name: '',
        Doctor_Name: '',
        Patient_Id: '',
        Category_Name: '',
        Description: '',
    });

    const router = useRouter();
    const { id: AppointmentID } = router.query as { id: string };

    useEffect(() => {
        dispatch(setPageTitle('Өвчтөнүүд'));
        if (AppointmentID) {
            fetchAppointmentDetail();
        }
    }, [dispatch, AppointmentID]);

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
                Startdate: new Date(data.Startdate).toISOString().slice(0, 16),
                Enddate: new Date(data.Enddate).toISOString().slice(0, 16),
                Status_Name: data.Status.Status_Name,
                Doctor_Name: data.Doctor.Doctor_Name,
                Patient_Id: data.Patient.Patient_id,
                Category_Name: data.Category.Category_Name,
                Description: data.Description,
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/appointment/UpdateAppointment?id=${AppointmentID}`, formData);
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
            <Link href="/apps/calendar">
                <button type="button" className="btn btn-primary !mt-6 mr-2 mb-5">
                    <IconArrowBackward />
                </button>
            </Link>

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
                                    name="Startdate"
                                    value={formData.Startdate}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="endDatetimeInput">Эмчилгээ дуусах огноо</label>
                                <input
                                    type="datetime-local"
                                    id="endDatetimeInput"
                                    name="Enddate"
                                    value={formData.Enddate}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="patientSelect">Өвчтөн сонгоно уу</label>
                                <select
                                    id="patientSelect"
                                    name="Patient_Id"
                                    value={formData.Patient_Id}
                                    onChange={handleInputChange}
                                    className="form-select text-sm"
                                >
                                    {appointment && (
                                        <option value={appointment.Patient.Patient_id}>
                                            {appointment.Patient.Patient_Name}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="description">Нэмэлт тайлбар</label>
                                <textarea
                                    name="Description"
                                    id="description"
                                    value={formData.Description}
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
