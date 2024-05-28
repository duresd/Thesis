import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Treatment_Category } from '@prisma/client';
import Swal from 'sweetalert2';

const Basic = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Туслах цэс'));
    }, [dispatch]);

    const [category, setCategory] = useState<Treatment_Category[]>([]);
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get('/api/treatmentcategory/GetTreatmentCategory');
                setCategory(response.data);
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
            const response = await fetch('/api/treatmentcategory/CreateTreatmentCategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Category_Name: name,
                }),
            });

            if (response.ok) {
                console.log('Category added successfully');
                showMessage('Ангилал амжилттай нэмэгдлээ');
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

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleCheckboxChange = (categoryId: string) => {
        setSelectedCategories(prevSelected => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter(id => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    const deleteSelectedCategories = async () => {
        try {
            await Promise.all(
                selectedCategories.map(async (categoryId) => {
                    await axios.delete(`/api/treatmentcategory/DeleteTreatmentCategory?id=${categoryId}`);
                })
            );
            showMessage('Ангилал амжилттай устгагдлаа');
            setCategory(prevCategories =>
                prevCategories.filter(cat => !selectedCategories.includes(cat.Category_Id))
            );
            setSelectedCategories([]);
        } catch (error) {
            console.error('Error deleting categories:', error);
            showMessage('Ангиллыг устгахад алдаа гарлаа', 'error');
        }
    };

    return (
        <div className="panel">
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Эмчилгээний ангилал</h5>
            </div>
            <div className="mb-5 flex space-x-5">
                {/* <form className="space-y-5 w-1/2">
                    <div>
                        <ul id="categoryList" className="list-disc pl-5 max-h-64 overflow-y-auto">
                            {category.map((cat) => (
                                <li key={cat.Category_Id} className="text-m py-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.Category_Id)}
                                        onChange={() => handleCheckboxChange(cat.Category_Id)}
                                        className="mr-2"
                                    />
                                    {cat.Category_Name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button type="button" className="btn btn-danger !mt-6" onClick={deleteSelectedCategories}>
                        Устгах
                    </button>
                </form> */}
                <form className="space-y-5 w-2/3">
                    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                        <table className="table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 font-bold " >Эмчилгээний ангилалын нэр</th>
                                    <th className="px-4 py-2 font-bold">Сонгох</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.map((cat) => (
                                    <tr key={cat.Category_Id} className="hover:bg-gray-200">
                                        <td className="border px-4 py-2">{cat.Category_Name}</td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.Category_Id)}
                                                onChange={() => handleCheckboxChange(cat.Category_Id)}
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
                        <label htmlFor="groupLname2">Ангилалын нэр</label>
                        <input
                            id="groupLname2"
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
