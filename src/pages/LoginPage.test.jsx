import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as UserContext from '../context/UserContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(UserContext, 'useUser').mockReturnValue({ 
        user: null,
        login: vi.fn(),
        logout: vi.fn()
    });
  });

  const renderComponent = () => render(<BrowserRouter><LoginPage /></BrowserRouter>);

  it('нажатие на логотип в Header сбрасывает вид на форму входа', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Регистрация'));
    expect(screen.getByRole('heading', { name: 'Регистрация' })).toBeInTheDocument();

    await user.click(screen.getByText('CodeZilla'));
    
    expect(screen.getByRole('heading', { name: 'Вход в CodeZilla' })).toBeInTheDocument();
  });

  it('успешный логин перенаправляет на /battle', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
    await user.type(screen.getByPlaceholderText('Пароль'), '123456');
    
    const loginButtons = screen.getAllByRole('button', { name: /Войти/i });
    
    await user.click(loginButtons[1]);

    expect(screen.getByRole('button', { name: 'Вход...' })).toBeInTheDocument();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/battle');
    }, { timeout: 1500 }); 
  });

  it('регистрация показывает alert и возвращает на форму логина', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    renderComponent();
    await user.click(screen.getByText('Регистрация'));

    await user.type(screen.getByPlaceholderText('Никнейм'), 'Hero');
    await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
    await user.type(screen.getByPlaceholderText('Пароль'), '123456');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Регистрация успешна! Теперь вы можете войти.');
    }, { timeout: 1500 });
    
    expect(screen.getByRole('heading', { name: 'Вход в CodeZilla' })).toBeInTheDocument();
    
    alertMock.mockRestore();
  });
});