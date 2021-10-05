import { VoidFunctionComponent } from 'beautiful-react-diagrams/node_modules/@types/react';

const GammaApp: VoidFunctionComponent = () => {
  const [components, setComponents] = useState<(UniflowComponents & BuilderComponents) | null>(null);
  const history = useHistory();
  const [key, setKey] = useState(uuid());

  useEffect(() => {
    import('@frinx/gamma').then((gammaImport) => {
      const {} = gammaImport;

      setComponents({});
    });
  }, []);

  if (components == null) {
    return null;
  }

  return null;
};
