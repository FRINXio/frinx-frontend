// @flow
import { AbstractPortFactory, PortModel } from '@projectstorm/react-diagrams';

export class SimplePortFactory extends AbstractPortFactory {
  cb: () => PortModel;

  constructor(type: string, cb: () => PortModel) {
    super(type);
    this.cb = cb;
  }

  getNewInstance(initialConfig): PortModel {
    return this.cb(initialConfig);
  }
}
