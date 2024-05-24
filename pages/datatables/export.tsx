import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconMenuComponents from '@/components/Icon/Menu/IconMenuComponents';
import IconFile from '@/components/Icon/IconFile';
import IconPrinter from '@/components/Icon/IconPrinter';
import { downloadExcel } from 'react-export-table-to-excel';

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

type AppointmentRecord = {
    [key: string]: any;
};

const Export = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Export Table'));
    }, [dispatch]);

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('/api/appointment/GetAppointmentList'); // Change the endpoint as per your API
                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const data = await response.json();
                setAppointments(data.appointments);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'Startdate',
        direction: 'asc',
    });

    const col = ['Appointment_Id', 'Эхлэх цаг', 'Дуусах цаг', 'Эмч', 'Өвчтөний утасны дугаар', 'Эмчилгээний ангилал', 'Ажилтан', 'Төлөв', 'Тайлбар', 'created_At'];

    const handleDownloadExcel = () => {
        downloadExcel({
            fileName: 'appointments',
            sheet: 'Appointments',
            tablePayload: {
                header: col,
                body: appointments.map((appointment: Appointment) => [
                    appointment.Appointment_Id,
                    appointment.Startdate,
                    appointment.Enddate,
                    appointment.Doctor?.Doctor_Name || '',
                    appointment.Patient?.Phone_Num || '',
                    appointment.Category?.Category_Name || '',
                    appointment.Employee?.Employee_Name || '',
                    appointment.Status?.Status_Name || '',
                    appointment.Description,
                    appointment.created_At,
                ]),
            },
        });
    };


    const exportTable = (type: any) => {
        let columns: any = col;
        let records = appointments;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: AppointmentRecord) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type === 'print') {
            var rowhtml = '<p>' + filename + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            columns.map((d: any) => {
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';
            records.map((item: AppointmentRecord) => {
                rowhtml += '<tr>';
                columns.map((d: any) => {
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>Print</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
        } else if (type === 'txt') {
            let coldelimiter = ',';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: AppointmentRecord) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
                var data1 = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
                var link1 = document.createElement('a');
                link1.setAttribute('href', data1);
                link1.setAttribute('download', filename + '.txt');
                link1.click();
            } else {
                var blob1 = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob1, filename + '.txt');
                }
            }
        }
    };

    const capitalize = (text: any) => {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };

    return (
        <div>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconMenuComponents />
                </div>
                <span className="ltr:mr-5 rtl:ml-5">Тайлан: </span>
                <a > Үйл ажиллагааны тайлан </a>
            </div>
            <div className="panel mt-6">
                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex flex-wrap items-center">
                        <button type="button" onClick={() => exportTable('csv')} className="btn btn-primary btn-sm m-1 ">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            CSV
                        </button>
                        <button type="button" onClick={() => exportTable('txt')} className="btn btn-primary btn-sm m-1">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            TXT
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1" onClick={handleDownloadExcel}>
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            EXCEL
                        </button>
                        <button type="button" onClick={() => exportTable('print')} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                            PRINT
                        </button>
                    </div>
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div>
                    <DataTable
                        highlightOnHover
                        records={appointments}
                        columns={[
                            { accessor: 'Patient.Patient_Name', title: 'Өвчтөн', sortable: true },
                            { accessor: 'Category.Category_Name', title: 'Эмчилгээний ангилал', sortable: true },
                            { accessor: 'Doctor.Doctor_Name', title: 'Эмчийн нэр', sortable: true },
                            { accessor: 'Startdate', title: 'Эхэлсэн цаг', sortable: true },
                            { accessor: 'Enddate', title: 'Дууссан цаг', sortable: true },
                            { accessor: 'Status.Status_Name', title: 'Цаг захиалгын төлөв', sortable: true },
                            { accessor: 'Description', title: 'Эмчилгээний  дэлгэрэнгүй тайлбар', sortable: true },
                            { accessor: 'Employee.Employee_Name', title: 'Цаг захиалга бүртэсэн ажилтан', sortable: true },
                            { accessor: 'created_At', title: 'Цаг зхиалга үүсгэгдсэн огноо', sortable: true },
                        ]}
                        totalRecords={appointments.length}
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
