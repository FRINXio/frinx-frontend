export class Builder {
  formattedPackageName: string;
  perf: { start: (label?: string) => void; stop: (label?: string) => { preciseWords: string } };

  constructor(init: { packageName: string });

  clean(): Promise<void>;

  buildPackage: (options: { mainFileName: string; moduleFileName: string; external?: string[] }) => Promise<void>;

  buildTypes: (script: string) => Promise<void>;
}

export async function makeContextAndWatch(options: {
  moduleFileName: string;
  external?: string[];
  packageName: string;
}): Promise<void>;
