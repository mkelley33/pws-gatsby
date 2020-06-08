import React, { Component } from 'react';

class ModalTrigger extends Component {
  render() {
    return (
      <button
        type="button"
        ref={this.props.buttonRef}
        onClick={this.props.showModal}
        className={this.props.modalButtonClassName}
      >
        {this.props.triggerText}
      </button>
    );
  }
}

export default ModalTrigger;
