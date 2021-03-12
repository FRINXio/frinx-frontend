// TODO types for callbacks

class CallbackUtils {
  constructor() {
    this.getCliTopology = null;
    this.getNetconfTopology = null;
    this.getCliConfigurationalState = null;
    this.getNetconfConfigurationalState = null;
    this.getCliOperationalState = null;
    this.getNetconfOperationalState = null;
    this.mountCliNode = null;
    this.mountNetconfNode = null;
    this.unmountCliNode = null;
    this.unmountNetconfNode = null;
    this.getCliDeviceTranslations = null;
    this.getCliConfigurationalDataStore = null;
    this.getCliOperationalDataStore = null;
    this.updateCliConfigurationalDataStore = null;
    this.calculateDiff = null;
    this.commitToNetwork = null;
    this.dryRunCommit = null;
    this.syncFromNetwork = null;
    this.replaceConfigWithOperational = null;
    this.getSnapshots = null;
    this.deleteSnapshot = null;
    this.replaceConfigWithSnapshot = null;
    this.createSnapshot = null;
  }

  setCallbacks(callbacks) {
    if (this.getCliTopology != null) {
      return;
    }

    this.getCliTopology = callbacks.getCliTopology;

    if (this.getNetconfTopology != null) {
      return;
    }

    this.getNetconfTopology = callbacks.getNetconfTopology;

    if (this.getCliConfigurationalState != null) {
      return;
    }

    this.getCliConfigurationalState = callbacks.getCliConfigurationalState;

    if (this.getNetconfConfigurationalState != null) {
      return;
    }

    this.getNetconfConfigurationalState = callbacks.getNetconfConfigurationalState;

    if (this.getNetconfOperationalState != null) {
      return;
    }

    this.getNetconfOperationalState = callbacks.getNetconfOperationalState;

    if (this.getCliOperationalState != null) {
      return;
    }

    this.getCliOperationalState = callbacks.getCliOperationalState;

    if (this.mountCliNode != null) {
      return;
    }

    this.mountCliNode = callbacks.mountCliNode;

    if (this.mountNetconfNode != null) {
      return;
    }

    this.mountNetconfNode = callbacks.mountNetconfNode;

    if (this.unmountCliNode != null) {
      return;
    }

    this.unmountCliNode = callbacks.unmountCliNode;

    if (this.unmountNetconfNode != null) {
      return;
    }

    this.unmountNetconfNode = callbacks.unmountNetconfNode;

    if (this.getCliDeviceTranslations != null) {
      return;
    }

    this.getCliDeviceTranslations = callbacks.getCliDeviceTranslations;

    if (this.getCliConfigurationalDataStore != null) {
      return;
    }

    this.getCliConfigurationalDataStore = callbacks.getCliConfigurationalDataStore;

    if (this.getCliOperationalDataStore != null) {
      return;
    }

    this.getCliOperationalDataStore = callbacks.getCliOperationalDataStore;

    if (this.updateCliConfigurationalDataStore != null) {
      return;
    }

    this.updateCliConfigurationalDataStore = callbacks.updateCliConfigurationalDataStore;

    if (this.calculateDiff != null) {
      return;
    }

    this.calculateDiff = callbacks.calculateDiff;

    if (this.commitToNetwork != null) {
      return;
    }

    this.commitToNetwork = callbacks.commitToNetwork;

    if (this.dryRunCommit != null) {
      return;
    }

    this.dryRunCommit = callbacks.dryRunCommit;

    if (this.syncFromNetwork != null) {
      return;
    }

    this.syncFromNetwork = callbacks.syncFromNetwork;

    if (this.replaceConfigWithOperational != null) {
      return;
    }

    this.replaceConfigWithOperational = callbacks.replaceConfigWithOperational;

    if (this.getSnapshots != null) {
      return;
    }

    this.getSnapshots = callbacks.getSnapshots;

    if (this.deleteSnapshot != null) {
      return;
    }

    this.deleteSnapshot = callbacks.deleteSnapshot;

    if (this.replaceConfigWithSnapshot != null) {
      return;
    }

    this.replaceConfigWithSnapshot = callbacks.replaceConfigWithSnapshot;

    if (this.createSnapshot != null) {
      return;
    }

    this.createSnapshot = callbacks.createSnapshot;
  }

  getCliTopologyCallback() {
    if (this.getCliTopology == null) {
      throw new Error('getCliTopologyCallback is missing');
    }
    return this.getCliTopology;
  }

