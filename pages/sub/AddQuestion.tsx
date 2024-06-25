import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Questions, Treatment_Category } from '@prisma/client';
import Swal from 'sweetalert2';

const Basic = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Туслах цэс'));
    }, [dispatch]);

    const [category, setCategory] = useState<Questions[]>([]);
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get('/api/questions/GetQuestions');
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
            const response = await fetch('/api/questions/CreateQuestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Question: name,
                }),
            });

            if (response.ok) {
                console.log('Category added successfully');
                showMessage('Асуулт амжилттай нэмэгдлээ');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                console.error('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding question:', error);
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

    const handleCheckboxChange = (QuestionID: string) => {
        setSelectedCategories(prevSelected => {
            if (prevSelected.includes(QuestionID)) {
                return prevSelected.filter(id => id !== QuestionID);
            } else {
                return [...prevSelected, QuestionID];
            }
        });
    };

    const deleteSelectedCategories = async () => {
        try {
            await Promise.all(
                selectedCategories.map(async (QuestionID) => {
                    await axios.delete(`/api/questions/DeleteQuestion?id=${QuestionID}`);
                })
            );
            showMessage('Ангилал амжилттай устгагдлаа');
            setCategory(prevCategories =>
                prevCategories.filter(cat => !selectedCategories.includes(cat.Question_ID))
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
                <h5 className="text-lg font-semibold dark:text-white-light"> Асуултууд</h5>
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
                                    <th className="px-4 py-2 font-bold " >Эрүүл мэндийн асуулгын асуултууд</th>
                                    <th className="px-4 py-2 font-bold">Сонгох</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.map((cat) => (
                                    <tr key={cat.Question_ID} className="hover:bg-gray-200">
                                        <td className="border px-4 py-2">{cat.Question}</td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.Question_ID)}
                                                onChange={() => handleCheckboxChange(cat.Question_ID)}
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
                        <label htmlFor="groupLname2">Асуулт</label>
                        <input
                            id="groupLname2"
                            type="text"
                            placeholder="Асуулт оруулна уу"
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
