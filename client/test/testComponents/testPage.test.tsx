import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../src/app/login/page'; // Adjusted the import path
import { useAuth } from '@/context/auth-context'; // Adjusted the import path
import { useRegister } from '@/app/api/api/register'; // Adjusted the import path

jest.mock('../../src/context/auth-context');
jest.mock('../../src/app/api/api/register');
jest.mock('../../src/components/loading', () => ({
    Loading: () => <div>Loading...</div>,
}));

describe('LoginPage', () => {
    const mockLogin = jest.fn();
    const mockSetAuthData = jest.fn();
    const mockRegister = jest.fn().mockResolvedValue(true);

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            login: mockLogin,
            setAuthData: mockSetAuthData,
        });
        (useRegister as jest.Mock).mockReturnValue({
            register: mockRegister,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the login form', () => {
        render(<LoginPage />);
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('shows loading indicator while loading', async () => {
        render(<LoginPage />);
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('calls setAuthData and login on successful login', async () => {
        render(<LoginPage />);
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        await waitFor(() => {
            expect(mockSetAuthData).toHaveBeenCalledWith({ username: 'testuser', password: 'password' });
            expect(mockLogin).toHaveBeenCalled();
        });
    });

    test('shows error message on invalid credentials', async () => {
        mockRegister.mockRejectedValueOnce(new Error('Invalid credentials'));
        render(<LoginPage />);
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });
});