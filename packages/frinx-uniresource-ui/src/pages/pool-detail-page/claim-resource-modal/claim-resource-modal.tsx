import React, { FC } from 'react';
import ClaimResourceAllocIpv4PrefixModal from './claim-resource-allocating-modals/claim-resource-allocating-ipv4_prefix-modal';
import ClaimResourceAllocVlanModal from './claim-resource-allocating-modals/claim-resource-allocating-vlan';

// eslint-disable-next-line no-shadow
enum ClaimModalVariant {
  IPV4_PREFIX = 'ipv4_prefix',
  IPV6_PREFIX = 'ipv6_prefix',
  VLAN = 'vlan',
  VLAN_RANGE = 'vlan_range',
}

type ModalVariant = 'ipv4_prefix' | 'ipv6_prefix' | 'vlan' | 'vlan_range';

type Props = {
  variant: ModalVariant;
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

const ClaimResourceModal: FC<Props> = ({ variant, ...props }) => {
  return (
    <>
      {variant === ClaimModalVariant.IPV4_PREFIX && <ClaimResourceAllocIpv4PrefixModal {...props} />}
      {variant === ClaimModalVariant.VLAN && <ClaimResourceAllocVlanModal {...props} />}
    </>
  );
};

export default ClaimResourceModal;
