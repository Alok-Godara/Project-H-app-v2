export interface MedicalRecord {
  id: string;
  type: 'prescription' | 'lab_report';
  date: string;
  uploadStatus: 'pending' | 'uploaded';
  createdAt: string;
}

export interface PrescriptionRecord extends MedicalRecord {
  type: 'prescription';
  purpose: string;
  doctorName: string;
  department: string;
  hospitalName: string;
}

export interface LabReportRecord extends MedicalRecord {
  type: 'lab_report';
  testName: string;
  prescribedBy: string;
  doctorDepartment: string;
  hospitalName: string;
  laboratoryName: string;
  laboratoryAddress: string;
}

export interface ConsentRequest {
  id: string;
  date: string;
  doctorName: string;
  purpose: string;
  status: 'pending' | 'granted' | 'denied' | 'revoked';
}

export interface PatientProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  healthInfo: {
    allergies: string;
    bloodType: string;
    chronicConditions: string;
    emergencyContact: string;
  };
}