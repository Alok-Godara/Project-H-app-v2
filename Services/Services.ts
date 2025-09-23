import { supabase } from './Supabase';

// Type for uploadable file
type Uploadable = File | Blob | Uint8Array | ArrayBuffer;

/**
 * Uploads a file (image) to a Supabase Storage bucket.
 * @param bucket The name of the storage bucket.
 * @param path The path (including filename) to store the file in the bucket.
 * @param file The file to upload.
 * @param contentType The MIME type of the file (e.g., 'image/png').
 * @returns The upload result.
 */
export async function uploadImageToBucket(
	bucket: string,
	path: string,
	file: Uploadable,
	contentType: string = 'image/png'
): Promise<{ data: any; error: any }> {
	const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
		contentType,
		upsert: true,
	});
	return { data, error };
}

/**
 * Inserts a row into a specified table.
 * @param table The table name.
 * @param row The data to insert.
 * @returns The insert result.
 */
export async function insertRow(
	table: string,
	row: Record<string, any>
): Promise<{ data: any; error: any }> {
	const { data, error } = await supabase.from(table).insert([row]).select().single();
	return { data, error };
}

// Usage example:
// await uploadImageToBucket('my-bucket', 'images/photo.png', fileBlob, 'image/png');
// await insertRow('profiles', { id: 'user-id', name: 'John Doe' });
