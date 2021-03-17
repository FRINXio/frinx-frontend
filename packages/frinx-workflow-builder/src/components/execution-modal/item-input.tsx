import React, { FC } from 'react';
import { FormControl, Input, Radio, RadioGroup, Select, Stack, Textarea } from '@chakra-ui/react';

type FormItem = {
  label: string;
  value?: string;
  description?: string;
  type?: string;
  constraint?: string;
  options?: (string | boolean | number)[] | { value: string | number }[];
};
type Props = {
  item: FormItem;
  isInvalid: boolean;
  value: string;
  onChange: (value: string, shouldValidate?: boolean) => void;
};

const ItemInput: FC<Props> = ({ item, value, isInvalid, onChange }) => {
  switch (item.type) {
    case 'workflow-id':
      return null;
    // case 'task-refName':
    //   return (
    //     <Typeahead
    //       id={item.labl}
    //       onChange={(e) => onChange(e)}
    //       placeholder="Enter or select task reference name"
    //       options={waitingWfs.map((w) => w.waitingTasks).flat()}
    //       onInputChange={(e) => onChange(e)}
    //       renderMenuItemChildren={(option) => (
    //         <div>
    //           {option}
    //           <div>
    //             <small>name: {waitingWfs.find((w) => w.waitingTasks.includes(option))?.name}</small>
    //           </div>
    //         </div>
    //       )}
    //     />
    //   );
    case 'textarea':
      return (
        <FormControl placeholder="Enter the input" value={item.value} isInvalid={isInvalid}>
          <Textarea
            rows={2}
            onChange={(e) => onChange(e.target.value, true)}
            value={value}
            placeholder="Enter the input"
          />
        </FormControl>
      );
    case 'toggle':
      return (
        <RadioGroup value={item.value?.toString()} onChange={(e) => handleSwitch(e, i)}>
          <Stack direction="row" spacing={5}>
            <Radio value={item?.options[0].toString()}>{item?.options[0].toString()}</Radio>
            <Radio value={item?.options[1].toString()}>{item?.options[1].toString()}</Radio>
          </Stack>
        </RadioGroup>
      );
    case 'select':
      // return <Dropdown options={item.options} onChange={(e) => handleSwitch(e.value, i)} value={item.value} />;
      return (
        <Select value={item.value} onChange={(e) => handleSwitch(e.target.value, i)}>
          {item.options.map((option) => (
            <option value={option.value}>{option.value}</option>
          ))}
        </Select>
      );
    default:
      return (
        <FormControl isInvalid={warning[i]}>
          <Input onChange={(e) => handleInput(e, i)} value={item.value} placeholder="Enter the input" />
        </FormControl>
      );
  }
};

export default ItemInput;
