import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import emailjs from 'emailjs-com';
import Contact from '../Contact';

// Mock emailjs to prevent real API calls
jest.mock('emailjs-com', () => ({
    send: jest.fn(),
}));

describe('Contact Component', () => {
    beforeEach(() => {
        emailjs.send.mockClear();
    });

    test('renders the Contact form and all fields', () => {
        render(<Contact />);

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    test('allows the user to fill out the form', () => {
        render(<Contact />);

        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const phoneInput = screen.getByLabelText(/phone/i);
        const subjectInput = screen.getByLabelText(/subject/i);
        const messageInput = screen.getByLabelText(/message/i);

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(phoneInput, { target: { value: '1234567890' } });
        fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
        fireEvent.change(messageInput, { target: { value: 'Test Message' } });

        expect(nameInput.value).toBe('John Doe');
        expect(emailInput.value).toBe('john@example.com');
        expect(phoneInput.value).toBe('1234567890');
        expect(subjectInput.value).toBe('Test Subject');
        expect(messageInput.value).toBe('Test Message');
    });

    test('submits the form successfully', async () => {
        render(<Contact />);

        emailjs.send.mockResolvedValue({ status: 200, text: 'Success' });

        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const phoneInput = screen.getByLabelText(/phone/i);
        const subjectInput = screen.getByLabelText(/subject/i);
        const messageInput = screen.getByLabelText(/message/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        userEvent.type(nameInput, 'John Doe');
        userEvent.type(emailInput, 'john@example.com');
        userEvent.type(phoneInput, '1234567890');
        userEvent.type(subjectInput, 'Test Subject');
        userEvent.type(messageInput, 'Test Message');

        fireEvent.click(sendButton);

        expect(emailjs.send).toHaveBeenCalledWith(
            'service_h7xt39f',
            'template_v2iyihd',
            {
                user_name: 'John Doe',
                user_email: 'john@example.com',
                user_phone: '1234567890',
                subject: 'Test Subject',
                message: 'Test Message',
            },
            'Myu300hXPjTNU2FtZ'
        );

        // Check if the fields are reset
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(phoneInput.value).toBe('');
        expect(subjectInput.value).toBe('');
        expect(messageInput.value).toBe('');
    });

    

    test('displays static contact information', () => {
        render(<Contact />);

        expect(screen.getByText(/123 main street, anytown usa/i)).toBeInTheDocument();
        expect(screen.getByText(/\(123\) 456-7890/i)).toBeInTheDocument();
        expect(screen.getByText(/example@example.com/i)).toBeInTheDocument();
    });
});
