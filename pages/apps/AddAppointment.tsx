import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '../../store/themeConfigSlice';
import axios from 'axios';
import { Doctor, Patient, Treatment, Treatment_Category } from '@prisma/client';

interface FormData {
    Startdate: string;
    Enddate: string;
    Category_Id: string;
    Treatment_Id: string;
    Doctor_Id: string;
    Patient_Id: string;
    Description: string;
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
        Treatment_Id: '',
        Doctor_Id: '',
        Patient_Id: '',
        Description: ''
    });

    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [categories, setCategories] = useState<Treatment_Category[]>([]);
    const [treatment, setTreatment] = useState<Treatment[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientResponse = await axios.get('/api/patient/GetPatientlist');
                setPatients(patientResponse.data);

                const doctorResponse = await axios.get('/api/doctor/GetDoctorList');
                setDoctors(doctorResponse.data);

                const categoryResponse = await axios.get('/api/treatmentcategory/GetTreatmentCategory');
                setCategories(categoryResponse.data);
                const treatmentResponse = await axios.get('/api/treatment/GetTreatment');
                setTreatment(treatmentResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'Category_Id') {
            // Filter treatments based on the selected category ID
            const categoryTreatments = treatment.filter(treatment => treatment.Treatment_Category_Id === value);
            setFilteredTreatments(categoryTreatments);
        }

        if (name === 'Doctor_Id') {
            const doctor = doctors.find(p => p.Doctor_id === value);
            setSelectedDoctor(doctor || null);
        }

        if (name === 'Patient_Id') {
            const patient = patients.find(p => p.Patient_id === value);
            setSelectedPatient(patient || null);
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/appointment/CreateAppointment', formData);
            console.log('Response:', response.data);
            router.push('/apps/calendar');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [isTimeValid, setIsTimeValid] = useState(true);

    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isValid = validateTime(value);
        setIsTimeValid(isValid);

        if (isValid) {
            const updatedFormData = {
                ...formData,
                [name]: value
            };

            if (name === 'Startdate') {
                updatedFormData.Enddate = calculateEndDate(value);
            }

            setFormData(updatedFormData);
        }
    };

    const validateTime = (dateTime: string): boolean => {
        const date = new Date(dateTime);
        const hours = date.getHours();
        return hours >= 10 && hours <= 20; // Valid between 10 AM and 8 PM
    };

    const calculateEndDate = (startDate: string): string => {
        const start = new Date(startDate);
        start.setHours(start.getHours() + 1); // Add one hour
        const year = start.getFullYear();
        const month = String(start.getMonth() + 1).padStart(2, '0');
        const day = String(start.getDate()).padStart(2, '0');
        const hours = String(start.getHours()).padStart(2, '0');
        const minutes = String(start.getMinutes()).padStart(2, '0');

        // Return formatted string suitable for datetime-local input
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/apps/calendar" className="text-primary hover:underline">
                        Цагийн хуваарь
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Цаг захиалга нэмэх</span>
                </li>
            </ul>
            <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
                <div className="panel" id="forms_grid">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Цаг захиалгын ерөнхий мэдээлэл</h5>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="patientSelect">Өвчтөн сонгоно уу</label>
                                    <select id="patientSelect" name="Patient_Id" value={formData.Patient_Id} onChange={handleChange} className="form-select text-sm">
                                        <option value="" disabled selected>Сонгоно уу</option>
                                        {patients.map((patient) => (
                                            <option key={patient.Patient_id} value={patient.Patient_id}>
                                                {patient.Patient_Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="categorySelect">Эмчилгээний ангилал сонгоно уу</label>
                                    <select id="categorySelect" name="Category_Id" value={formData.Category_Id} onChange={handleChange} className="form-select text-sm">
                                        <option value="" disabled selected>Сонгоно уу</option>
                                        {categories.map((category) => (
                                            <option key={category.Category_Id} value={category.Category_Id}>
                                                {category.Category_Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="treatmentSelect">Эмчилгээний төрөл сонгоно уу</label>
                                <select id="treatmentSelect" name="Treatment_Id" value={formData.Treatment_Id} onChange={handleChange} className="form-select text-sm">
                                    <option value="" disabled selected>Сонгоно уу</option>
                                    {filteredTreatments.map((treatments) => (
                                        <option key={treatments.Treatment_Id} value={treatments.Treatment_Id}>
                                            {treatments.Treatment_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="startDatetimeInput">Эмчилгээ эхлэх огноо</label>
                                    <input type="datetime-local" id="startDatetimeInput" name="Startdate" value={formData.Startdate} onChange={handleTimeChange} className={`form-input ${isTimeValid ? '' : 'border-red-500'}`} />
                                    {!isTimeValid && (
                                        <p className="text-red-500">Эхлэх цаг нь 10-аас 20-н цагийн хооронд байх ёстой.</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="endDatetimeInput">Эмчилгээ дуусах огноо</label>
                                    <input type="datetime-local" id="endDatetimeInput" name="Enddate" value={formData.Enddate} className="form-input" readOnly />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="doctorSelect">Эмч сонгоно уу</label>
                                    <select id="doctorSelect" name="Doctor_Id" value={formData.Doctor_Id} onChange={handleChange} className="form-select text-sm">
                                        <option value="" disabled selected>Сонгоно уу</option>
                                        {doctors.map((doctor) => (
                                            <option key={doctor.Doctor_id} value={doctor.Doctor_id}>
                                                {doctor.Doctor_Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="description">Нэмэлт тайлбар</label>
                                    <textarea name="Description" id="description" value={formData.Description} onChange={handleChange} className="form-textarea" placeholder='Тайлбар оруулна уу'></textarea>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary !mt-5">
                                Нэмэх
                            </button>
                        </form>
                    </div>
                </div>
                {selectedPatient && (
                    <div className="panel" id="forms_grid">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Сонгогдсон өвчтөний мэдээлэл</h5>
                        </div>
                        <div className="mb-5">
                            <form className="space-y-5">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="patientName">Өвчтөний нэр</label>
                                        <input type="text" id="patientName" value={selectedPatient.Patient_Name} readOnly className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="patientPhone">Утасны дугаар</label>
                                        <input type="text" id="patientPhone" value={selectedPatient.Phone_Num} readOnly className="form-input" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="patientRnum">Регистрийн дугаар</label>
                                        <input type="text" id="patientRnum" value={selectedPatient.Regis_Num} readOnly className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="patientGender">Хүйс</label>
                                        <input type="text" id="patientGender" value={selectedPatient.Gender} readOnly className="form-input" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="patientEmergname">Яаралтай үед холбоо барих хүний нэр</label>
                                        <input type="text" id="patientEmergname" value={selectedPatient.Emerg_Name} readOnly className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="patientEmergnum">Яаралтай үед холбоо барих хүний утас</label>
                                        <input type="text" id="patientEmergnum" value={selectedPatient.Emerg_PNum} readOnly className="form-input" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Сонгогдсон Эмчийн мэдээлэл</h5>
                        </div>
                        <div className="mb-5">
                            <form className="space-y-5">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="patientName">Эмчийн нэр</label>
                                        <input type="text" id="patientName" value={selectedDoctor?.Doctor_Name} readOnly className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="patientPhone">Утасны дугаар</label>
                                        <input type="text" id="patientPhone" value={selectedDoctor?.Doctor_Pnum} readOnly className="form-input" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="patientRnum">Регистрийн дугаар</label>
                                        <input type="text" id="patientRnum" value={selectedDoctor?.Doctor_Rnum} readOnly className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="patientGender">Хүйс</label>
                                        <input type="text" id="patientGender" value={selectedDoctor?.Gender} readOnly className="form-input" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AddAppointment;
