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

interface Doctor {
    Doctor_id: string;
    Doctor_Name: string;
    Profession: {
        Profession_Name: string;
    };
    Doctor_Rnum: string;
    Doctor_Pnum: string;
    Gender: string;
    Role: string;
}

const List = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Эмч, мэргэжилтэн'));
    });

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'Doctor_Name',
        direction: 'asc',
    });
    const [selectedRecords, setSelectedRecords] = useState<Doctor[]>([]);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/doctor/GetDoctorList');
                if (!response.ok) {
                    throw new Error('Failed to fetch doctor data');
                }
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = doctors.filter((doctor) =>
            doctor.Doctor_Name.toLowerCase().includes(search.toLowerCase()) ||
            doctor.Doctor_Pnum.toLowerCase().includes(search.toLowerCase()) ||
            doctor.Gender.toLowerCase().includes(search.toLowerCase()) ||
            doctor.Profession.Profession_Name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredDoctors(filtered);
    }, [doctors, search]);

    useEffect(() => {
        const sortedDoctors = sortBy(filteredDoctors, sortStatus.columnAccessor);
        setFilteredDoctors(sortStatus.direction === 'asc' ? sortedDoctors : sortedDoctors.reverse());
    }, [sortStatus, filteredDoctors]);

    const handleEditPatient = (Doctor_id: string) => {
        router.push(`/users/?id=${Doctor_id}`);
    };

    const handleViewPatient = (Doctor_id: string) => {
        router.push(`/users/doctorProfile?id=${Doctor_id}`);
    };

    const deleteRow = async (id: string | null = null) => {
        if (window.confirm('Are you sure you want to delete the selected row(s)?')) {
            if (id) {
                await handleDeleteDoctor(id);
            } else {
                for (const doctor of selectedRecords) {
                    await handleDeleteDoctor(doctor.Doctor_id);
                }
            }
        }
    };

    const handleDeleteDoctor = async (id: string) => {
        try {
            const response = await fetch(`/api/doctor/DeleteDoctor?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Refresh doctors list or remove deleted doctor from the list
                showMessage('Эмч амжилттай устгагдлаа');
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

    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
                    <div className="flex items-center gap-2">
                        <button type="button" className="btn btn-danger gap-2" onClick={() => deleteRow(null)}>
                            <IconTrashLines />
                            Устгах
                        </button>
                        <Link href="/apps/invoice/DoctorAdd" className="btn btn-primary gap-2">
                            <IconPlus />
                            Шинэ эмч нэмэх
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
                        records={filteredDoctors}
                        columns={[
                            {
                                accessor: 'Doctor_Name',
                                title: 'Овог, нэр',
                                sortable: true,
                                render: ({ Doctor_Name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{Doctor_Name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Profession.Profession_Name',
                                title: 'Мэргэшлийн нэр',
                                sortable: true,
                                titleClassName: 'text-left',
                            },
                            {
                                accessor: 'Doctor_Pnum',
                                title: 'Утасны дугаар',
                                sortable: true,
                            },
                            {
                                accessor: 'Gender',
                                title: 'Хүйс',
                                sortable: true,
                            },
                            {
                                accessor: 'action',
                                title: 'Үйлдлүүд',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ Doctor_id }) => (
                                    <div className="mx-auto flex w-max items-center gap-4">
                                        <Link
                                            href="/users/doctorProfile"
                                            className="flex hover:text-primary"
                                            onClick={() => handleViewPatient(Doctor_id)}
                                        >
                                            <IconEye />
                                        </Link>
                                        <Link
                                            href="/users/user-account-settings"
                                            className="flex hover:text-info"
                                            onClick={() => handleEditPatient(Doctor_id)}
                                        >
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </Link>
                                        <button
                                            type="button"
                                            className="flex hover:text-danger"
                                            onClick={() => handleDeleteDoctor(Doctor_id)}
                                        >
                                            <IconTrashLines />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={filteredDoctors.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
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

