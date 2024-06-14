import { render } from '@testing-library/react';
import RootLayout, { metadata } from '../../src/app/layout';
import { AuthProvider } from '@/context/auth-context';

jest.mock('@/context/auth-context', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('RootLayout', () => {
    test('renders RootLayout with children', () => {
        const { container } = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        expect(container.querySelector('html')).toBeInTheDocument();
        expect(container.querySelector('body')).toBeInTheDocument();
        expect(container.textContent).toBe('Test Child');
    });
});

describe('Metadata', () => {
    test('should have correct metadata', () => {
        expect(metadata.title).toBe('HuskSheets');
        expect(metadata.description).toBe('Created by Arinjay, Kaan, Nick, Parnika, and Troy');
    });
});
