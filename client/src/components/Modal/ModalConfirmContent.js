import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';
import styles from './modal.module.css';

export class ModalContent extends Component {
  handleConfirmClick = event => {
    this.props.onConfirm(this.props.confirmArgument);
    this.props.closeModal();
  };

  render() {
    return ReactDOM.createPortal(
      <FocusTrap>
        <aside
          tag="aside"
          role="dialog"
          tabIndex="-1"
          aria-modal="true"
          className={styles.modalCover}
          onClick={this.props.onClickOutside}
          onKeyDown={this.props.onKeyDown}
        >
          <div className={styles.modalArea} ref={this.props.modalRef}>
            <button
              ref={this.props.buttonRef}
              aria-label="Close Modal"
              aria-labelledby="close-modal"
              className={styles.modalClose}
              onClick={this.props.closeModal}
            >
              <span id="close-modal" className={styles.hideVisual}>
                Close
              </span>
              <svg className={styles.modalCloseIcon} viewBox="0 0 40 40">
                <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
              </svg>
            </button>
            <div className={styles.modalBody}>{this.props.content}</div>
            <button
              onClick={this.handleConfirmClick}
              className="btn btn-danger"
            >
              Yes
            </button>
            <button onClick={this.props.closeModal} className="btn btn-default">
              No
            </button>
          </div>
        </aside>
      </FocusTrap>,
      document.body
    );
  }
}

export default ModalContent;
