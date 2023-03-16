import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Switch,
} from '@chakra-ui/react';
import { ExtendedTask } from '@frinx/shared';
import { getRandomString } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import { FormikErrors } from 'formik';
import produce from 'immer';
import React, { FC } from 'react';
import { GraphExtendedSwitchTask, GraphExtendedTask } from '../../helpers/types';

type Props = {
  values: GraphExtendedSwitchTask;
  errors: FormikErrors<GraphExtendedTask>;
  setFieldValue: (
    field: string,
    value: { key: string; tasks: ExtendedTask[] }[] | 'javascript' | 'value-param',
  ) => void;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
};

function getSwitchCaseError(
  errors: FormikErrors<GraphExtendedTask>,
  index: number,
): FormikErrors<{ expression: string; decisionCase: string }> | null {
  if ('decisionCases' in errors) {
    const { decisionCases } = errors;
    const decisionCaseErrors = decisionCases && decisionCases[index];

    return {
      decisionCase: typeof decisionCaseErrors === 'object' ? decisionCaseErrors.key : undefined,
    };
  }
  return null;
}

const SwitchTaskForm: FC<Props> = ({ values, setFieldValue, errors, handleChange }) => {
  const handleAddSwitchCase = () => {
    if (values.type !== 'SWITCH') {
      return;
    }
    const newDecisionCases = [...values.decisionCases, { key: `case_${getRandomString(3)}`, tasks: [] }];
    setFieldValue('decisionCases', newDecisionCases);
  };

  const handleDeleteSwitchCase = (decisionKey: string) => {
    if (values.type !== 'SWITCH') {
      return;
    }
    const newDecisionCases = values.decisionCases.filter((c) => c.key !== decisionKey);
    setFieldValue('decisionCases', newDecisionCases);
  };

  return (
    <>
      <HStack spacing={2} marginY={2} alignItems="center">
        <FormControl isInvalid={getSwitchCaseError(errors, 0)?.expression != null}>
          <InputGroup>
            <InputLeftAddon>if</InputLeftAddon>
            <Input type="text" name="expression" value={values.expression || ''} onChange={handleChange} />
          </InputGroup>
          <FormErrorMessage>{getSwitchCaseError(errors, 0)?.expression}</FormErrorMessage>
        </FormControl>
        <Button aria-label="Add decision case" size="sm" colorScheme="blue" onClick={handleAddSwitchCase}>
          Add case
        </Button>
      </HStack>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="useCaseExpression" mb="0">
          use case expression
        </FormLabel>
        <Switch
          id="isCaseExpressionEnabled"
          name="isCaseExpressionEnabled"
          size="md"
          isChecked={values.evaluatorType === 'javascript'}
          onChange={() =>
            setFieldValue('evaluatorType', values.evaluatorType === 'javascript' ? 'value-param' : 'javascript')
          }
        />
      </FormControl>
      {values.decisionCases.map(({ key }, index) => {
        const decisionErrors = getSwitchCaseError(errors, index);
        return (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            <HStack spacing={2} marginY={2} alignItems="flex-start" paddingLeft={2}>
              <FormControl isInvalid={decisionErrors?.decisionCase != null}>
                <InputGroup>
                  <InputLeftAddon>is equal to</InputLeftAddon>
                  <Input
                    type="text"
                    value={key}
                    onChange={(event) => {
                      event.persist();
                      if (values.type !== 'SWITCH') {
                        return;
                      }
                      const newDecisionCases = produce(values.decisionCases, (draft) => {
                        const newCase = {
                          ...draft[index],
                          key: event.target.value,
                        };
                        draft.splice(index, 1, newCase);
                      });
                      setFieldValue('decisionCases', newDecisionCases);
                    }}
                  />
                </InputGroup>
                <FormErrorMessage>{decisionErrors?.decisionCase}</FormErrorMessage>
              </FormControl>
              <IconButton
                colorScheme="red"
                size="md"
                aria-label="Delete blueprint"
                icon={<Icon size={20} as={FeatherIcon} icon="trash-2" />}
                onClick={() => {
                  handleDeleteSwitchCase(key);
                }}
              />
            </HStack>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default SwitchTaskForm;
