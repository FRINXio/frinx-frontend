import React, { ReactNode } from 'react';
import DecisionInputForm from './decision-input-form';
import EventInputForm from './event-input-form';
import GraphQLInputsForm from './graphql-inputs-form';
import HTTPInputsForm from './http-inputs-form';
import LambdaInputsForm from './lambda-inputs-form';
import TerminateInputForm from './terminate-input-form';
import WhileInputForm from './while-input-form';
import GenericInputForm from './generic-input-form';
import { InputParameters, Task } from '../../helpers/types';
import { isGraphQLTaskInputParams, isHttpTaskInputParams, isLambdaTaskInputParams } from '../../helpers/task.helpers';

export function renderInputParamForm(task: Task, setState: (p: InputParameters) => void): ReactNode | null {
  if ('inputParameters' in task) {
    if (task.type === 'DECISION') {
      return <DecisionInputForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'SIMPLE') {
      if (isGraphQLTaskInputParams(task.inputParameters)) {
        return <GraphQLInputsForm params={task.inputParameters} onChange={setState} />;
      }
      if (isHttpTaskInputParams(task.inputParameters)) {
        return <HTTPInputsForm params={task.inputParameters} onChange={setState} />;
      }
      if (isLambdaTaskInputParams(task.inputParameters)) {
        return <LambdaInputsForm params={task.inputParameters} onChange={setState} />;
      }
      return <GenericInputForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'HTTP') {
      return <HTTPInputsForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'SUB_WORKFLOW') {
      return <GenericInputForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'DO_WHILE') {
      return <WhileInputForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'TERMINATE') {
      return <TerminateInputForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'EVENT') {
      return <EventInputForm params={task.inputParameters} onChange={setState} />;
    }
    return <GenericInputForm params={task.inputParameters} onChange={setState} />;
  }
  return null;
}
