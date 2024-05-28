import Link from 'next/link';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconPlus from '@/components/Icon/IconPlus';
import IconEdit from '@/components/Icon/IconEdit';
import IconEye from '@/components/Icon/IconEye';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

interface Patient {
    Patient_id: string;
    Patient_Name: string;
    Regis_Num: string;
    Gender: string;
    Phone_Num: string;
    Emerg_Name: string;
    Emerg_PNum: string;
    appointment: { Startdate: string }[];
}

const List = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Өвчтөнүүд'));
    }, [dispatch]);

    const [patients, setPatients] = useState<Patient[]>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<Patient[]>([]);
    const [records, setRecords] = useState<Patient[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'Patient_Name',
        direction: 'asc',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/patient/GetPatientlist');
                if (!response.ok) {
                    throw new Error('Failed to fetch patient data');
                }
                const data = await response.json();
                setPatients(data);
                setInitialRecords(data);
                setRecords(data.slice(0, pageSize));
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const filteredPatients = patients.filter((patient) => {
            return (
                patient.Patient_Name.toLowerCase().includes(search.toLowerCase()) ||
                patient.Regis_Num.toLowerCase().includes(search.toLowerCase()) ||
                patient.Phone_Num.toLowerCase().includes(search.toLowerCase()) ||
                patient.Gender.toLowerCase().includes(search.toLowerCase()) ||
                patient.Emerg_PNum.toLowerCase().includes(search.toLowerCase())
            );
        });
        setInitialRecords(filteredPatients);
    }, [search, patients]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const sortedData = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData);
    }, [sortStatus, initialRecords]);

    const handleDeleteDoctor = async (id: string) => {
        try {
            const response = await fetch(`/api/patient/DeletePatient?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Refresh doctors list or remove deleted doctor from the list
                showMessage('Өвчтөн амжилттай устгагдлаа');
            } else {
                // Handle error
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
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


    const handleEditPatient = (patientId: string) => {
        router.push(`/users/user-account-settings?id=${patientId}`);
    };

    const handleViewPatient = (patientId: string) => {
        router.push(`/users/profile?id=${patientId}`);
    };

    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
                    <div className="flex items-center gap-2">
                        <button type="button" className="btn btn-danger gap-2" >
                            <IconTrashLines />
                            Устгах
                        </button>
                        <Link href="/apps/invoice/PatientAdd" className="btn btn-primary gap-2">
                            <IconPlus />
                            Шинэ өвчтөн нэмэх
                        </Link>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="datatables pagination-padding">
                    <DataTable
                        className="table-hover whitespace-nowrap"
                        idAccessor="Patient_id"
                        records={records}
                        columns={[
                            { accessor: 'Patient_Name', title: 'Овог, Нэр', sortable: true },
                            { accessor: 'Regis_Num', title: 'Регистрийн дугаар', sortable: true },
                            { accessor: 'Phone_Num', title: 'Утасны дугаар', sortable: true },
                            { accessor: 'Gender', title: 'Хүйс', sortable: true },
                            {
                                accessor: 'appointment.Startdate',
                                title: 'Захиалсан цаг',
                                sortable: true,
                                render: ({ appointment }) => {
                                    const earliestAppointment = appointment.length ? new Date(Math.min(...appointment.map(a => new Date(a.Startdate).getTime()))) : null;
                                    return earliestAppointment ? earliestAppointment.toLocaleString() : 'Захиалсан цаг байхгүй байна';
                                },
                            },
                            {
                                accessor: 'action',
                                title: 'Үйлдлүүд',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ Patient_id }) => (
                                    <div className="mx-auto flex w-max items-center gap-4">
                                        <Link href="#" className="flex hover:text-info" onClick={() => handleEditPatient(Patient_id)}>
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </Link>
                                        <Link href="#" className="flex hover:text-primary" onClick={() => handleViewPatient(Patient_id)}>
                                            <IconEye />
                                        </Link>
                                        <button type="button" className="flex hover:text-danger" onClick={() => handleDeleteDoctor(Patient_id)}>
                                            <IconTrashLines />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default List;
