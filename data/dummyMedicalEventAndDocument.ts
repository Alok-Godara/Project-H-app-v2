// Dummy data for medical_events and documents tables

export const dummyMedicalEvent = {
  // id: 'event-uuid-123',
  // patient_id: 'patient-uuid-456',
  provider_name: 'Dr. John Doe',
  type: 'Consultation',
  title: 'General Checkup',
  description: 'Routine annual checkup.',
  event_date: '2025-09-24T10:00:00Z',
  created_at: '2025-09-24T10:05:00Z',
};

export const dummyDocument = {
  // id: 'doc-uuid-789',
  // medical_event_id: 'event-uuid-123',
  // patient_id: 'patient-uuid-456',
  file_url: 'https://your-supabase-url/storage/v1/object/public/medical-records/sample.png',
  file_size: 204800, // in bytes
  is_processed: true,
};

// Example usage for inserting into Supabase
// import { insertRow } from '@/Services/Services';
// await insertRow('medical_events', dummyMedicalEvent);
// await insertRow('documents', dummyDocument);
