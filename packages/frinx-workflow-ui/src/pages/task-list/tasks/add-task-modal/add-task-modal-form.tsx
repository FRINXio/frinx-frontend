import React, { FC } from 'react';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Icon,
  Input,
  Select,
  Tag,
  Tooltip,
} from '@chakra-ui/react';
import { TaskDefinition } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import { FormikErrors } from 'formik';

type Key = keyof TaskDefinition;

type FormInputProps = {
  label: string;
  id: Key;
  value?: string | number;
  type?: 'text' | 'number';
  onChange?: (fieldName: string, value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const FormInput: FC<FormInputProps> = React.forwardRef(
  ({ label, onChange, value, id, type = 'text', onKeyPress }, ref: React.ForwardedRef<HTMLInputElement>) => {
    return (
      <FormControl>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <Input
          ref={ref}
          type={type}
          id={id}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChange={(e) => (onChange ? onChange(id, e.target.value) : undefined)}
          onKeyPress={onKeyPress}
        />
      </FormControl>
    );
  },
);

type FormSelectProps = {
  valuesList: string[];
} & Omit<FormInputProps, 'onKeyPress' | 'type'>;

const FormSelect = ({ label, onChange, value, id, valuesList }: FormSelectProps) => {
  return (
    <FormControl>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Select
        id={id}
        defaultValue={value}
        onChange={(e) => (onChange ? onChange('retryLogic', e.target.value) : undefined)}
      >
        {valuesList.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

type AddTaskModalFormProps = {
  onChange: (fieldName: string, value: string | string[] | number) => void;
  onSubmit: () => void;
  task: TaskDefinition;
  errors: FormikErrors<TaskDefinition>;
};

export function AddTaskModalForm({ onChange, errors, onSubmit, task }: AddTaskModalFormProps) {
  const inputKeysRef = React.useRef<HTMLInputElement>(null);
  const outputKeysRef = React.useRef<HTMLInputElement>(null);

  const handleKeyPress = (
    fieldName: 'inputKeys' | 'outputKeys',
    e: React.KeyboardEvent<HTMLInputElement>,
    ref: React.RefObject<HTMLInputElement>,
  ) => {
    if (ref == null || ref.current == null) return;

    if (task[fieldName] != null && e.key === 'Enter') {
      e.preventDefault();

      const inputKeys = Array.from(task[fieldName] || []);
      onChange(fieldName, [...inputKeys, ref.current.value.trim().replaceAll(' ', '_')]);

      // eslint-disable-next-line no-param-reassign
      ref.current.value = '';
    }
  };

  const handleKeyRemoval = (fieldName: 'inputKeys' | 'outputKeys', tag: string) => {
    if (task[fieldName] != null) {
      const tags = Array.from(task[fieldName] || []);
      onChange(
        fieldName,
        tags.filter((k) => k !== tag),
      );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid gridTemplateColumns="1fr 1fr" columnGap={12} rowGap={2}>
        <FormControl isInvalid={errors.name !== undefined}>
          <FormInput id="name" label="Name" onChange={onChange} value={task.name} />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>
        <FormInput id="description" label="Description" onChange={onChange} value={task.description ?? ''} />
        <FormInput id="ownerEmail" label="Owner Email" onChange={onChange} value={task.ownerEmail ?? ''} />
        <FormInput
          id="retryCount"
          label="Retry Count"
          onChange={onChange}
          value={Number(task.retryCount) || undefined}
          type="number"
        />
        <FormSelect
          id="retryLogic"
          label="Retry Logic"
          onChange={onChange}
          value={task.retryLogic ?? 'FIXED'}
          valuesList={['FIXED', 'EXPONENTIAL_BACKOFF']}
        />
        <FormInput
          id="retryDelaySeconds"
          label="Retry Delay"
          onChange={onChange}
          value={Number(task.retryDelaySeconds) || ''}
          type="number"
        />
        <FormSelect
          id="timeoutPolicy"
          label="Timeout Policy"
          onChange={onChange}
          value={task.timeoutPolicy ?? 'RETRY'}
          valuesList={['RETRY', 'TIME_OUT_WF', 'ALERT_ONLY']}
        />
        <FormControl isInvalid={errors.timeoutSeconds !== undefined}>
          <FormInput
            id="timeoutSeconds"
            label="Timeout"
            onChange={onChange}
            value={task.timeoutSeconds}
            type="number"
          />
          {errors.timeoutSeconds && <FormErrorMessage>{errors.timeoutSeconds}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={errors.responseTimeoutSeconds !== undefined}>
          <FormInput
            id="responseTimeoutSeconds"
            label="Response Timeout"
            onChange={onChange}
            value={Number(task.responseTimeoutSeconds) || ''}
            type="number"
          />{' '}
          {errors.responseTimeoutSeconds && <FormErrorMessage>{errors.responseTimeoutSeconds}</FormErrorMessage>}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="inputKeys">
            Input Keys
            <Tooltip label="Hit enter to add input key">
              <Icon as={FeatherIcon} icon="info" size={12} ml={2} />
            </Tooltip>
          </FormLabel>
          <Input id="inputKeys" ref={inputKeysRef} onKeyPress={(e) => handleKeyPress('inputKeys', e, inputKeysRef)} />
          <Box mt={1}>
            {task.inputKeys != null &&
              task.inputKeys.length > 0 &&
              task.inputKeys.map((key) => (
                <Tag ml={1} size="sm" key={key} onClick={() => handleKeyRemoval('inputKeys', key)}>
                  {key}
                </Tag>
              ))}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="outputKeys">
            Output Keys
            <Tooltip label="Hit enter to add output key">
              <Icon as={FeatherIcon} icon="info" size={12} ml={2} />
            </Tooltip>
          </FormLabel>
          <Input
            id="outputKeys"
            ref={outputKeysRef}
            onKeyPress={(e) => handleKeyPress('outputKeys', e, outputKeysRef)}
            placeholder="Enter output keys"
          />
          <Box mt={1}>
            {task.outputKeys != null &&
              task.outputKeys.length > 0 &&
              task.outputKeys.map((key) => (
                <Tag ml={1} size="sm" key={key} onClick={() => handleKeyRemoval('outputKeys', key)}>
                  {key}
                </Tag>
              ))}
          </Box>
        </FormControl>
      </Grid>
    </form>
  );
}
