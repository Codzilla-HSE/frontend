import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SettingsModal from './SettingsModal';

describe('SettingsModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onLogout: vi.fn(),
    themeConfig: { isDarkMode: true, setIsDarkMode: vi.fn() },
    workspaceConfig: { isSwapped: false, setIsSwapped: vi.fn() }
  };

  it('не рендерится, если isOpen=false', () => {
    render(<SettingsModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Настройки')).toBeNull();
  });

  it('вызывает onLogout при нажатии на кнопку Выйти', async () => {
    const user = userEvent.setup();
    render(<SettingsModal {...defaultProps} />);
    
    await user.click(screen.getByRole('button', { name: 'Выйти' }));
    expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
  });

  it('меняет тему при клике на чекбокс', async () => {
    const user = userEvent.setup();
    render(<SettingsModal {...defaultProps} />);
    
    const themeCheckbox = screen.getByLabelText('Светлая тема');
    await user.click(themeCheckbox);
    
    expect(defaultProps.themeConfig.setIsDarkMode).toHaveBeenCalledWith(false);
  });
});