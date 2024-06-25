import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import IconMenuComponents from '@/components/Icon/Menu/IconMenuComponents';
import IconFile from '@/components/Icon/IconFile';
import { downloadExcel } from 'react-export-table-to-excel';
import dayjs from 'dayjs';

interface Appointment {
    Appointment_Id: string;
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
    Status: {
        Status_Name: string;
    };
    Description: string;
    created_At: string;
}

const Export = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Тайлан'));
    }, [dispatch]);

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'Startdate',
        direction: 'asc',
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('/api/appointment/GetAppointmentList');
                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const data = await response.json();
                const formattedAppointments: Appointment[] = data.appointments.map((appointment: Appointment) => ({
                    ...appointment,
                    Startdate: dayjs(appointment.Startdate).format('YYYY-MM-DD HH:mm'),
                    Enddate: dayjs(appointment.Enddate).format('YYYY-MM-DD HH:mm'),
                    created_At: dayjs(appointment.created_At).format('YYYY-MM-DD HH:mm'),
                }));
                setAppointments(formattedAppointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleDownloadExcel = () => {
        const exportData = selectedRows.size > 0
            ? appointments.filter(appointment => selectedRows.has(appointment.Appointment_Id))
            : appointments;

        const excelData = exportData.map((appointment) => ({
            'Patient Name': appointment.Patient.Patient_Name,
            'Category Name': appointment.Category.Category_Name,
            'Doctor Name': appointment.Doctor.Doctor_Name,
            'Start Date': appointment.Startdate,
            'End Date': appointment.Enddate,
            'Status Name': appointment.Status.Status_Name,
            'Description': appointment.Description,
        }));

        downloadExcel({
            fileName: 'appointments',
            sheet: 'Appointments',
            tablePayload: {
                header: ['Patient Name', 'Category Name', 'Doctor Name', 'Start Date', 'End Date', 'Status Name', 'Description'],
                body: excelData,
            },
        });
    };

    const exportTable = (type: 'csv') => {
        const exportData = selectedRows.size > 0
            ? appointments.filter(appointment => selectedRows.has(appointment.Appointment_Id))
            : appointments;

        if (type === 'csv') {
            const csvData = exportData.map(appointment => [
                appointment.Patient.Patient_Name,
                appointment.Category.Category_Name,
                appointment.Doctor.Doctor_Name,
                appointment.Startdate,
                appointment.Enddate,
                appointment.Status.Status_Name,
                appointment.Description,
            ].join(','));

            const csvContent = [
                ['Patient Name', 'Category Name', 'Doctor Name', 'Start Date', 'End Date', 'Status Name', 'Description'].join(','), // Header row
                ...csvData,
            ].join('\n'); // Newline separator

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'appointments.csv';
            link.click();
        }
    };

    const capitalize = (text: string) => {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const toggleRowSelection = (id: string) => {
        setSelectedRows(prevSelectedRows => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (newSelectedRows.has(id)) {
                newSelectedRows.delete(id);
            } else {
                newSelectedRows.add(id);
            }
            return newSelectedRows;
        });
    };

    // Filter appointments based on search query
    const filteredAppointments = appointments.filter(appointment => {
        const searchString = search.toLowerCase();
        return Object.values(appointment).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchString)
        );
    });

    return (
        <div>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconMenuComponents />
                </div>
                <span className="ltr:mr-5 rtl:ml-5">Тайлан: </span>
                <a> Үйл ажиллагааны тайлан </a>
            </div>
            <div className="panel mt-6">
                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex flex-wrap items-center">
                        <button type="button" onClick={() => exportTable('csv')} className="btn btn-primary btn-sm m-1">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            CSV
                        </button>
                        <button type="button" onClick={handleDownloadExcel} className="btn btn-primary btn-sm m-1">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            EXCEL
                        </button>
                    </div>
                    <input
                        type="text"
                        className="form-input w-auto"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div>
                    <DataTable
                        highlightOnHover
                        records={filteredAppointments}
                        columns={[
                            {
                                accessor: 'select',
                                title: (
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedRows(new Set(filteredAppointments.map(a => a.Appointment_Id)));
                                            } else {
                                                setSelectedRows(new Set());
                                            }
                                        }}
                                        checked={selectedRows.size === filteredAppointments.length}
                                    />
                                ),
                                render: (record) => (
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(record.Appointment_Id)}
                                        onChange={() => toggleRowSelection(record.Appointment_Id)}
                                    />
                                ),
                            },
                            { accessor: 'Patient.Patient_Name', title: 'Өвчтөн', sortable: true },
                            { accessor: 'Category.Category_Name', title: 'Эмчилгээний ангилал', sortable: true },
                            { accessor: 'Doctor.Doctor_Name', title: 'Эмчийн нэр', sortable: true },
                            { accessor: 'Startdate', title: 'Эхэлсэн цаг', sortable: true },
                            { accessor: 'Enddate', title: 'Дууссан цаг', sortable: true },
                            { accessor: 'Status.Status_Name', title: 'Цаг захиалгын төлөв', sortable: true },
                            { accessor: 'Description', title: 'Эмчилгээний дэлгэрэнгүй тайлбар', sortable: true },
                            { accessor: 'Employee.Employee_Name', title: 'Цаг захиалга бүртгэсэн ажилтан', sortable: true },
                            { accessor: 'created_At', title: 'Цаг захиалга үүсгэгдсэн огноо', sortable: true },
                        ]}
                        totalRecords={filteredAppointments.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                    />
                </div>
            </div>
        </div>
    );
};

export default Export;
