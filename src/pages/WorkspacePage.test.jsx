import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import WorkspacePage from './WorkspacePage';
import * as UserContext from '../context/UserContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/workspace' }),
  };
});

vi.mock('./components/ui/SettingsModal', () => ({
  default: ({ isOpen, onLogout }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-settings-modal">
        <button onClick={onLogout}>Выйти из аккаунта</button>
      </div>
    );
  }
}));

vi.mock('./components/workspace/LeftWorkspace', () => ({ default: () => <div /> }));
vi.mock('./components/workspace/RightWorkspace', () => ({ default: () => <div /> }));
vi.mock('./components/layout/Footer', () => ({ default: () => <div /> }));

describe('WorkspacePage', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(UserContext, 'useUser').mockReturnValue({
      user: { nickname: 'Hero', email: 'test@test.com' },
      login: vi.fn(),
      logout: mockLogout,
    });
  });

  const renderComponent = () => render(<BrowserRouter><WorkspacePage /></BrowserRouter>);

  it('при нажатии на логотип появляется confirm, при согласии кидает на /battle', async () => {
    const user = userEvent.setup();
    const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    renderComponent();

    await user.click(screen.getByText('CodeZilla'));

    expect(confirmMock).toHaveBeenCalledWith('Вы точно хотите покинуть битву? Ваш прогресс может быть потерян.');
    expect(mockNavigate).toHaveBeenCalledWith('/battle');
    
    confirmMock.mockRestore();
  });

  it('при нажатии на PVP появляется confirm, при отмене редирект не происходит', async () => {
    const user = userEvent.setup();
    const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    renderComponent();

    await user.click(screen.getByText(/PVP/i));

    expect(confirmMock).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled(); 
    
    confirmMock.mockRestore();
  });

  it('открытие настроек и нажатие выхода вызывает logout и перенаправляет на /login', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTitle('Настройки'));

    await user.click(screen.getByText('Выйти из аккаунта'));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});