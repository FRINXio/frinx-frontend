import { Workflow } from '@frinx/shared';
import { DevicesQuery, DevicesToInstallInput, ModalWorkflowsQuery } from '../__generated__/graphql';

export function convertGraphqlToClientWorkflow(workflowsData: ModalWorkflowsQuery): Workflow[] {
  return workflowsData.workflows.edges.map((e) => {
    const { node } = e;
    const updateTime = node.updatedAt ? new Date(node.updatedAt).getMilliseconds() : 0;
    return {
      correlationId: '',
      description: node.description ?? undefined,
      hasSchedule: node.hasSchedule ?? false,
      name: node.name,
      version: node.version ?? 1,
      outputParameters: node.outputParameters ?? {},
      restartable: node.restartable ?? false,
      ownerEmail: node.ownerEmail ?? '',
      schemaVersion: 2,
      updateTime,
      timeoutPolicy: node.timeoutPolicy ?? '',
      timeoutSeconds: node.timeoutSeconds,
      variables: node.variables ?? {},
      tasks: [],
    };
  });
}

export function makeDevicesToInstallFromIds(deviceIds: string[], deviceData?: DevicesQuery): DevicesToInstallInput[] {
  const initialValue: DevicesToInstallInput[] = [{ zoneId: '', deviceIds: [] }];
  return (
    [...deviceIds]
      .reduce((acc, deviceId) => {
        const device = deviceData?.devices.edges.find(({ node }) => node.id === deviceId)?.node;

        if (device == null) {
          return acc;
        }

        const isZoneIdInAcc = acc.some((zone) => zone.zoneId === device.zone.id);
        if (isZoneIdInAcc) {
          return acc.map((zone) => {
            if (zone.zoneId === device.zone.id) {
              return {
                ...zone,
                deviceIds: [...zone.deviceIds, device.id],
              };
            }

            return zone;
          });
        }

        return [
          ...acc,
          {
            zoneId: device.zone.id,
            deviceIds: [device.id],
          },
        ];
      }, initialValue)
      // to remove empty zoneId and deviceIds added to initialValue
      .slice(1)
  );
}
