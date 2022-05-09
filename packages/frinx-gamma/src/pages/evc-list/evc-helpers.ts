import { EvcAttachment } from '../../components/forms/bearer-types';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type EvcAttachmentWithStatus = EvcAttachment & { evcStatus: Status };

export function getChangedEvcAttachmentsWithStatus(
  createdEvcAttachments: EvcAttachment[] | null,
  updatedEvcAttachments: EvcAttachment[] | null,
  deletedEvcAttachments: EvcAttachment[] | null,
): EvcAttachmentWithStatus[] {
  const createdEvcAttachmentsWithStatus: EvcAttachmentWithStatus[] =
    createdEvcAttachments?.map((evc) => {
      return {
        ...evc,
        evcStatus: 'CREATED',
      };
    }) || [];

  const updatedEvcAttachmentsWithStatus: EvcAttachmentWithStatus[] =
    updatedEvcAttachments?.map((evc) => {
      return {
        ...evc,
        evcStatus: 'UPDATED',
      };
    }) || [];

  const deletedEvcAttachmentsWithStatus: EvcAttachmentWithStatus[] =
    deletedEvcAttachments?.map((evc) => {
      return {
        ...evc,
        evcStatus: 'DELETED',
      };
    }) || [];

  return [...createdEvcAttachmentsWithStatus, ...updatedEvcAttachmentsWithStatus, ...deletedEvcAttachmentsWithStatus];
}

export function getSavedEvcAttachmentsWithStatus(
  evcAttachments: EvcAttachment[] | null,
  updatedEvcAttachments: EvcAttachment[] | null,
  deletedEvcAttachments: EvcAttachment[] | null,
): EvcAttachmentWithStatus[] {
  return (
    evcAttachments?.map((evc) => {
      const updatedEvcAttachment =
        updatedEvcAttachments?.filter((i) => i.circuitReference === evc.circuitReference) || [];
      if (updatedEvcAttachment.length) {
        return {
          ...updatedEvcAttachment[0],
          evcStatus: 'UPDATED',
        };
      }

      const deletedEvcAttachment =
        deletedEvcAttachments?.filter((i) => i.circuitReference === evc.circuitReference) || [];
      if (deletedEvcAttachment.length) {
        return {
          ...deletedEvcAttachment[0],
          evcStatus: 'DELETED',
        };
      }

      return {
        ...evc,
        evcStatus: 'NO_CHANGE',
      };
    }) || []
  );
}
