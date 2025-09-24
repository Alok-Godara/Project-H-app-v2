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
	const { data, error } = await supabase.from(table).insert([row]).select().single();
	return { data, error };
}
