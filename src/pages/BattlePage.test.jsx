import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import BattlePage from './BattlePage';
import * as UserContext from '../context/UserContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('./components/ui/SettingsModal', () => ({
  default: ({ isOpen, onLogout, onClose }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-settings-modal">
        <button onClick={onLogout}>Mock Logout</button>
        <button onClick={onClose}>Mock Close</button>
      </div>
    );
  }
}));

describe('BattlePage', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(UserContext, 'useUser').mockReturnValue({ 
      user: { nickname: 'Gladiator' }, 
      logout: mockLogout 
    });
  });

  const renderComponent = () => render(<BrowserRouter><BattlePage /></BrowserRouter>);

  it('кнопка "В БОЙ!" перенаправляет на /workspace', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'В БОЙ!' }));
    expect(mockNavigate).toHaveBeenCalledWith('/workspace');
  });

  it('нажатие на PVP в Header перенаправляет на /battle (остается на месте)', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('PVP'));
    expect(mockNavigate).toHaveBeenCalledWith('/battle');
  });

  it('открывает и закрывает окно настроек', async () => {
    const user = userEvent.setup();
    renderComponent();

    const settingsBtn = screen.getByTitle('Настройки');
    await user.click(settingsBtn);

    expect(screen.getByTestId('mock-settings-modal')).toBeInTheDocument();
  });

  it('кнопка "Выйти" в настройках вызывает logout и перенаправляет на /login', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTitle('Настройки'));

    const logoutBtn = screen.getByRole('button', { name: 'Mock Logout' });
    await user.click(logoutBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});