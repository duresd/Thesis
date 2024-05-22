import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import axios from 'axios'; // Import axios for making HTTP requests

interface FormData {
    Startdate: string;
    Enddate: string;
    Category_Id: string;
    Doctor_Id: string;
    Patient_Id: string;
    Description: string;
}

interface Patient {
    Patient_id: string;
    Patient_Name: string;
}

interface Doctor {
    Doctor_id: string;
    Doctor_Name: string;
}

interface Category {
    Category_Id: string;
    Category_Name: string;
}


const AddAppointment = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Цаг захиалга нэмэх'));
    }, [dispatch]);

    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        Startdate: new Date().toISOString().slice(0, 16),
        Enddate: new Date().toISOString().slice(0, 16),
        Category_Id: '',
        Doctor_Id: '',
        Patient_Id: '',
        Description: ''
    });

    const [patient, setPatient] = useState<Patient[]>([]);
    const [doctor, setDoctor] = useState<Doctor[]>([]);
    const [categories, setCategory] = useState<Category[]>([]);


    useEffect(() => {
        // Fetch professions from your API endpoint
        const fetchPatient = async () => {
            try {
                const patientResponse = await axios.get('/api/patient/GetPatientlist');
                setPatient(patientResponse.data);

                const doctorResponse = await axios.get('/api/doctor/GetDoctorList');
                setDoctor(doctorResponse.data);

                const categoryResponse = await axios.get('/api/treatmentcategory/GetTreatmentCategory');
                setCategory(categoryResponse.data);

            } catch (error) {
                console.error('Error fetching patient:', error);
            }
        };

        fetchPatient();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();



        try {
            const response = await axios.post('/api/appointment/CreateAppointment', formData);
            console.log('Response:', response.data);
            router.push('/apps/calendar');
            // Handle success

        } catch (error) {
            console.error('Error:', error);
            // Handle error
        }
    };


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
                                <input type="datetime-local" id="startDatetimeInput" name="Startdate" value={formData.Startdate} onChange={handleChange} className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="endDatetimeInput">Эмчилгээ дуусах огноо</label>
                                <input type="datetime-local" id="endDatetimeInput" name="Enddate" value={formData.Enddate} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="patientSelect">Өвчтөн сонгоно уу</label>
                                <select id="patientSelect" name="Patient_Id" value={formData.Patient_Id} onChange={handleChange} className="form-select text-sm">
                                    <option value="" selected>Сонгоно уу</option>
                                    {patient.map((patient) => (
                                        <option key={patient.Patient_id} value={patient.Patient_id}>
                                            {patient.Patient_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="doctorSelect">Эмч сонгоно уу</label>
                                <select id="doctorSelect" name="Doctor_Id" value={formData.Doctor_Id} onChange={handleChange} className="form-select text-sm">
                                    <option value="" selected>Сонгоно уу</option>
                                    {doctor.map((doctor) => (
                                        <option key={doctor.Doctor_id} value={doctor.Doctor_id}>
                                            {doctor.Doctor_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="categorySelect">Эмчилгээний ангилал сонгоно уу</label>
                                <select id="categorySelect" name="Category_Id" value={formData.Category_Id} onChange={handleChange} className="form-select text-sm">
                                    <option value="" selected>Сонгоно уу</option>
                                    {categories.map((categories) => (
                                        <option key={categories.Category_Id} value={categories.Category_Id}>
                                            {categories.Category_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="description">Нэмэлт тайлбар</label>
                                <textarea name="Description" id="description" value={formData.Description} onChange={handleChange} className="form-textarea" placeholder='Тайлбар оруулна уу'></textarea>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary !mt-6">
                            Нэмэх
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddAppointment;
