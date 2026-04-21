
// import { API_BASE_URL } from "./queryClient";

// const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
//   const headers = {
//     ...options.headers,
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
//   return fetch(url, { ...options, headers });
// };

// export const eventsAPI = {
//   listEvents: (params: any) => {
//     const searchParams = new URLSearchParams();
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined) searchParams.append(key, String(value));
//     });
//     return fetch(`${API_BASE_URL}/api/events?${searchParams.toString()}`);
//   },
//   getEvent: (id: string) => fetch(`${API_BASE_URL}/api/events/${id}`),
// };

// export const registrationsAPI = {
//   getMyRegistrations: () => fetchWithAuth(`${API_BASE_URL}/api/registrations/me`),
//   register: (eventId: string, metadata?: any) => fetchWithAuth(`${API_BASE_URL}/api/events/${eventId}/register`, {
//     method: 'POST',
//     body: JSON.stringify(metadata),
//     headers: { 'Content-Type': 'application/json' },
//   }),
//   unregister: (id: string) => fetchWithAuth(`${API_BASE_URL}/api/registrations/${id}`, { method: 'DELETE' }),
//   regenerateQR: (id: string) => fetchWithAuth(`${API_BASE_URL}/api/registrations/${id}/regenerate-qr`, { method: 'POST' }),
//   downloadQRCode: (id: string) => fetchWithAuth(`${API_BASE_URL}/api/registrations/${id}/qr-code/download`),
// };

// export const publicAPI = {
//   getPublicProfile: (slug: string) => fetch(`${API_BASE_URL}/api/members/profile/${slug}`),
// };

// export const membersAPI = {
//   updateProfile: (data: any) => fetchWithAuth(`${API_BASE_URL}/api/members/profile`, {
//     method: 'PATCH',
//     body: JSON.stringify(data),
//     headers: { 'Content-Type': 'application/json' },
//   }),
//   uploadProfilePhoto: (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return fetchWithAuth(`${API_BASE_URL}/api/members/profile/photo`, {
//       method: 'POST',
//       body: formData,
//     });
//   },
//   deleteProfilePhoto: () => fetchWithAuth(`${API_BASE_URL}/api/members/profile/photo`, { method: 'DELETE' }),
// };
