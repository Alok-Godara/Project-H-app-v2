import { supabase } from './Supabase';

// Type for uploadable file
type Uploadable = Blob | Uint8Array | ArrayBuffer | string;

export async function uploadImageToBucket(
	bucket: string,
	path: string,
	file: Uploadable,
	contentType: string = 'image/png'
): Promise<{ data: any; error: any }> {
	// For React Native, file should be a base64 string or ArrayBuffer
	const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
		contentType,
		upsert: true,
	});
	return { data, error };
}

export async function insertRow(
	table: string,
	row: Record<string, any>
): Promise<{ data: any; error: any }> {
		console.log('[Supabase][Insert] Table:', table, 'Row:', row);
		const { data, error } = await supabase.from(table).insert([row]).select().single();
	// If data is an object with table keys, return it directly
	if (data && typeof data === 'object' && !Array.isArray(data)) {
		return { data, error };
	}
	// If data is an array, return the first item
	if (Array.isArray(data) && data.length > 0) {
		return { data: data[0], error };
	}
	// Otherwise, return as is
	return { data, error };
}

export async function updatePatientProfile(
	patientId: string,
	updates: Record<string, any>
): Promise<{ data: any; error: any }> {
	console.log('[Supabase][Update] Patient ID:', patientId, 'Updates:', updates);
	
	// Add updated_at timestamp
	const updatesWithTimestamp = {
		...updates,
		updated_at: new Date().toISOString()
	};
	
	const { data, error } = await supabase
		.from('patients')
		.update(updatesWithTimestamp)
		.eq('id', patientId)
		.select()
		.single();
		
	return { data, error };
}

export async function getProviderAccessRequests(
	patientId: string
): Promise<{ data: any; error: any }> {
	console.log('[Supabase][Select] Getting provider access requests for patient:', patientId);
	
	const { data, error } = await supabase
		.from('provider_patient_access')
		.select(`
			id,
			provider_id,
			patient_id,
			granted_at,
			status,
			providers (
				id,
				name,
				email,
				specialty,
				license_number,
				phone
			)
		`)
		.eq('patient_id', patientId)
		.order('granted_at', { ascending: false });
		
	return { data, error };
}

export async function updateProviderAccessStatus(
	accessId: string,
	status: string
): Promise<{ data: any; error: any }> {
	console.log('[Supabase][Update] Updating access status for:', accessId, 'Status:', status);
	
	const updates: Record<string, any> = {
		status,
		updated_at: new Date().toISOString()
	};
	
	// If allowing access, set granted_at timestamp
	if (status === 'allowed') {
		updates.granted_at = new Date().toISOString();
	}
	
	const { data, error } = await supabase
		.from('provider_patient_access')
		.update(updates)
		.eq('id', accessId)
		.select(`
			id,
			provider_id,
			patient_id,
			granted_at,
			status,
			providers (
				id,
				name,
				email,
				specialty,
				license_number,
				phone
			)
		`)
		.single();
		
	return { data, error };
}

// Placeholder for authentication - will be implemented with auth system
export async function getCurrentPatientId(): Promise<string | null> {
	// TODO: Replace with actual authentication logic
	// For now, return hardcoded patient ID
	return 'a2b46eeb-b0d1-4e57-955f-ccf76143b2a1';
}
