import React, { FC } from 'react';
import ClaimResourceAllocIpvXPrefixModal from './claim-resource-allocating-modals/claim-resource-allocating-ipvx_prefix';
import ClaimResourceAllocatingVlanRangeModal from './claim-resource-allocating-modals/claim-resource-allocationg-vlan_range-modal';
import ClaimResourceDefaultModal from './claim-resource-allocating-modals/claim-resource-default-modal';

// eslint-disable-next-line no-shadow
enum ClaimModalVariant {
  IPV4_PREFIX = 'ipv4_prefix',
  IPV6_PREFIX = 'ipv6_prefix',
  VLAN_RANGE = 'vlan_range',
}

type Props = {
  variant: string;
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

const ClaimResourceModal: FC<Props> = ({ variant, ...props }) => {
  return (
    <>
      {(variant === ClaimModalVariant.IPV6_PREFIX || variant === ClaimModalVariant.IPV4_PREFIX) && (
        <ClaimResourceAllocIpvXPrefixModal {...props} />
      )}
      {variant === ClaimModalVariant.VLAN_RANGE && <ClaimResourceAllocatingVlanRangeModal {...props} />}
      {variant !== ClaimModalVariant.IPV4_PREFIX &&
        variant !== ClaimModalVariant.IPV6_PREFIX &&
        variant !== ClaimModalVariant.VLAN_RANGE && <ClaimResourceDefaultModal {...props} />}
    </>
  );
};

export default ClaimResourceModal;
