import React, { ReactNode } from 'react';
import { FormikErrors } from 'formik';
import * as yup from 'yup';
import DecisionInputForm, { DecisionInputParamsSchema } from './decision-input-form';
import EventInputForm, { EventInputParamsSchema } from './event-input-form';
import GraphQLInputsForm, { GraphQLInputParamsSchema } from './graphql-input-form';
import KafkaInputsForm, { KafkaPublishInputParamsSchema } from './kafka-input-form';
import JsonInputsForm, { JsonJQNInputParamsSchema } from './json-input-form';
import HTTPInputsForm, { HttpInputParamsSchema } from './http-input-form';
import LambdaInputsForm, { LambdaInputParamsSchema } from './lambda-input-form';
import TerminateInputForm, { TerminateInputParamsSchema } from './terminate-input-form';
import WhileInputForm, { WhileInputParamsSchema } from './while-input-form';
import GenericInputForm from './generic-input-form';
import {
  DecisionInputParams,
  EventInputParams,
  ExtendedTask,
  GraphQLInputParams,
  HTTPInputParams,
  InputParameters,
  JsonJQInputParams,
  KafkaPublishInputParams,
  LambdaInputParams,
  RawInputParams,
  TerminateInputParams,
  WhileInputParams,
} from '../../helpers/types';
import { isGraphQLTaskInputParams, isHttpTaskInputParams, isLambdaTaskInputParams } from '../../helpers/task.helpers';
import RawInputForm, { RawInputParamsSchema } from './raw-input-form';

const SettingsSchema = yup.object().shape({
  taskReferenceName: yup.string().required('Please enter task reference name'),
  startDelay: yup.number().required('Please enter start delay'),
});

export function getValidationSchema(task: ExtendedTask) {
  switch (task.type) {
    case 'HTTP':
      return SettingsSchema.concat(HttpInputParamsSchema);
    case 'DECISION':
      return SettingsSchema.concat(DecisionInputParamsSchema);
    case 'LAMBDA':
      return SettingsSchema.concat(LambdaInputParamsSchema);
    case 'EVENT':
      return SettingsSchema.concat(EventInputParamsSchema);
    case 'DO_WHILE':
      return SettingsSchema.concat(WhileInputParamsSchema);
    case 'RAW':
      return SettingsSchema.concat(RawInputParamsSchema);
    case 'TERMINATE':
      return SettingsSchema.concat(TerminateInputParamsSchema);
    case 'KAFKA_PUBLISH':
      return SettingsSchema.concat(KafkaPublishInputParamsSchema);
    case 'JSON_JQ_TRANSFORM':
      return SettingsSchema.concat(JsonJQNInputParamsSchema);
    case 'SIMPLE':
      if (isHttpTaskInputParams(task.inputParameters)) {
        return SettingsSchema.concat(HttpInputParamsSchema);
      }
      if (isGraphQLTaskInputParams(task.inputParameters)) {
        return SettingsSchema.concat(GraphQLInputParamsSchema);
      }
      return SettingsSchema;
    default:
      return SettingsSchema;
  }
}

export function renderInputParamForm(
  task: ExtendedTask,
  errors: FormikErrors<ExtendedTask>,
  onChange: (p: InputParameters) => void,
  tasks: ExtendedTask[],
): ReactNode | null {
  if ('inputParameters' in task) {
    if (task.type === 'DECISION') {
      const decisionInputErrors = errors as FormikErrors<{ inputParameters: DecisionInputParams }>;
      return <DecisionInputForm params={task.inputParameters} errors={decisionInputErrors} onChange={onChange} />;
    }
    if (task.type === 'LAMBDA') {
      const lambdaInputErrors = errors as FormikErrors<{ inputParameters: LambdaInputParams }>;
      return (
        <LambdaInputsForm
          params={task.inputParameters}
          errors={lambdaInputErrors}
          onChange={onChange}
          tasks={tasks}
          task={task}
        />
      );
    }
    if (task.type === 'HTTP') {
      const httpInputErrors = errors as FormikErrors<{ inputParameters: HTTPInputParams }>;
      return (
        <HTTPInputsForm
          params={task.inputParameters}
          errors={httpInputErrors}
          onChange={onChange}
          tasks={tasks}
          task={task}
        />
      );
    }
    if (task.type === 'KAFKA_PUBLISH') {
      const kafkaInputErrors = errors as FormikErrors<{ inputParameters: KafkaPublishInputParams }>;
      return (
        <KafkaInputsForm
          params={task.inputParameters}
          errors={kafkaInputErrors}
          onChange={onChange}
          tasks={tasks}
          task={task}
        />
      );
    }
    if (task.type === 'JSON_JQ_TRANSFORM') {
      const jsonInputErrors = errors as FormikErrors<{ inputParameters: JsonJQInputParams }>;
      return (
        <JsonInputsForm
          params={task.inputParameters}
          errors={jsonInputErrors}
          onChange={onChange}
          tasks={tasks}
          task={task}
        />
      );
    }
    if (task.type === 'SIMPLE') {
      if (isGraphQLTaskInputParams(task.inputParameters)) {
        const graphQLInputErrors = errors as FormikErrors<{ inputParameters: GraphQLInputParams }>;
        return (
          <GraphQLInputsForm
            params={task.inputParameters}
            errors={graphQLInputErrors}
            onChange={onChange}
            tasks={tasks}
            task={task}
          />
        );
      }
      if (isHttpTaskInputParams(task.inputParameters)) {
        const httpInputErrors = errors as FormikErrors<{ inputParameters: HTTPInputParams }>;
        return (
          <HTTPInputsForm
            params={task.inputParameters}
            errors={httpInputErrors}
            onChange={onChange}
            tasks={tasks}
            task={task}
          />
        );
      }
      if (isLambdaTaskInputParams(task.inputParameters)) {
        const lambdaInputErrors = errors as FormikErrors<{ inputParameters: LambdaInputParams }>;
        return (
          <LambdaInputsForm
            params={task.inputParameters}
            errors={lambdaInputErrors}
            onChange={onChange}
            tasks={tasks}
            task={task}
          />
        );
      }
      return <GenericInputForm params={task.inputParameters} onChange={onChange} tasks={tasks} task={task} />;
    }
    if (task.type === 'SUB_WORKFLOW') {
      return <GenericInputForm params={task.inputParameters} onChange={onChange} tasks={tasks} task={task} />;
    }
    if (task.type === 'DO_WHILE') {
      const whileInputErrors = errors as FormikErrors<{ inputParameters: WhileInputParams }>;
      return <WhileInputForm params={task.inputParameters} errors={whileInputErrors} onChange={onChange} />;
    }
    if (task.type === 'TERMINATE') {
      const terminateInputErrors = errors as FormikErrors<{ inputParameters: TerminateInputParams }>;
      return <TerminateInputForm params={task.inputParameters} errors={terminateInputErrors} onChange={onChange} />;
    }
    if (task.type === 'EVENT') {
      const eventInputErrors = errors as FormikErrors<{ inputParameters: EventInputParams }>;
      return (
        <EventInputForm
          params={task.inputParameters}
          errors={eventInputErrors}
          onChange={onChange}
          tasks={tasks}
          task={task}
        />
      );
    }
    if (task.type === 'RAW') {
      const rawInputErrors = errors as FormikErrors<{ inputParameters: RawInputParams }>;
      return <RawInputForm params={task.inputParameters} errors={rawInputErrors} onChange={onChange} />;
    }
    return null;
  }
  return null;
}
