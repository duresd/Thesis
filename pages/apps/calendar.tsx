import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import Link from 'next/link';
import IconPlus from '@/components/Icon/IconPlus';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

interface Appointment {
    Appointment_Id: number;
    Startdate: string;
    Enddate: string;
    Doctor: {
        Doctor_Name: string;
    };
    Patient: {
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

const Calendar: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch appointments from your API
        const fetchAppointments = async () => {
            try {
                const response = await fetch('/api/appointment/FutureAppointment');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Data from API:', data); // Check the structure of the API response
                    if (Array.isArray(data)) {
                        console.log('Appointments:', data); // Check the appointments array
                        setAppointments(data);
                    } else {
                        throw new Error('Appointments data is not an array');
                    }
                } else {
                    throw new Error('Failed to fetch appointments');
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    const getStatusColor = (statusName: string) => {
        switch (statusName) {
            case 'Хүлээгдэж буй':
                return '#0d6efd'; // Primary color
            case 'Цуцалсан':
                return 'gray'; // Danger color
            case 'Дууссан':
                return '#198754'; // Custom success color
            default:
                return 'gray #7939AC'; // Default color
        }
    };

    const editEvent = async (AppointmentID: any) => {
        router.push(`/apps/UpdateAppointment?id=${AppointmentID}`);
        // Handle success
    };



    const events: EventInput[] = appointments.map((appointment) => {

        return {
            id: String(appointment.Appointment_Id),
            title: ` ${appointment.Doctor.Doctor_Name} - ${appointment.Patient.Patient_Name}`,
            start: appointment.Startdate,
            end: appointment.Enddate,
            extendedProps: {
                status: appointment.Status.Status_Name,
            },
        };
    });

    return (
        <div>
            <div className="panel mb-5">
                <div className="mb-4 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                        <div className="text-center text-lg font-semibold ltr:sm:text-left rtl:sm:text-right">Цагийн хуваарь</div>
                        <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start">
                            <div className="flex items-center ltr:mr-4 rtl:ml-4">
                                <div className="h-2.5 w-2.5 rounded-sm bg-primary ltr:mr-2 rtl:ml-2"></div>
                                <div>Хүлээгдэж буй</div>
                            </div>
                            <div className="flex items-center ltr:mr-4 rtl:ml-4">
                                <div className="h-2.5 w-2.5 rounded-sm bg-success ltr:mr-2 rtl:ml-2"></div>
                                <div>Дууссан</div>
                            </div>
                            <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-sm bg-gray-600 ltr:mr-2 rtl:ml-2"></div>
                                <div>Цуцалсан</div>
                            </div>
                        </div>
                    </div>
                    <Link href="/apps/AddAppointment" className="btn btn-primary gap-2">
                        <IconPlus />
                        Цаг захиалга нэмэх
                    </Link>
                </div>
                <div className="calendar-wrapper">
                    <FullCalendar
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        dayMaxEvents={true}
                        droppable={true}
                        events={events}
                        eventDidMount={(info) => {
                            const status = info.event.extendedProps.status as string;
                            const color = getStatusColor(status);
                            info.el.style.backgroundColor = color;
                        }}
                        eventClick={(info) => editEvent((info.event.id))}
                    />
                </div>
            </div>
        </div>
    );
};

export default Calendar;
