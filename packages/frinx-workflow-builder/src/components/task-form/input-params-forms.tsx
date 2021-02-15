import React, { ReactNode } from 'react';
import DecisionInputForm from './decision-input-form';
import DynamicForkInputForm from './dynamic-fork-input-form';
import EventInputForm from './event-input-form';
import GraphQLInputsForm from './graphql-inputs-form';
import HTTPInputsForm from './http-inputs-form';
import LambdaInputsForm from './lambda-inputs-form';
import TerminateInputForm from './terminate-input-form';
import WhileInputForm from './while-input-form';
import { GraphQLInputParams, HTTPInputParams, InputParameters, LambdaInputParams, Task } from '../../helpers/types';

const isHttpTaskInputParams = (params: InputParameters): params is HTTPInputParams => 'http_request' in params;
const isGraphQLTaskInputParams = (params: InputParameters): params is GraphQLInputParams =>
  'http_request' in params && 'body' in params.http_request && typeof params.http_request.body === 'object';
const isLambdaTaskInputParams = (params: InputParameters): params is LambdaInputParams => 'lambdaValue' in params;

export function renderInputParamForm(task: Task, setState: (p: InputParameters) => void): ReactNode | null {
  if ('inputParameters' in task) {
    if (task.type === 'DECISION') {
      return <DecisionInputForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'SIMPLE' && isGraphQLTaskInputParams(task.inputParameters)) {
      return <GraphQLInputsForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'SIMPLE' && isHttpTaskInputParams(task.inputParameters)) {
      return <HTTPInputsForm params={task.inputParameters} onChange={setState} />;
    }
    if (isLambdaTaskInputParams(task.inputParameters)) {
      return <LambdaInputsForm params={task.inputParameters} onChange={setState} />;
    }
    if (task.type === 'SUB_WORKFLOW') {
      return <DynamicForkInputForm params={task.inputParameters} onChange={setState} />;
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
  }
  return null;
}
