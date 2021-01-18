type ListedTask = { label: string };

export default function createSystemTasks(): ListedTask[] {
  return [
    {
      label: 'START',
    },
    {
      label: 'END',
    },
    {
      label: 'FORK',
    },
    {
      label: 'Join',
    },
    {
      label: 'While',
    },
    {
      label: 'While end',
    },
    {
      label: 'Decision',
    },
    {
      label: 'LAMBDA',
    },
    {
      label: 'Python',
    },
    {
      label: 'JS task',
    },
    {
      label: 'HTTP',
    },
    {
      label: 'GRAPHQL',
    },
    {
      label: 'Terminate',
    },
    {
      label: 'Event',
    },
    {
      label: 'Wait',
    },
    {
      label: 'Raw',
    },
  ];
}
