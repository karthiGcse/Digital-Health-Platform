import React, { createContext, useContext, useState, useCallback } from 'react';

export interface HospitalPatient {
  id: string;
  name: string;
  age: number;
  phone: string;
  gender: string;
  symptoms: string;
  history: string;
  chronic: string[];
  photo: string | null;
  token: number;
  status: 'Waiting' | 'In Progress' | 'Completed';
  registeredAt: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
}

export interface HospitalPrescription {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  time: string;
  status: 'New' | 'In Progress' | 'Ready' | 'Dispensed';
  createdAt: string;
}

export interface HospitalNotification {
  id: string;
  patient: string;
  message: string;
  type: 'token' | 'doctor' | 'pharmacy' | 'reminder' | 'followup' | 'bed';
  time: string;
  status: 'Sent' | 'Delivered' | 'Read';
}

export type BedStatus = 'available' | 'occupied' | 'cleaning' | 'reserved';

export interface Bed {
  id: string;
  number: string;
  ward: string;
  status: BedStatus;
  patient?: string;
  patientId?: string;
  doctor?: string;
  admissionDate?: string;
  expectedDischarge?: string;
}

interface HospitalContextType {
  patients: HospitalPatient[];
  prescriptions: HospitalPrescription[];
  notifications: HospitalNotification[];
  beds: Bed[];
  registerPatient: (patient: Omit<HospitalPatient, 'id' | 'token' | 'status' | 'registeredAt' | 'chronic'>) => HospitalPatient;
  updatePatientStatus: (id: string, status: HospitalPatient['status']) => void;
  addPrescription: (rx: Omit<HospitalPrescription, 'id' | 'status' | 'createdAt'>) => void;
  updatePrescriptionStatus: (id: string, status: HospitalPrescription['status']) => void;
  addNotification: (notif: Omit<HospitalNotification, 'id'>) => void;
  updateBedStatus: (bedId: string, status: BedStatus, patientName?: string, patientId?: string) => void;
  assignBed: (patientId: string, patientName: string, ward: string) => Bed | null;
  getAvailableBeds: (ward?: string) => Bed[];
}

const HospitalContext = createContext<HospitalContextType>({} as HospitalContextType);

export const useHospital = () => useContext(HospitalContext);

const wards = ['ICU', 'Emergency', 'General Ward', 'Surgery'];

const generateInitialBeds = (): Bed[] => {
  const beds: Bed[] = [];
  const patients = ['Rahul S.', 'Priya P.', 'Amit K.', 'Sneha G.', 'Vikram S.', 'Meera J.', 'Ravi T.', 'Anjali D.', 'Suresh M.', 'Kavita R.'];
  const doctors = ['Dr. Arun', 'Dr. Meena', 'Dr. Rajan', 'Dr. Sunita', 'Dr. Pradeep'];
  let idx = 0;
  wards.forEach(ward => {
    const count = ward === 'ICU' ? 6 : ward === 'Emergency' ? 5 : ward === 'Surgery' ? 4 : 8;
    for (let i = 1; i <= count; i++) {
      const statuses: BedStatus[] = ['available', 'occupied', 'occupied', 'cleaning', 'reserved', 'available', 'occupied'];
      const status = statuses[idx % statuses.length];
      beds.push({
        id: `${ward}-${i}`,
        number: `${ward.charAt(0)}${i.toString().padStart(2, '0')}`,
        ward,
        status,
        ...(status === 'occupied' ? {
          patient: patients[idx % patients.length],
          doctor: doctors[idx % doctors.length],
          admissionDate: '2025-04-03',
          expectedDischarge: '2025-04-08',
        } : {}),
      });
      idx++;
    }
  });
  return beds;
};

