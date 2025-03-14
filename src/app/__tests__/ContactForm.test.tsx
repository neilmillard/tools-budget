import {render, screen, fireEvent, cleanup, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactForm from "@/app/components/ContactForm";
import {ApiResponse} from "@/app/types/api";

// Mock fetch
global.fetch = jest.fn();

describe('ContactForm', () => {
    const mockApiUrl = 'http://test-api/contact';

    beforeEach(() => {
        jest.resetAllMocks();
        // Mock environment variables
        process.env.NEXT_PUBLIC_API_GATEWAY_URL = mockApiUrl;
    });

    it('renders the contact form correctly', () => {
        render(<ContactForm />);

        expect(screen.getByRole("textbox", { name: /name/i})).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: /email/i})).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: /message/i})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();

        cleanup()
    });

    it('updates form fields when user types', () => {
        render(<ContactForm />);

        const nameInput = screen.getByRole("textbox", { name: /name/i});
        const emailInput = screen.getByRole("textbox", { name: /email/i});
        const messageInput = screen.getByRole("textbox", { name: /message/i});

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(messageInput, { target: { value: 'Test message' } });

        expect(nameInput).toHaveValue('John Doe');
        expect(emailInput).toHaveValue('john@example.com');
        expect(messageInput).toHaveValue('Test message');

        cleanup()
    });

    it('submits the form and shows success message', async () => {
        const mockResponse: ApiResponse = {
            success: true,
            message: 'Message sent successfully!'
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => mockResponse
        });

        render(<ContactForm/>);

        // Fill out form
        fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'John Doe'}});
        fireEvent.change(screen.getByLabelText(/email/i), {target: {value: 'john@example.com'}});
        fireEvent.change(screen.getByLabelText(/message/i), {target: {value: 'Test message'}});

        // Submit form
        fireEvent.click(screen.getByRole('button', {name: /send/i}));

        // Verify loading state
        expect(screen.getByText(/sending/i)).toBeInTheDocument();

        // Verify API call
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                mockApiUrl,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        contact: {
                            name: 'John Doe',
                            email: 'john@example.com',
                            message: 'Test message'
                        }
                    })
                }
            );
        });
        // Verify success message appears
        await waitFor(() => {
            expect(screen.getByText(mockResponse.message)).toBeInTheDocument();
        });

        // Form should be reset
        await waitFor(() => {
            expect(screen.getByLabelText(/name/i)).toHaveValue('');
            expect(screen.getByLabelText(/email/i)).toHaveValue('');
            expect(screen.getByLabelText(/message/i)).toHaveValue('');
        });

        cleanup()
    });

    it('handles API error correctly', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        render(<ContactForm />);

        // Fill out form
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /send/i }));

        // Verify error message appears
        await waitFor(() => {
            expect(screen.getByText(/error sending message/i)).toBeInTheDocument();
        });

        cleanup()
    });

    it('handles failed response correctly', async () => {
        const mockResponse: ApiResponse = {
            success: false,
            message: 'Invalid email format'
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => mockResponse
        });

        render(<ContactForm />);

        // Fill out form
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid@email' } });
        fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /send/i }));

        // Verify failure message appears
        await waitFor(() => {
            expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
        });

        cleanup()
    });

    it('handles missing API URL', async () => {
        process.env.NEXT_PUBLIC_API_GATEWAY_URL = '';

        render(<ContactForm />);

        // Fill out form
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /send/i }));

        // Verify message about missing API URL
        expect(screen.getByText(/Set NEXT_PUBLIC_API_GATEWAY_URL/i)).toBeInTheDocument();

        cleanup()
    });

})