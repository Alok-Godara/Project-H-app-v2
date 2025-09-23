import { PrescriptionRecord, LabReportRecord, ConsentRequest, PatientProfile } from '@/types/medical';

export const mockPrescriptions: PrescriptionRecord[] = [
  {
    id: '1',
    type: 'prescription',
    date: '2024-11-15',
    purpose: 'Routine Checkup',
    doctorName: 'Dr. Sarah Johnson',
    department: 'Internal Medicine',
    hospitalName: 'City General Hospital',
    uploadStatus: 'uploaded',
    createdAt: '2024-11-15T10:30:00Z',
  },
  {
    id: '2',
    type: 'prescription',
    date: '2024-11-10',
    purpose: 'Follow-up Consultation',
    doctorName: 'Dr. Michael Chen',
    department: 'Cardiology',
    hospitalName: 'Heart Care Center',
    uploadStatus: 'uploaded',
    createdAt: '2024-11-10T14:15:00Z',
  },
  {
    id: '3',
    type: 'prescription',
    date: '2024-10-28',
    purpose: 'Hypertension Management',
    doctorName: 'Dr. Emily Rodriguez',
    department: 'Internal Medicine',
    hospitalName: 'Metro Medical Center',
    uploadStatus: 'pending',
    createdAt: '2024-10-28T09:45:00Z',
  },
];

export const mockLabReports: LabReportRecord[] = [
  {
    id: '4',
    type: 'lab_report',
    date: '2024-11-12',
    testName: 'Complete Blood Count',
    prescribedBy: 'Dr. Sarah Johnson',
    doctorDepartment: 'Internal Medicine',
    hospitalName: 'City General Hospital',
    laboratoryName: 'QuickLab Diagnostics',
    laboratoryAddress: '123 Health St, Medical District',
    uploadStatus: 'uploaded',
    createdAt: '2024-11-12T11:20:00Z',
  },
  {
    id: '5',
    type: 'lab_report',
    date: '2024-11-08',
    testName: 'Lipid Profile',
    prescribedBy: 'Dr. Michael Chen',
    doctorDepartment: 'Cardiology',
    hospitalName: 'Heart Care Center',
    laboratoryName: 'Advanced Diagnostics',
    laboratoryAddress: '456 Lab Ave, Health Plaza',
    uploadStatus: 'uploaded',
    createdAt: '2024-11-08T16:30:00Z',
  },
  {
    id: '6',
    type: 'lab_report',
    date: '2024-10-25',
    testName: 'Thyroid Function Test',
    prescribedBy: 'Dr. Lisa Park',
    doctorDepartment: 'Endocrinology',
    hospitalName: 'Wellness Hospital',
    laboratoryName: 'City Lab Services',
    laboratoryAddress: '789 Test Blvd, Medical Complex',
    uploadStatus: 'pending',
    createdAt: '2024-10-25T13:00:00Z',
  },
];

export const mockConsentRequests: ConsentRequest[] = [
  {
    id: '1',
    date: '2024-11-14',
    doctorName: 'Dr. Robert Wilson',
    purpose: 'Second opinion consultation for cardiac evaluation',
    status: 'pending',
  },
  {
    id: '2',
    date: '2024-11-10',
    doctorName: 'Dr. Sarah Johnson',
    purpose: 'Follow-up treatment review and medication adjustment',
    status: 'granted',
  },
  {
    id: '3',
    date: '2024-11-05',
    doctorName: 'Dr. Kevin Martinez',
    purpose: 'Specialist referral for orthopedic consultation',
    status: 'denied',
  },
];

export const mockPatientProfile: PatientProfile = {
  personalInfo: {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
  },
  healthInfo: {
    allergies: 'Penicillin, Shellfish',
    bloodType: 'A+',
    chronicConditions: 'Hypertension, Type 2 Diabetes',
    emergencyContact: 'Jane Smith - (555) 987-6543',
  },
};