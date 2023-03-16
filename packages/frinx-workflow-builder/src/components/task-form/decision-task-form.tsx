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
import { GraphExtendedDecisionTask, GraphExtendedTask } from '../../helpers/types';

type Props = {
  values: GraphExtendedDecisionTask;
  errors: FormikErrors<GraphExtendedTask>;
  setFieldValue: (field: string, value: { key: string; tasks: ExtendedTask[] }[] | boolean) => void;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
};

function getDecisionCaseError(
  errors: FormikErrors<GraphExtendedTask>,
  index: number,
): FormikErrors<{ caseValueParam: string; decisionCase: string }> | null {
  if ('decisionCases' in errors) {
    const { decisionCases } = errors;
    const decisionCaseErrors = decisionCases && decisionCases[index];

    return {
      decisionCase: typeof decisionCaseErrors === 'object' ? decisionCaseErrors.key : undefined,
    };
  }
  return null;
}

const DecisionTaskForm: FC<Props> = ({ values, setFieldValue, errors, handleChange }) => {
  const handleAddDecisionCase = () => {
    if (values.type !== 'DECISION') {
      return;
    }
    const newDecisionCases = [...values.decisionCases, { key: `case_${getRandomString(3)}`, tasks: [] }];
    setFieldValue('decisionCases', newDecisionCases);
  };

  const handleDeleteDecisionCase = (decisionKey: string) => {
    if (values.type !== 'DECISION') {
      return;
    }
    const newDecisionCases = values.decisionCases.filter((c) => c.key !== decisionKey);
    setFieldValue('decisionCases', newDecisionCases);
  };

  return (
    <>
      <HStack spacing={2} marginY={2} alignItems="center">
        <FormControl isInvalid={getDecisionCaseError(errors, 0)?.caseValueParam != null}>
          <InputGroup>
            <InputLeftAddon>if</InputLeftAddon>
            {values.isCaseExpressionEnabled ? (
              <Input type="text" name="caseExpression" value={values.caseExpression || ''} onChange={handleChange} />
            ) : (
              <Input type="text" name="caseValueParam" value={values.caseValueParam || ''} onChange={handleChange} />
            )}
          </InputGroup>
          <FormErrorMessage>{getDecisionCaseError(errors, 0)?.caseValueParam}</FormErrorMessage>
        </FormControl>
        <Button aria-label="Add decision case" size="sm" colorScheme="blue" onClick={handleAddDecisionCase}>
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
          isChecked={values.isCaseExpressionEnabled}
          onChange={() => setFieldValue('isCaseExpressionEnabled', !values.isCaseExpressionEnabled)}
        />
      </FormControl>
      {values.decisionCases.map(({ key }, index) => {
        const decisionErrors = getDecisionCaseError(errors, index);
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
                      if (values.type !== 'DECISION') {
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
                  handleDeleteDecisionCase(key);
                }}
              />
            </HStack>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default DecisionTaskForm;
