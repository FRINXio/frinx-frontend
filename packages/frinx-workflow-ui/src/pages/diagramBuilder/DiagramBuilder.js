// @flow
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { WorkflowBuilder } from '@frinx/workflow-builder';
import { GlobalContext } from '../../common/GlobalContext';

const DiagramBuilder = () => {
  const { name, version } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const context = useContext(GlobalContext);

  useEffect(() => {
    fetch(context.backendApiUrlPrefix + '/metadata/workflow/' + name + '/' + version)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setWorkflow(data.result);
      });
  }, []);

  return workflow != null ? <WorkflowBuilder workflow={workflow} /> : null;
};

export default DiagramBuilder;
