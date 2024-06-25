import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import axios from 'axios'; // Import axios for making HTTP requests

interface FormData {
    Doctor_Name: string;
    Profession_Id: string;
    Doctor_Pnum: string;
    Doctor_Rnum: string
    Gender: string;
    password: string
}

interface Profession {
    Profession_id: string;
    Profession_Name: string;
}

const Add = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Эмч нэмэх'));
    }, []);

    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        Doctor_Name: '',
        Profession_Id: '',
        Doctor_Pnum: '',
        Doctor_Rnum: '',
        Gender: '',
        password: ''
    });

    const [professions, setProfessions] = useState<Profession[]>([]);

    useEffect(() => {
        // Fetch professions from your API endpoint
        const fetchProfessions = async () => {
            try {
                const response = await axios.get('/api/profession/GetProfession');
                setProfessions(response.data);
            } catch (error) {
                console.error('Error fetching professions:', error);
            }
        };

        fetchProfessions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();



        try {
            const response = await axios.post('/api/doctor/CreateDoctor', formData);
            console.log('Response:', response.data);
            router.push('/apps/invoice/DoctorList');
            // Handle success

        } catch (error) {
            console.error('Error:', error);
            // Handle error
        }
    };


    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/apps/invoice/DoctorList" className="text-primary hover:underline">
                        Эмч мэргэжилтэнүүд
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Эмч нэмэх</span>
                </li>
            </ul>

            <div className="panel mt-5" id="forms_grid">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Эмчийн хувийн мэдээлэл</h5>
                </div>
                <div className="mb-5">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="gridName">Овог, нэр</label>
                                <input id="gridName" type="text" name="Doctor_Name" value={formData.Doctor_Name} onChange={handleChange} placeholder="Овог, нэр оруулна уу" className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="gridRnumber">Регистрийн дугаар</label>
                                <input id="gridRnumber" type="text" name="Doctor_Rnum" value={formData.Doctor_Rnum} onChange={handleChange} placeholder="Регистрийн дугаар оруулна уу" className="form-input" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="gridPnumber">Утасны дугаар</label>
                                <input id="gridPnumber" type="text" name="Doctor_Pnum" value={formData.Doctor_Pnum} onChange={handleChange} placeholder="Утасны дугаар оруулна уу" className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="gridPosition">Мэргэшил</label>
                                <select id="gridPosition" name="Profession_Id" value={formData.Profession_Id} onChange={handleChange} className="form-select text-sm">
                                    {professions.map((profession) => (
                                        <option key={profession.Profession_id} value={profession.Profession_id}>
                                            {profession.Profession_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="gridPassword">Нууц үг</label>
                                <input id="gridPassword" type="text" name="password" value={formData.password} onChange={handleChange} placeholder="Нууц үг оруулна уу" className="form-input" />
                            </div>
                            <div>
                                <label>Хүйс</label>
                                <input id="gridMale" type="radio" name="Gender" value="Эрэгтэй" onChange={handleChange} className="form-radio mr-2" />
                                <span className="text-dark mr-4">Эрэгтэй</span>
                                <input id="gridFemale" type="radio" name="Gender" value="Эмэгтэй" onChange={handleChange} className="form-radio mr-2 ml-4 " />
                                <span className="text-dark">Эмэгтэй</span>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary !mt-6">
                            Бүртгэх
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Add;
