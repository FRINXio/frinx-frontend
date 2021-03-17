// @flow
import React, { Component } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';

type Props = {
  defaultPages: number,
  handler: (defaultPageCount: number, pageCount: number) => void,
  dataSize: number,
};

type StateType = {};

class PageCount extends Component<Props, StateType> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <ButtonGroup size="sm" isAttached colorScheme="blue">
          <Button
            variant={this.props.defaultPages === 10 ? 'solid' : 'outline'}
            onClick={() => {
              const dataSize = this.props.dataSize;
              let size = ~~(dataSize / 10);
              const pagesCount = dataSize === 0 ? 0 : dataSize % 10 ? ++size : size;
              this.props.handler(10, pagesCount);
            }}
          >
            10
          </Button>

          <Button
            variant={this.props.defaultPages === 20 ? 'solid' : 'outline'}
            onClick={() => {
              const dataSize = this.props.dataSize;
              let size = ~~(dataSize / 20);
              const pagesCount = dataSize === 0 ? 0 : dataSize % 20 ? ++size : size;
              this.props.handler(20, pagesCount);
            }}
          >
            20
          </Button>
          <Button
            variant={this.props.defaultPages === 50 ? 'solid' : 'outline'}
            onClick={() => {
              const dataSize = this.props.dataSize;
              let size = ~~(dataSize / 50);
              const pagesCount = dataSize === 0 ? 0 : dataSize % 50 ? ++size : size;
              this.props.handler(50, pagesCount);
            }}
          >
            50
          </Button>
        </ButtonGroup>
      </>
    );
  }
}

export default PageCount;
