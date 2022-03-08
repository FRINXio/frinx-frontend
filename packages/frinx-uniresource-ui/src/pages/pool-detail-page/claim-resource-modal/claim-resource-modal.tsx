import React, { FC } from 'react';
import ClaimResourceAllocIpv4PrefixModal from './claim-resource-allocating-modals/claim-resource-allocating-ipv4_prefix-modal';
import ClaimResourceAllocIpv6PrefixModal from './claim-resource-allocating-modals/claim-resource-allocating-ipv6_prefix';
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
      {variant === ClaimModalVariant.IPV4_PREFIX && <ClaimResourceAllocIpv4PrefixModal {...props} />}
      {variant === ClaimModalVariant.IPV6_PREFIX && <ClaimResourceAllocIpv6PrefixModal {...props} />}
      {variant === ClaimModalVariant.VLAN_RANGE && <ClaimResourceAllocatingVlanRangeModal {...props} />}
      {variant !== ClaimModalVariant.IPV4_PREFIX &&
        variant !== ClaimModalVariant.IPV6_PREFIX &&
        variant !== ClaimModalVariant.VLAN_RANGE && <ClaimResourceDefaultModal {...props} />}
    </>
  );
};

export default ClaimResourceModal;
