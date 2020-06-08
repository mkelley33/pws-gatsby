import React, { Component } from 'react';

export default class CheckboxGroup extends Component {
  handleChange = event => {
    const target = event.currentTarget;
    let valueArray = [...this.props.value] || [];
    if (target.checked) {
      valueArray.push(target.value);
    } else {
      valueArray.splice(valueArray.indexOf(target.value), 1);
    }
    this.props.onChange(this.props.id, valueArray);
  };

  render() {
    const { value, children } = this.props;
    return (
      <div className={this.props.className}>
        {React.Children.map(children, child => {
          return React.cloneElement(child, {
            field: {
              value: value.includes(child.props.id),
              onChange: this.handleChange
            }
          });
        })}
      </div>
    );
  }
}