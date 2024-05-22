import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PatientAccountSetting = () => {
    const router = useRouter();
    const { patientId } = router.query;
    const [patientData, setPatientData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await fetch(`/api/patients/${patientId}`); // Adjust the API endpoint accordingly
                if (!response.ok) {
                    throw new Error('Failed to fetch patient data');
                }
                const data = await response.json();
                setPatientData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (patientId) {
            fetchPatientData();
        }
    }, [patientId]);

    return (
        <div>
            <h1>Patient Account Setting</h1>
            {loading ? (
                <p>Loading...</p>
            ) : patientData ? (
                <div>
                    {/* Render patient data here */}
                    <h2>Patient ID: {patientData.id}</h2>
                    <p>Name: {patientData.name}</p>
                    {/* Add other patient details as needed */}
                </div>
            ) : (
                <p>No patient data found</p>
            )}
        </div>
    );
};

export default PatientAccountSetting;
