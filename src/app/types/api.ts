export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export interface ContactRequestPayload {
    contact: ContactFormData;
}

export interface ApiResponse {
    success: boolean;
    message: string;
}
