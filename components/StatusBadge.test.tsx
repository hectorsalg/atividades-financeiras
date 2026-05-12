import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('Componente StatusBadge', () => {
  it('Deve renderizar com a cor verde quando o status for "Concluído"', () => {
    render(<StatusBadge status="Concluído" />);
    const badge = screen.getByText('Concluído');
    // @ts-ignore
    expect(badge).toBeInTheDocument();
    // @ts-ignore
    expect(badge).toHaveClass('bg-green-100');
  });

  it('Deve renderizar com a cor amarela para outros status', () => {
    render(<StatusBadge status="Pendente" />);
    const badge = screen.getByText('Pendente');
    
    // @ts-ignore
    expect(badge).toHaveClass('bg-yellow-100');
  });
});