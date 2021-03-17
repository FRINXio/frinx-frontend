// @flow
import React, { Component } from 'react';
import { Flex } from '@chakra-ui/react';
import { Next, PageGroup, Paginator, Previous } from 'chakra-paginator';

type Props = {
  viewedPage: number,
  defaultPages: number,
  count: number,
  indent: number,
  handler: (defaultPageCount: number, pageCount?: number) => void,
  dataSize: number,
};

type StateType = {};

class PageSelect extends Component<Props, StateType> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Paginator
        activeStyles={{
          width: 45,
        }}
        normalStyles={{
          width: 45,
        }}
        currentPage={this.props.viewedPage}
        onPageChange={(nextPage) => {
          this.props.handler(nextPage);
        }}
        pagesQuantity={this.props.count || 1}
      >
        <Flex>
          <Previous>{'<'}</Previous>
          <PageGroup isInline align="center" />
          <Next>{'>'}</Next>
        </Flex>
      </Paginator>
    );
  }
}

export default PageSelect;
