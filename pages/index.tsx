import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../components/Dropdown';
import { setPageTitle } from '../store/themeConfigSlice';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import IconHorizontalDots from '@/components/Icon/IconHorizontalDots';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

interface Appointment {
    Appointment_Id: string;
    Startdate: string;
    Enddate: string;
    Doctor: { Doctor_Name: string };
    Patient: { Patient_Name: string, Phone_Num: string };
    Category: { Category_Name: string };
    Employee: { Employee_Name: string };
    Status: { Status_Name: string };
    Description: string;
    created_At: string;
}

const Index = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Dental'));
    }, [dispatch]);

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appointmentCounts, setAppointmentCounts] = useState<{ [key: string]: number }>({
        waiting: 0,
        cancelled: 0,
        done: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/appointment/WeeklyAppointment');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                if (data.appointments) {
                    const formattedAppointments = data.appointments.map((appointment: Appointment) => ({
                        ...appointment,
                        Startdate: new Date(appointment.Startdate).toLocaleString(),
                        Enddate: new Date(appointment.Enddate).toLocaleString(),
                    }));
                    setAppointments(formattedAppointments);
                }
                setLoading(false);
            } catch (err) {
                const errorObj = err as Error;
                setError('Error fetching appointments: ' + errorObj.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    //Revenue Chart
    const revenueChart: any = {
        series: [
            {
                name: 'Хүлээгдэж буй',
                data: [1680, 1680, 1550, 1780, 1550, 1700, 1900, 1600, 1500, 1200, 1850, 1900],
            },
            {
                name: 'Дууссан',
                data: [1650, 1750, 1620, 1730, 1600, 1950, 1650, 1700, 1600, 1900, 1800, 1570],
            },
            {
                name: 'Цуцалсан',
                data: [100, 90, 90, 80, 100, 50, 100, 150, 120, 100, 100, 140],
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A'] : ['#0638b8', '#0e8f15', '#e7515a'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#0e8f15',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 2,
                        dataPointIndex: 8,
                        fillColor: '#e7515a',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };

    //Sales By Category
    useEffect(() => {
        const counts: { [key: string]: number } = {
            waiting: 0,
            cancelled: 0,
            done: 0,
        };

        const statusMap: { [key: string]: string } = {
            "Хүлээгдэж буй": "waiting",
            "Цуцалсан": "cancelled",
            "Дууссан": "done"
        };

        appointments.forEach(appointment => {
            const statusKey = statusMap[appointment.Status.Status_Name];
            if (statusKey) {
                counts[statusKey]++;
            }
        });

        setAppointmentCounts(counts);
    }, [appointments]);

    // Sales By Category chart configuration
    const salesByCategory = {
        series: [appointmentCounts.waiting, appointmentCounts.cancelled, appointmentCounts.done],
        options: {
            chart: {
                type: 'donut' as const,
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: [isDark ? '#0e1726' : '#fff'],
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a'] : ['#0638b8', '#e7515a', '#0e8f15'],
            legend: {
                position: 'bottom' as const,
                horizontalAlign: 'center' as const,
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '20px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Хүлээгдэж буй', 'Цуцалсан', 'Дууссан'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };


    const getStatusClass = (statusName: string) => {
        switch (statusName) {
            case 'Хүлээгдэж буй':
                return 'bg-primary';
            case 'Цуцалсан':
                return 'bg-danger';
            case 'Дууссан':
                return 'bg-success'; // Tailwind JIT mode allows arbitrary values like this
            default:
                return 'bg-secondary';
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Хянах самбар
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Нүүр хуудас</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-6 grid gap-6 xl:grid-cols-3">
                    <div className="panel h-full xl:col-span-2">
                        <div className="mb-5 flex items-center justify-between dark:text-white-light">
                            <h5 className="text-lg font-semibold">Хийгдсэн эмчилгээ</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 1]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">Долоо хоног</button>
                                        </li>
                                        <li>
                                            <button type="button">Сар</button>
                                        </li>
                                        <li>
                                            <button type="button">Жил</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <p className="text-lg dark:text-white-light/90">
                            Нийт: <span className="ml-2 text-primary">840</span>
                        </p>
                        <div className="relative">
                            <div className="rounded-lg bg-white dark:bg-black">
                                {isMounted ? (
                                    <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} width={'100%'} />
                                ) : (
                                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full">
                        <div className="mb-5 flex items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Цаг захиалгын төлөв</h5>
                        </div>
                        <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                                {isMounted ? (
                                    <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                                ) : (
                                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                    <div className="panel h-full w-full">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Дөхөж буй эмчилгээний цагууд</h5>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Өвчтөний нэр</th>
                                        <th>Утасны дугаар</th>
                                        <th>Эмчийн нэр</th>
                                        <th>Эхлэх цаг</th>
                                        <th>Дуусах цаг</th>
                                        <th className="ltr:rounded-r-md rtl:rounded-l-md">Төлөв</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(appointment => (
                                        <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90" key={appointment.Appointment_Id}>
                                            <td className="min-w-[150px] text-black dark:text-white">
                                                <div className="flex items-center">
                                                    {appointment.Patient.Patient_Name}
                                                </div>
                                            </td>
                                            <td>{appointment.Patient.Phone_Num}</td>
                                            <td>{appointment.Doctor.Doctor_Name}</td>
                                            <td>{appointment.Startdate}</td>
                                            <td>{appointment.Enddate}</td>
                                            <td>
                                                <span className={`badge shadow-md dark:group-hover:bg-transparent ${getStatusClass(appointment.Status.Status_Name)}`}>
                                                    {appointment.Status.Status_Name}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!appointments.length && <div className="text-center py-5">No upcoming appointments</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
