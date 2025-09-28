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
