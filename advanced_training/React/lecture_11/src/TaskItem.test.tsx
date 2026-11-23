import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from './TaskItem';
describe('TaskItem', () => {
  const mockTest = {
    id: '1',
    title: 'write unit tests',
    completed: false,
  };
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title correctly', () => {
    render(<TaskItem task={mockTest} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    expect(screen.getByText('Write unit tests')).toBeInTheDocument();
  });
});
