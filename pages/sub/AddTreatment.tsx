import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Treatment } from '@prisma/client';
import Swal from 'sweetalert2';

const Basic = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Туслах цэс'));
    }, [dispatch]);

    const [treatment, setTreatment] = useState<Treatment[]>([]);
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get('/api/treatment/GetTreatment');
                setTreatment(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategory();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted:', name);

        try {
            const response = await fetch('/api/treatment/CreateTreatment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Treatment_Name: name,
                }),
            });

            if (response.ok) {
                console.log('Category added successfully');
                showMessage('Эмчилгээ амжилттай нэмэгдлээ');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                console.error('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
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
                <h5 className="text-lg font-semibold dark:text-white-light">Эмчилгээний ангилал</h5>
            </div>
            <div className="mb-5 flex space-x-5">
                <form className="space-y-5 w-1/2">
                    <div>
                        <ul id="categoryList" className="list-disc pl-5 max-h-64 overflow-y-auto">
                            {treatment.map((treat) => (
                                <li key={treat.Treatment_Name} className="text-m py-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedTreatment.includes(treat.Treatment_Id)}
                                        onChange={() => handleCheckboxChange(treat.Treatment_Id)}
                                        className="mr-2"
                                    />
                                    {treat.Treatment_Name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button type="button" className="btn btn-danger !mt-6" onClick={deleteSelectedCategories}>
                        Устгах
                    </button>
                </form>
                <form className="space-y-5 w-1/2" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="CategoryName">Ангилалын нэр</label>
                        <input
                            id="CategoryName"
                            type="text"
                            placeholder="Эмчилгээний ангилалын нэр оруулна уу"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="TreatmentName">Эмчилгээний нэр</label>
                        <input
                            id="TreatmentName"
                            type="text"
                            placeholder="Эмчилгээний ангилалын нэр оруулна уу"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
