
// Minimal API stubs used by components during typechecking.
export const registrationsAPI = {
	getMyRegistrations: async () => ({ json: async () => ({ items: [], total: 0 }) }),
	register: async (eventId: string, metadata?: any) => ({ ok: true, json: async () => ({ id: 'stub' }) }),
	unregister: async (id: string) => ({ ok: true, json: async () => ({}) }),
	regenerateQR: async (id: string) => ({ ok: true, json: async () => ({ qr_code_image_url: 'https://example.com/qr.png' }) }),
	downloadQRCode: async (id: string) => ({ ok: true, json: async () => ({ url: 'https://example.com/qr-download' }) }),
};

export const eventsAPI = {
	listEvents: async (params?: any) => ({ json: async () => ({ items: [], total: 0 }) }),
	getEvent: async (id: string) => ({ json: async () => ({ id, title: 'Stub Event' }) }),
};

export const publicAPI = {
	getPublicProfile: async (slug: string) => ({ json: async () => ({}) }),
};

export const membersAPI = {
	updateProfile: async (data: any) => ({ ok: true }),
	uploadProfilePhoto: async (file: File) => ({ ok: true }),
	deleteProfilePhoto: async () => ({ ok: true }),
};

export default {};
