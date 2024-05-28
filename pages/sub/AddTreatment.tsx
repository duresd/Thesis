import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Treatment_Category } from '@prisma/client';
import Swal from 'sweetalert2';
import { fromPairs } from 'lodash';

interface FormData {
    Treatment_Category_Id: string;
    Treatment_Name: string;
}

interface Treatment {
    Treatment_Id: string;
    Treatment_Name: string;
    Treatment_Category_Id: string;
    Category: {
        Category_Id: string;
        Category_Name: string;
    }
}

const Basic = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Туслах цэс'));
    }, [dispatch]);

    const [treatment, setTreatment] = useState<Treatment[]>([]);
    const [categories, setCategories] = useState<Treatment_Category[]>([]);
    const [categ, setCateg] = useState<any[]>([]);


    const [formData, setFormData] = useState<FormData>({
        Treatment_Category_Id: '',
        Treatment_Name: '',
    });

    useEffect(() => {
        const fetchTreatment = async () => {
            try {
                const categoryResponse = await axios.get('/api/treatmentcategory/GetTreatmentCategory');
                setCategories(categoryResponse.data);

                const response = await axios.get('/api/treatment/GetTreatment');
                setTreatment(response.data);
                setCateg(response.data.Category.Category_Name)
            } catch (error) {
                console.error('Error fetching Treatments:', error);
            }
        };

        fetchTreatment();
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
            const response = await axios.post('/api/treatment/CreateTreatment', formData);
            console.log('Response:', response.data);
            showMessage('Эмчилгээ амжилттай нэмэгдлээ');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('Error adding category:', error);
        }
        // } catch (error) {
        //     console.error('Error:', error);
        // }
        // try {
        //     const response = await fetch('/api/treatment/CreateTreatment', formData{
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             Treatment_Name: name,
        //         }),
        //     });

        //     if (response.ok) {
        //         console.log('Category added successfully');
        //         showMessage('Эмчилгээ амжилттай нэмэгдлээ');
        //         setTimeout(() => {
        //             window.location.reload();
        //         }, 500);
        //     } else {
        //         console.error('Failed to add category');
        //     }
        // } catch (error) {
        //     console.error('Error adding category:', error);
        // }
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

    const [selectedTreatment, setSelectedTreatment] = useState<string[]>([]);

    const handleCheckboxChange = (treatmentId: string) => {
        setSelectedTreatment(prevSelected => {
            if (prevSelected.includes(treatmentId)) {
                return prevSelected.filter(id => id !== treatmentId);
            } else {
                return [...prevSelected, treatmentId];
            }
        });
    };

    const deleteSelectedCategories = async () => {
        try {
            await Promise.all(
                selectedTreatment.map(async (treatmentId) => {
                    await axios.delete(`/api/treatment/DeleteTreatment?id=${treatmentId}`);
                })
            );
            showMessage('Эмчилгээ амжилттай устгагдлаа');
            setTreatment(prevTreatments =>
                prevTreatments.filter(treat => !selectedTreatment.includes(treat.Treatment_Id))
            );
            setSelectedTreatment([]);
        } catch (error) {
            console.error('Error deleting categories:', error);
            showMessage('Эмчилгээ устгахад алдаа гарлаа', 'error');
        }
    };

    return (
        <div className="panel">
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Эмчилгээний төрөл</h5>
            </div>
            <div className="mb-5 flex space-x-5">
                <form className="space-y-5 w-2/3">
                    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                        <table className="table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 font-bold " >Эмчилгээний ангилал</th>
                                    <th className="px-4 py-2 font-bold">Эмчилгээний нэр</th>
                                    <th className="px-4 py-2 font-bold">Сонгох</th>
                                </tr>
                            </thead>
                            <tbody>
                                {treatment.map((treat) => (
                                    <tr key={treat.Treatment_Id} className="hover:bg-gray-200">
                                        <td className="border px-4 py-2">
                                            {treat.Category.Category_Name}
                                        </td>
                                        <td className="border px-4 py-2">{treat.Treatment_Name}</td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedTreatment.includes(treat.Treatment_Id)}
                                                onChange={() => handleCheckboxChange(treat.Treatment_Id)}
                                                className="mr-2"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button type="button" className="btn btn-danger !mt-6" onClick={deleteSelectedCategories}>
                        Устгах
                    </button>
                </form>
                <form className="space-y-5 w-1/3" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="categorySelect">Эмчилгээний ангилал сонгоно уу</label>
                        <select id="categorySelect" name="Treatment_Category_Id" value={formData.Treatment_Category_Id} onChange={handleChange} className="form-select text-sm">
                            <option value="" disabled defaultValue={'Сонгоно уу'}>Сонгоно уу</option>
                            {categories.map((category) => (
                                <option key={category.Category_Id} value={category.Category_Id}>
                                    {category.Category_Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="TreatmentName">Эмчилгээний нэр</label>
                        <input
                            id="TreatmentName"
                            type="text"
                            name='Treatment_Name'
                            placeholder="Эмчилгээний ангилалын нэр оруулна уу"
                            className="form-input"
                            value={formData.Treatment_Name}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary !mt-6">
                        Нэмэх
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Basic;
