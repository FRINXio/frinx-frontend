import React, { ReactNode } from 'react';
import DecisionInputForm from './decision-input-form';
import EventInputForm from './event-input-form';
import GraphQLInputsForm from './graphql-input-form';
import KafkaInputsForm from './kafka-input-form';
import JsonInputsForm from './json-input-form';
import HTTPInputsForm from './http-input-form';
import LambdaInputsForm from './lambda-input-form';
import TerminateInputForm from './terminate-input-form';
import WhileInputForm from './while-input-form';
import GenericInputForm from './generic-input-form';
import { ExtendedTask, InputParameters } from '../../helpers/types';
import { isGraphQLTaskInputParams, isHttpTaskInputParams, isLambdaTaskInputParams } from '../../helpers/task.helpers';
import RawInputForm from './raw-input-form';

export function renderInputParamForm(
  task: ExtendedTask,
  setState: (p: InputParameters) => void,
  tasks: ExtendedTask[],
  setIsValid: (isValid: boolean) => void,
): ReactNode | null {
  if ('inputParameters' in task) {
    if (task.type === 'DECISION') {
      return <DecisionInputForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'LAMBDA') {
      return <LambdaInputsForm params={task.inputParameters} onChange={setState} tasks={tasks} task={task} />;
    }
    if (task.type === 'HTTP') {
      return <HTTPInputsForm params={task.inputParameters} onChange={setState} tasks={tasks} task={task} />;
    }
    if (task.type === 'KAFKA_PUBLISH') {
      return <KafkaInputsForm params={task.inputParameters} onChange={setState} tasks={tasks} task={task} />;
    }
    if (task.type === 'JSON_JQ_TRANSFORM') {
      return (
        <JsonInputsForm
          params={task.inputParameters}
          onChange={setState}
          onValidation={setIsValid}
          tasks={tasks}
          task={task}
        />
      );
    }
    if (task.type === 'SIMPLE') {
      if (isGraphQLTaskInputParams(task.inputParameters)) {
        return <GraphQLInputsForm params={task.inputParameters} onChange={setState} tasks={tasks} task={task} />;
      }
      if (isHttpTaskInputParams(task.inputParameters)) {
        return <HTTPInputsForm params={task.inputParameters} onChange={setState} tasks={tasks} task={task} />;
      }
      if (isLambdaTaskInputParams(task.inputParameters)) {
        return <LambdaInputsForm params={task.inputParameters} onChange={setState} tasks={tasks} task={task} />;
      }
      return <GenericInputForm params={task.inputParameters} onChange={setState} tasks={tasks} task={task} />;
    }
    if (task.type === 'SUB_WORKFLOW') {
      return <GenericInputForm params={task.inputParameters} onChange={setState} tasks={tasks} task={task} />;
    }
    if (task.type === 'DO_WHILE') {
      return <WhileInputForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'TERMINATE') {
      return <TerminateInputForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'EVENT') {
      return <EventInputForm params={task.inputParameters} onChange={setState} tasks={tasks} task={task} />;
    }
    if (task.type === 'RAW') {
      return <RawInputForm params={task.inputParameters} onChange={setState} />;
    }
    return null;
  }
  return null;
}
