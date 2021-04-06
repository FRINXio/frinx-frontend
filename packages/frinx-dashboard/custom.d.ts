declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.inline.svg' {
  const content: 'svg';
  export default content;
}

declare module 'react-notifications';

declare module 'feather-icons-react' {
  const content: FC<{ icon: string; size: string }>;

  export default content;
}

type DashboardApp = {
  init: () => Promise<DashboardApp>;

  render: () => void;
};
