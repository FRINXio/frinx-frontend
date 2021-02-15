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
      label: 'JOIN',
    },
    {
      label: 'WHILE',
    },
    {
      label: 'WHILE END',
    },
    {
      label: 'DECISION',
    },
    {
      label: 'LAMBDA',
    },
    {
      label: 'PY',
    },
    {
      label: 'JS',
    },
    {
      label: 'HTTP',
    },
    {
      label: 'GRAPHQL',
    },
    {
      label: 'TERMINATE',
    },
    {
      label: 'EVENT',
    },
    {
      label: 'WAIT',
    },
    {
      label: 'RAW',
    },
    {
      label: 'DYNAMIC FORK',
    },
  ];
}
