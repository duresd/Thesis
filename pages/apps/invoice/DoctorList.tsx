import Link from 'next/link';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconPlus from '@/components/Icon/IconPlus';
import IconEdit from '@/components/Icon/IconEdit';
import IconEye from '@/components/Icon/IconEye';
import { string } from 'yup/lib/locale';

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
    useEffect(() => {
        dispatch(setPageTitle('Эмч, мэргэжилтэн'));
    });


    const [doctor, setDoctors] = useState<Doctor[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/doctor/GetDoctorList');

                if (!response.ok) {
                    throw new Error('Failed to fetch doctor data');
                }
                const data = await response.json();
                setRecords(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(doctor, 'invoice'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return doctor.filter((doctor) => {
                return (
                    doctor.Doctor_Name.toLowerCase().includes(search.toLowerCase()) ||
                    doctor.Doctor_Pnum.toLowerCase().includes(search.toLowerCase()) ||
                    doctor.Gender.toLowerCase().includes(search.toLowerCase()) ||
                    doctor.Profession.Profession_Name.toLowerCase().includes(search.toLowerCase()) 
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

    const deleteRow = (id: any = null) => {
        if (window.confirm('Are you sure want to delete selected row ?')) {
            if (id) {
                setRecords(doctor.filter((doctor) => doctor.Doctor_id !== id));
                setInitialRecords(doctor.filter((doctor) => doctor.Doctor_id !== id));
                setDoctors(doctor.filter((doctor) => doctor.Doctor_id !== id));
                setSelectedRecords([]);
                setSearch('');
            } else {
                let selectedRows = selectedRecords || [];
                const ids = selectedRows.map((d: any) => {
                    return d.id;
                });
                const result = doctor.filter((d) => !ids.includes(d.Doctor_id as never));
                setRecords(result);
                setInitialRecords(result);
                setDoctors(result);
                setSelectedRecords([]);
                setSearch('');
                setPage(1);
            }
        }
    };

    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
                    <div className="flex items-center gap-2">
                        <button type="button" className="btn btn-danger gap-2" onClick={() => deleteRow()}>
                            <IconTrashLines />
                            Устгах
                        </button>
                        <Link href="/apps/invoice/DoctorAdd" className="btn btn-primary gap-2">
                            <IconPlus />
                            Шинэ эмч нэмэх
                        </Link>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className="table-hover whitespace-nowrap"
                        records={records}
                        columns={[
                            {
                                accessor: 'name',
                                title:'Овог,нэр',
                                sortable: true,
                                render: ({ Doctor_Name}) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{Doctor_Name}</div>
                                    </div>
                                ),
                            },
                            // {
                            //     accessor: 'email',
                            //     title:'И-мэйл',
                            //     sortable: true,
                            // },
                            {
                                accessor: 'profession',
                                title: 'Мэргэшил',
                                sortable: true,
                                titleClassName: 'text-left',
                                render: ({ Profession }) => <div className="text-left font-semibold">{`${Profession.Profession_Name}`}</div>,
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
                                        <Link href="/users/profile" className="flex hover:text-primary">
                                            <IconEye />
                                        </Link>
                                        <Link href="/users/user-account-settings" className="flex hover:text-info">
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </Link>
                                        <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(Doctor_id)}>
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