  getNetconfTopologyCallback() {
    if (this.getNetconfTopology == null) {
      throw new Error('getNetconfTopologyCallback is missing');
    }
    return this.getNetconfTopology;
  }

  getCliConfigurationalStateCallback() {
    if (this.getCliConfigurationalState == null) {
      throw new Error('getCliConfigurationalStateCallback is missing');
    }
    return this.getCliConfigurationalState;
  }

  getNetconfConfigurationalStateCallback() {
    if (this.getNetconfConfigurationalState == null) {
      throw new Error('getNetconfConfigurationalStateCallback is missing');
    }
    return this.getNetconfConfigurationalState;
  }

  getNetconfOperationalStateCallback() {
    if (this.getNetconfOperationalState == null) {
      throw new Error('getNetconfOperationalStateCallback is missing');
    }
    return this.getNetconfOperationalState;
  }

  getCliOperationalStateCallback() {
    if (this.getCliOperationalState == null) {
      throw new Error('getCliOperationalStateCallback is missing');
    }
    return this.getCliOperationalState;
  }

  mountCliNodeCallback() {
    if (this.mountCliNode == null) {
      throw new Error('mountCliNodeCallback is missing');
    }
    return this.mountCliNode;
  }

  mountNetconfNodeCallback() {
    if (this.mountNetconfNode == null) {
      throw new Error('mountNetconfNodeCallback is missing');
    }
    return this.mountNetconfNode;
  }

  unmountCliNodeCallback() {
    if (this.unmountCliNode == null) {
      throw new Error('unmountCliNodeCallback is missing');
    }
    return this.unmountCliNode;
  }

  unmountNetconfNodeCallback() {
    if (this.unmountNetconfNode == null) {
      throw new Error('unmountNetconfNodeCallback is missing');
    }
    return this.unmountNetconfNode;
  }

  getCliDeviceTranslationsCallback() {
    if (this.getCliDeviceTranslations == null) {
      throw new Error('getCliDeviceTranslationsCallback is missing');
    }
    return this.getCliDeviceTranslations;
  }

  getCliConfigurationalDataStoreCallback() {
    if (this.getCliConfigurationalDataStore == null) {
      throw new Error('getCliConfigurationalDataStoreCallback is missing');
    }
    return this.getCliConfigurationalDataStore;
  }

  getCliOperationalDataStoreCallback() {
    if (this.getCliOperationalDataStore == null) {
      throw new Error('getCliOperationalDataStoreCallback is missing');
    }
    return this.getCliOperationalDataStore;
  }

  updateCliConfigurationalDataStoreCallback() {
    if (this.updateCliConfigurationalDataStore == null) {
      throw new Error('updateCliConfigurationalDataStoreCallback is missing');
    }
    return this.updateCliConfigurationalDataStore;
  }

  calculateDiffCallback() {
    if (this.calculateDiff == null) {
      throw new Error('calculateDiffCallback is missing');
    }
    return this.calculateDiff;
  }

  commitToNetworkCallback() {
    if (this.commitToNetwork == null) {
      throw new Error('commitToNetworkCallback is missing');
    }
    return this.commitToNetwork;
  }

  dryRunCommitCallback() {
    if (this.dryRunCommit == null) {
      throw new Error('dryRunCommitCallback is missing');
    }
    return this.dryRunCommit;
  }

  syncFromNetworkCallback() {
    if (this.syncFromNetwork == null) {
      throw new Error('syncFromNetworkCallback is missing');
    }
    return this.syncFromNetwork;
  }

  replaceConfigWithOperationalCallback() {
    if (this.replaceConfigWithOperational == null) {
      throw new Error('replaceConfigWithOperationalCallback is missing');
    }
    return this.replaceConfigWithOperational;
  }

  getSnapshotsCallback() {
    if (this.getSnapshots == null) {
      throw new Error('getSnapshotsCallback is missing');
    }
    return this.getSnapshots;
  }

  deleteSnapshotCallback() {
    if (this.deleteSnapshot == null) {
      throw new Error('deleteSnapshotCallback is missing');
    }
    return this.deleteSnapshot;
  }

  replaceConfigWithSnapshotCallback() {
    if (this.replaceConfigWithSnapshot == null) {
      throw new Error('replaceConfigWithSnapshotCallback is missing');
    }
    return this.replaceConfigWithSnapshot;
  }

  createSnapshotCallback() {
    if (this.createSnapshot == null) {
      throw new Error('createSnapshotCallback is missing');
    }
    return this.createSnapshot;
  }
}

export default new CallbackUtils();
