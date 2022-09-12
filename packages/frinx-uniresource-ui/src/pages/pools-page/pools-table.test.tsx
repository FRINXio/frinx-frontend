import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { BrowserRouter } from 'react-router-dom';
import PoolsTable from './pools-table';
import { ResourcePool } from '../../__generated__/graphql';

faker.seed(123);

const pools: ResourcePool[] = [
  {
    id: faker.datatype.uuid(),
    allocatedResources: null,
    AllocationStrategy: null,
    Capacity: {
      freeCapacity: '1000',
      utilizedCapacity: '1000',
    },
    Name: faker.random.words(2),
    ParentResource: null,
    PoolProperties: null,
    PoolType: 'allocating',
    Resources: [],
    ResourceType: {
      id: faker.datatype.uuid(),
      Name: faker.commerce.productName(),
      Pools: [],
      PropertyTypes: [],
    },
    Tags: [],
  },
];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleDelete = () => {};

describe('Inventory app', () => {
  test('should render device table', () => {
    render(
      <BrowserRouter>
        <PoolsTable isLoading={false} onDeleteBtnClick={handleDelete} pools={pools} />
      </BrowserRouter>,
    );
    expect(screen.getByRole('table')).toBeDefined();
  });
});
