import React, { Component } from 'react';
import ModalConfirmContent from './ModalConfirmContent';
import ModalTrigger from './ModalTrigger';

import styles from './modal.module.css';

export class Modal extends Component {
  state = {
    isShown: false,
  };

  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
    });
    this.toggleScrollLock();
  };

  closeModal = () => {
    this.setState({ isShown: false });
    this.TriggerButton.focus();
    this.toggleScrollLock();
  };

  onKeyDown = event => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  onClickOutside = event => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  toggleScrollLock = () => {
    document.querySelector('html').classList.toggle(styles.scrollLock);
  };

  render() {
    return (
      <React.Fragment>
        <ModalTrigger
          showModal={this.showModal}
          buttonRef={n => (this.TriggerButton = n)}
          triggerText={this.props.modalProps.triggerText}
          modalButtonClassName={this.props.modalButtonClassName}
        />
        {this.state.isShown ? (
          <ModalConfirmContent
            modalRef={n => (this.modal = n)}
            buttonRef={n => (this.closeButton = n)}
            closeModal={this.closeModal}
            content={this.props.modalContent}
            confirmArgument={this.props.confirmArgument}
            onConfirm={this.props.onConfirm}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
          />
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}

export default Modal;
