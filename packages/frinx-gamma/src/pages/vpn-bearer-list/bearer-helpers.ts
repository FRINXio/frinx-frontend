import { VpnBearer } from '../../components/forms/bearer-types';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type VpnBearerWithStatus = VpnBearer & { editStatus: Status };

export function getChangedBearersWithStatus(
  createdBearers: VpnBearer[] | null,
  updatedBearers: VpnBearer[] | null,
  deletedBearers: VpnBearer[] | null,
): VpnBearerWithStatus[] {
  const createdBearersWithStatus: VpnBearerWithStatus[] =
    createdBearers?.map((bearer) => {
      return {
        ...bearer,
        editStatus: 'CREATED',
      };
    }) || [];

  const updatedBearersWithStatus: VpnBearerWithStatus[] =
    updatedBearers?.map((bearer) => {
      return {
        ...bearer,
        editStatus: 'UPDATED',
      };
    }) || [];

  const deletedBearersWithStatus: VpnBearerWithStatus[] =
    deletedBearers?.map((Bearer) => {
      return {
        ...Bearer,
        editStatus: 'DELETED',
      };
    }) || [];

  return [...createdBearersWithStatus, ...updatedBearersWithStatus, ...deletedBearersWithStatus];
}

export function getSavedBearersWithStatus(
  bearers: VpnBearer[] | null,
  updatedBearers: VpnBearer[] | null,
  deletedBearers: VpnBearer[] | null,
): VpnBearerWithStatus[] {
  return (
    bearers?.map((bearer) => {
      const updatedBearer = updatedBearers?.filter((i) => i.spBearerReference === bearer.spBearerReference) || [];
      if (updatedBearer.length) {
        return {
          ...updatedBearer[0],
          editStatus: 'UPDATED',
        };
      }

      const deletedBearer = deletedBearers?.filter((i) => i.spBearerReference === bearer.spBearerReference) || [];
      if (deletedBearer.length) {
        return {
          ...deletedBearer[0],
          editStatus: 'DELETED',
        };
      }

      return {
        ...bearer,
        editStatus: 'NO_CHANGE',
      };
    }) || []
  );
}
