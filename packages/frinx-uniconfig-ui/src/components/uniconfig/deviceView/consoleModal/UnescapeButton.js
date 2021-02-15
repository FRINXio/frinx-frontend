import React, { Component } from 'react';
import unescapeJs from 'unescape-js';
import Button from 'react-bootstrap/Button';

class UnescapeButton extends Component {
  constructor(props) {
    super(props);
    this.doUnescape = this.doUnescape.bind(this);
    this.state = {
      isUnescaped: false,
    };
  }

  doUnescape() {
    let newval = !this.state.isUnescaped;
    this.setState({
      isUnescaped: newval,
    });
    this.forceUpdate();
    if (!this.state.isUnescaped) {
      document
        .getElementById(this.props.target)
        .setAttribute('data-escaped', document.getElementById(this.props.target).innerHTML);
      document.getElementById(this.props.target).innerHTML = unescapeJs(
        document.getElementById(this.props.target).innerHTML,
      );
    } else {
      document.getElementById(this.props.target).innerHTML = document
        .getElementById(this.props.target)
        .getAttribute('data-escaped');
    }
  }

  render() {
    return (
      <Button size={this.props.size} onClick={(e) => this.doUnescape()}>
        {this.state.isUnescaped ? 'Escape' : 'Unescape'}
      </Button>
    );
  }
}

export default UnescapeButton;
