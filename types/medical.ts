
// Unified type matching the medical_events table
export interface MedicalRecord {
  id: string;
  patient_id: string;
  provider_name: string;
  type: string; // 'prescription' | 'lab_report' | ...
  title: string;
  description: string;
  event_date: string;
  created_at: string;
  // Optionally add file_url, file_size, is_processed if you join with documents
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