let tokenCounter = 0;

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<HospitalPatient[]>([]);
  const [prescriptions, setPrescriptions] = useState<HospitalPrescription[]>([]);
  const [notifications, setNotifications] = useState<HospitalNotification[]>([]);
  const [beds, setBeds] = useState<Bed[]>(generateInitialBeds);

  const addNotification = useCallback((notif: Omit<HospitalNotification, 'id'>) => {
    setNotifications(prev => [{
      ...notif,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
    }, ...prev]);
  }, []);

  const registerPatient = useCallback((data: Omit<HospitalPatient, 'id' | 'token' | 'status' | 'registeredAt' | 'chronic'>) => {
    tokenCounter++;
    const year = new Date().getFullYear();
    const num = String(tokenCounter).padStart(4, '0');
    const patient: HospitalPatient = {
      ...data,
      id: `PT-${year}-${num}`,
      token: tokenCounter,
      status: 'Waiting',
      chronic: [],
      registeredAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setPatients(prev => [...prev, patient]);
    addNotification({
      patient: patient.name,
      message: `Token #${patient.token} assigned. Estimated wait: ~${(tokenCounter - 1) * 8} min`,
      type: 'token',
      time: patient.registeredAt,
      status: 'Sent',
    });
    return patient;
  }, [addNotification]);

  const updatePatientStatus = useCallback((id: string, status: HospitalPatient['status']) => {
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        if (status === 'In Progress') {
          addNotification({
            patient: p.name,
            message: `Doctor is ready to see you now.`,
            type: 'doctor',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: 'Sent',
          });
        }
        return { ...p, status };
      }
      return p;
    }));
  }, [addNotification]);

  const addPrescription = useCallback((rx: Omit<HospitalPrescription, 'id' | 'status' | 'createdAt'>) => {
    const newRx: HospitalPrescription = {
      ...rx,
      id: `RX-${String(prescriptions.length + 1).padStart(3, '0')}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    setPrescriptions(prev => [...prev, newRx]);
    addNotification({
      patient: rx.patientName,
      message: `Prescription sent to pharmacy. ${rx.medicines.length} medicine(s) prescribed.`,
      type: 'pharmacy',
      time: rx.time,
      status: 'Sent',
    });
  }, [prescriptions.length, addNotification]);

  const updatePrescriptionStatus = useCallback((id: string, status: HospitalPrescription['status']) => {
    setPrescriptions(prev => prev.map(p => {
      if (p.id === id) {
        if (status === 'Ready') {
          addNotification({
            patient: p.patientName,
            message: `Your medicine is ready for pickup at the pharmacy counter.`,
            type: 'pharmacy',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: 'Sent',
          });
        }
        return { ...p, status };
      }
      return p;
    }));
  }, [addNotification]);

  const updateBedStatus = useCallback((bedId: string, status: BedStatus, patientName?: string, patientId?: string) => {
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        const updated: Bed = { ...b, status };
        if (status === 'occupied' && patientName) {
          updated.patient = patientName;
          updated.patientId = patientId;
          updated.admissionDate = new Date().toISOString().split('T')[0];
          addNotification({
            patient: patientName,
            message: `Bed ${b.number} (${b.ward}) has been assigned to you.`,
            type: 'bed',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: 'Sent',
          });
        }
        if (status === 'available') {
          updated.patient = undefined;
          updated.patientId = undefined;
          updated.admissionDate = undefined;
          updated.expectedDischarge = undefined;
        }
        return updated;
      }
      return b;
    }));
  }, [addNotification]);

  const getAvailableBeds = useCallback((ward?: string) => {
    return beds.filter(b => b.status === 'available' && (!ward || b.ward === ward));
  }, [beds]);

  const assignBed = useCallback((patientId: string, patientName: string, ward: string) => {
    const available = beds.find(b => b.status === 'available' && b.ward === ward);
    if (available) {
      updateBedStatus(available.id, 'occupied', patientName, patientId);
      return available;
    }
    return null;
  }, [beds, updateBedStatus]);

  return (
    <HospitalContext.Provider value={{
      patients, prescriptions, notifications, beds,
      registerPatient, updatePatientStatus,
      addPrescription, updatePrescriptionStatus,
      addNotification, updateBedStatus, assignBed, getAvailableBeds,
    }}>
      {children}
    </HospitalContext.Provider>
  );
};
