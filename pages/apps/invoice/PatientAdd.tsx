import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconBack from '@/components/Icon/IconEdit';

const Add = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Өвчтөн нэмэх'));
    });
    const router = useRouter();
    const [name, setName] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const response = await fetch('/api/patient/CreatePatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Patient_Name: name,
                    Regis_Num: regNumber,
                    Gender: gender,
                    Phone_Num: phoneNumber,
                    Emerg_Name: emergencyName,
                    Emerg_PNum: emergencyPhoneNumber,
                }),
            });

            if (response.ok) {
                // Handle success (e.g., show a success message)
                console.log('Patient added successfully');
                toast.success('Patient added successfully');
                router.push('/apps/invoice/PatientList');
            } else {
                // Handle errors (e.g., show an error message)
                console.error('Failed to add patient');
            }
        } catch (error) {
            console.error('Error adding patient:', error);
        }
    };




    useEffect(() => {
        // Script logic for handling popup form and "More" button
        const popupForm = document.getElementById('popupForm');
        const moreButton = document.getElementById('moreButton');
        const closePopupButton = document.getElementById('closePopup');
    
        if (moreButton && popupForm && closePopupButton) {
            const showPopupForm = () => {
                popupForm.classList.remove('hidden');
            };
    
            const hidePopupForm = () => {
                popupForm.classList.add('hidden');
            };
    
            moreButton.addEventListener('click', showPopupForm);
            closePopupButton.addEventListener('click', hidePopupForm);
        }
    }, []);
    return (
        <>
            <Link href="/apps/invoice/PatientList">
                <button type="button" className="btn btn-primary !mt-6 mr-2 mb-5">
                    <IconArrowBackward></IconArrowBackward>
                </button>
            </Link>
        <div className="panel" id="forms_grid">
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Өвчтөний хувийн мэдээлэл</h5>
                <button type="button" id="moreButton" className="btn btn-primary !mt-6 ">Эрүүл мэндийн асуулга</button>
            </div>
            <div className="mb-5">
                <form className="space-y-5" onSubmit={handleSubmit} >
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="gridName">Овог, нэр</label>
                            <input id="gridName" type="text" placeholder="Овог, нэр оруулна уу" className="form-input" value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="gridRnumber">Регистрийн дугаар</label>
                            <input id="gridRnumber" type="text" placeholder="Регистрийн дугаар оруулна уу" className="form-input" value={regNumber} onChange={(e) => setRegNumber(e.target.value)}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="gridPnumber">Утасны дугаар</label>
                            <input id="gridPnumber" type="text" placeholder="Утасны дугаар оруулна уу"  className="form-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                        </div>
                        <div >
                        <label htmlFor="gridGender">Хүйс</label>
                        <input id="gridMale" type="radio" name="gender" value="Эрэгтэй" className="form-radio mr-2"  onChange={(e) => setGender(e.target.value)}defaultChecked />
                        <span className="text-dark mr-4">Эрэгтэй</span>
                        <input id="gridFemale" type="radio" name="gender" value="Эмэгтэй" className="form-radio mr-2 ml-4"  onChange={(e) => setGender(e.target.value)}/>
                        <span className="text-dark">Эмэгтэй</span>
                    </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="gridRName">Шаардлагатай үед холбоо барих хүний нэр</label>
                            <input id="gridRName" type="text" placeholder="Овог, нэр оруулна уу" className="form-input" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="gridRPnumber">Шаардлагатай үед холбоо барих хүний утас</label>
                            <input id="gridRPnumber" type="text" placeholder="Утасны дугаар оруулна уу" className="form-input" value={emergencyPhoneNumber} onChange={(e) => setEmergencyPhoneNumber(e.target.value)}/>
                        </div>
                    </div>
                    
                    <button type="submit"  className="btn btn-primary !mt-6">
                        Бүртгэх
                    </button>
                </form>
            </div>
            {/* <div id="popupForm" className="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-base font-semibold mb-2">Өвтөний эрүүл мэндийн богино асуулга</h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                            <label htmlFor="Qnum1">Эмийн бодис, ургамал, хоол хүнсэнд харшилтай эсэх?</label>
                            <input id="Qnum1" type="text" placeholder="Хариултаа бичнэ үү" className="form-input text-sm" />
                        </div>
                        <div>
                            <label htmlFor="Qnum2">Удаан хугацаанд ууж байгаа эм бэлдмэл байгаа эсэх?</label>
                            <input id="Qnum2" type="text" placeholder="Хариултаа бичнэ үү" className="form-input text-sm" />
                        </div>
                        <div>
                            <label htmlFor="Qnum3">Цусны даралт ихсэх багасах хэм / СД-120с бага, ДД-80с бага</label>
                            <input id="Qnum3" type="text" placeholder="Хариултаа бичнэ үү" className="form-input text-sm"  />
                        </div>
                        <div>
                            <label htmlFor="Qnum4">Цус багадалттай эсэх?</label>
                            <select id="Qnum4" className="form-select text-sm">
                                <option value="yes">Тийм</option>
                                <option value="no">Үгүй</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="Qnum5">Гепатит / Элэгний вирус /?</label>
                            <select id="Qnum5" className="form-select text-sm">
                                <option value="yes">Тийм</option>
                                <option value="no">Үгүй</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="Qnum6">Уналт, таталт өгдөг эсэх?</label>
                            <select id="Qnum6" className="form-select text-sm">
                                <option value="yes">Тийм</option>
                                <option value="no">Үгүй</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="Qnum8">Бөөр шээс дамжуулах замын өвчинтэй эсэх? </label>
                            <select id="Qnum8" className="form-select text-sm">
                                <option value="1">Ангина</option>
                                <option value="2">Астма</option>
                                <option value="3">Чихрийн шижин</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="Qnum8">Хооллолтын байдал  </label>
                            <select id="Qnum8" className="form-select text-sm">
                                <option value="1">Цагаан хоолтон</option>
                                <option value="2">Ердийн</option>
                                <option value="3">Нэмэлт тэжээл хэрэглэдэг</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="Qnum8">Сүүлийн 6 сар ямар нэг мэс засал, туяа, химийн эмчилгээ хийлгэсэн эсэх?</label>
                            <select id="Qnum8" className="form-select text-sm">
                            <option value="yes">Тийм</option>
                                <option value="no">Үгүй</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="Qnum8">Ажил хөдөлмөрийн нөхцөл </label>
                            <select id="Qnum8" className="form-select text-sm">
                                <option value="1">Ердийн</option>
                                <option value="2">Хүнд</option>
                                <option value="3">Хортой</option>
                                <option value="4">Бусад</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="Qnum8">Та жирэмсэн үү? / Хэрэв тийм бол хэдэн сартай вэ? /</label>
                            <input id="Qnum3" type="text" placeholder="Хариултаа бичнэ үү" className="form-input text-sm" />
                        </div>
                        <div>
                            <label htmlFor="Qnum8">Та тамхи татдаг уу? / Хэрэв тийм бол хэдэн жил татаж байгаа вэ? /</label>
                            <input id="Qnum3" type="text" placeholder="Хариултаа бичнэ үү" className="form-input text-sm" />
                        </div>
                        <div>
                            <label htmlFor="Qnum8">Хамгийн сүүлд хэзээ шүдний эмнэлэгт үзүүлсэн бэ?</label>
                            <input id="Qnum3" type="text" placeholder="Хариултаа бичнэ үү" className="form-input text-sm" />
                        </div>
                    </div>
                    <div className="mb-2"></div>
                    <button id="closePopup" className="btn btn-primary">Хадгалах</button>
                </div>
            </div> */}
        </div>
        </>
    );
};
export default Add;
