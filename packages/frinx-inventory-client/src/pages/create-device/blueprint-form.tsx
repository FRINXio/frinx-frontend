import { Box, Button, FormControl, FormLabel, Input, Select, Wrap, WrapItem } from '@chakra-ui/react';
import parse from 'json-templates';
import React, { useEffect, useMemo, useState, VoidFunctionComponent } from 'react';
import { DeviceBlueprintsQuery } from '../../__generated__/graphql';

type StateBlueprint = {
  id: string;
  template: string;
};
type Props = {
  blueprints: DeviceBlueprintsQuery['blueprints']['edges'];
  onFormSubmit: (mountParameters: string) => void;
};

function getTemplate(bp: StateBlueprint | null) {
  return bp != null ? parse(bp.template) : null;
}

const BlueprintForm: VoidFunctionComponent<Props> = ({ blueprints, onFormSubmit }) => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<StateBlueprint | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const parsedTemplate = useMemo(() => getTemplate(selectedBlueprint), [selectedBlueprint]);
  const parameters = useMemo(() => parsedTemplate?.parameters, [parsedTemplate]);

  useEffect(() => {
    setFormValues(() => {
      if (parameters != null) {
        return parameters.reduce((acc, curr) => {
          return {
            [curr.key]: '',
            ...acc,
          };
        }, {});
      }
      return {};
    });
  }, [parameters]);

  return (
    <Box>
      <FormControl marginY={6}>
        <Select
          id="blueprintId"
          placeholder="Select blueprint"
          onChange={(event) => {
            event.persist();
            setSelectedBlueprint(() => {
              const bp = blueprints.find((blE) => blE.node.id === event.target.value)?.node;
              if (bp != null) {
                const { id, template } = bp;
                return { id, template };
              }
              return null;
            });
          }}
        >
          {blueprints.map(({ node: blueprint }) => {
            return (
              <option key={blueprint.id} value={blueprint.id}>
                {blueprint.name}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <Wrap spacing={4}>
        {Object.keys(formValues).map((key) => {
          return (
            <WrapItem key={key}>
              <FormControl id={key} marginY={3}>
                <FormLabel>{key}</FormLabel>
                <Input
                  type="text"
                  value={formValues[key]}
                  onChange={(event) => {
                    event.persist();
                    setFormValues((prev) => {
                      return {
                        ...prev,
                        [key]: event.target.value,
                      };
                    });
                  }}
                />
              </FormControl>
            </WrapItem>
          );
        })}
      </Wrap>
      <FormControl>
        <Button
          type="button"
          onClick={() => {
            if (parsedTemplate != null) {
              const mountParameters = parsedTemplate(formValues);
              onFormSubmit(mountParameters);
            }
          }}
        >
          Save variables
        </Button>
      </FormControl>
    </Box>
  );
};

export default BlueprintForm;
