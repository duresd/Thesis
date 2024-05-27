import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPlus from '@/components/Icon/IconPlus';
import IconX from '@/components/Icon/IconX';
import listPlugin from '@fullcalendar/list';
import { useTanuContext } from '../context/state';

// Define TypeScript types
interface Artist {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    __v: number;
}

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    currentTime: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Customer {
    _id: string;
    phone: string;
    createdAt: string;
    __v: number;
}

interface Event {
    _id: string;
    Artist: any;
    Service: any;
    Customer: Customer;
    status: boolean;
    start: string;
    end: string;
    className: string;
    __v: number;
}

interface CalendarEvent {
    id: string | number;
    title: string;
    start: string;
    end: string;
    description: string;
    className: string;
}
interface CalendarProps {
    artist: any;
    service: any;
}

const Calendar: FunctionComponent<CalendarProps> = ({ artist, service }) => {
    const dispatch = useDispatch();
    const { companyCalendar, getCalendarSearch, searchCalendar } = useTanuContext();

    const [events, setEvents] = useState<any[]>([]);
    const [isAddEventModal, setIsAddEventModal] = useState(false);
    const [minStartDate, setMinStartDate] = useState<string>('');
    const [minEndDate, setMinEndDate] = useState<string>('');
    const defaultParams = {
        id: null,
        title: '',
        start: '',
        end: '',
        description: '',
        type: 'primary',
        customerPhone: '',
    };
    const [params, setParams] = useState<any>(defaultParams);

    useEffect(() => {
        dispatch(setPageTitle('Calendar'));
        if (companyCalendar.length) {
            setEvents(
                companyCalendar.map((event: any) => ({
                    id: event._id,
                    title: ${event.Artist.name} ,
                    start: event.start,
                    end: event.end,
                    description: ${event.Service.description},
                    className: event.className,
                    customerPhone: event.Customer.phone,
                }))
            );
        }
    }, [companyCalendar, dispatch]);

    useEffect(() => {
        if (searchCalendar.length) {
            setEvents(
                searchCalendar.map((event: any) => ({
                    id: event._id,
                    title: ${event.Artist.name},
                    start: event.start,
                    end: event.end,
                    description: ${event.Service.description},
                    className: event.className,
                    customerPhone: event.Customer.phone,
                }))
            );
        }
    }, [searchCalendar]);

    const dateFormat = (dt: any) => {
        dt = new Date(dt);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
        const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
        return ${dt.getFullYear()}-${month}-${date}T${hours}:${mins};
    };

    const editEvent = (data: any = null) => {
        let params = { ...defaultParams };
        if (data) {
            let obj = data.event;
            setParams({
                id: obj.id,
                title: obj.title,
                customerPhone: obj.extendedProps?.customerPhone,
                start: dateFormat(obj.start),
                end: dateFormat(obj.end),
                type: obj.classNames[0] || 'primary',
                description: obj.extendedProps?.description || '',
            });
            setMinStartDate(new Date().toISOString().slice(0, 16));
            setMinEndDate(dateFormat(obj.start));
        } else {
            setMinStartDate(new Date().toISOString().slice(0, 16));
            setMinEndDate(new Date().toISOString().slice(0, 16));
        }
        setIsAddEventModal(true);
    };

    const editDate = (data: any) => {
        let obj = {
            event: {
                start: data.start,
                end: data.end,
            },
        };
        editEvent(obj);
    };

    const startDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const dateStr = event.target.value;
        if (dateStr) {
            setMinEndDate(dateStr);
            setParams({ ...params, start: dateStr, end: '' });
        }
    };

    const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setParams({ ...params, [id]: value });
    };

    return (
        <div>
            <div className="panel mb-5">
                <div className="mb-4 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                        <div className="text-center text-lg font-semibold ltr:sm:text-left rtl:sm:text-right">Calendar</div>
                        <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start">
                            <div className="flex items-center ltr:mr-4 rtl:ml-4">
                                <div className="h-2.5 w-2.5 rounded-sm bg-primary ltr:mr-2 rtl:ml-2"></div>
                                <div>Цаг авсан</div>
                            </div>

                            <div className="flex items-center ltr:mr-4 rtl:ml-4">
                                <div className="h-2.5 w-2.5 rounded-sm bg-success ltr:mr-2 rtl:ml-2"></div>
                                <div> Үйлчилгээ авсан</div>
                            </div>
                            <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-sm bg-danger ltr:mr-2 rtl:ml-2"></div>
                                <div>Цагтаа ирээгүй</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="calendar-wrapper">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]} // Include the list plugin
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today', // Add list views to the left navigation
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay', // Add list views to the right navigation
                        }}
                        editable={true}
                        dayMaxEvents={true}
                        selectable={true}
                        droppable={true}
                        eventClick={(event: any) => editEvent(event)}
                        select={(event: any) => editDate(event)}
                        events={events}
                    />
                </div>
            </div>

            {/* add event modal */}
            <Transition appear show={isAddEventModal} as={Fragment}>
                <Dialog as="div" onClose={() => setIsAddEventModal(false)} open={isAddEventModal} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel my-8 w-[90%] max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button type="button" onClick={() => setIsAddEventModal(false)} className="absolute top-4 text-gray-400 ltr:right-4 rtl:left-4">
                                        <IconX className="h-8 w-8" />
                                    </button>
                                    <div className="p-5">
                                        <h4 className="mb-8 text-lg font-semibold">{params.id ? 'Үйлчилгээний ' : 'Add'} дэлгэрэнгүй </h4>
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="title">Ажилтан</label>
                                                <input id="title" type="text" className="form-input" value={params.title} onChange={changeValue} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="customerPhone">Үйлчлүүлэгчийн дугаар:</label>
                                                <input id="customerPhone" type="text" className="form-input" value={params.customerPhone} onChange={changeValue} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="start">Цаг авсан огноо</label>
                                                <input id="start" type="datetime-local" className="form-input" value={params.start} onChange={startDateChange} min={minStartDate} />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="flex justify-end border-t p-5">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setIsAddEventModal(false)}>
                                            Хаах
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Calendar;
obj.id