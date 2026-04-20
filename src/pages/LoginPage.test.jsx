import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import {api} from '../api/axiosConfig';
import * as UserContext from '../context/UserContext.jsx';


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


vi.mock('../api/axiosConfig', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});

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

  it('успешный логин вызывает API и перенаправляет на /battle', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValueOnce({ data: { nickname: 'Tester' } });

    renderComponent();


    const loginForm = screen.getByRole('heading', { name: /Вход в CodeZilla/i }).closest('.glass-panel');


    const emailInput = within(loginForm).getByPlaceholderText('Email');
    const passwordInput = within(loginForm).getByPlaceholderText('Пароль');
    const submitButton = within(loginForm).getByRole('button', { name: /Войти/i });


    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, '123456');
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        rawPassword: '123456'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/battle');
    });
  });

  it('регистрация вызывает API, показывает alert и возвращает на форму логина', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValueOnce({
      data: { nickname: 'Hero' }
    });

    renderComponent();
    await user.click(screen.getByText('Регистрация'));

    await user.type(screen.getByPlaceholderText('Никнейм'), 'Hero');
    await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
    await user.type(screen.getByPlaceholderText('Пароль'), '123456');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await waitFor(() => {

      expect(api.post).toHaveBeenCalledWith('/auth/signup', {
        nickname: 'Hero',
        email: 'test@test.com',
        rawPassword: '123456'
      });

      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Успешная регистрация для Hero"));

      expect(screen.getByRole('heading', { name: 'Вход в CodeZilla' })).toBeInTheDocument();
    });
  });

  it('показывает ошибку, если API логина вернул ошибку', async () => {
    const user = userEvent.setup();

    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Неверный пароль' } }
    });

    renderComponent();


    const loginPanel = screen.getByRole('heading', { name: /Вход в CodeZilla/i }).closest('.glass-panel');
    const form = within(loginPanel);

    await user.type(form.getByPlaceholderText('Email'), 'test@test.com');
    await user.type(form.getByPlaceholderText('Пароль'), 'wrong');

    const submitButton = form.getByRole('button', {
      name: /Войти/i,
      selector: 'button[type="submit"]'
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Ошибка авторизации: Неверный пароль");
    });
  });
});