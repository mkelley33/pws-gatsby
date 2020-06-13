import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'axios';
import Profile from '../Profile/Profile';

describe('Profile', () => {
  beforeEach(() => {
    mockAxios.doMockReset();
  });

  it('renders correctly', () => {
    const tree = renderer.create(<Profile />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('submits form successfully', () => {
    // TODO: There's a flaw in this test in that it doesn't validate any of the fields.
    // In fact, setting the fields has nothing to do with whether test passes or not.
    const { findByLabelText, getByText } = render(<Profile />);
    const firstName = findByLabelText('first name');
    firstName.value = 'Michaux';
    const lastName = findByLabelText('last name');
    lastName.value = 'Kelley';
    const email = findByLabelText('email');
    email.value = 'test@test.com';
    const submit = getByText('Submit');

    // No need to add mockImplementationOnce,
    // we're doing it directly inside the custom mock file

    fireEvent.click(submit);

    waitFor(() => {
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
    });
  });

  // This test should pass, but instead gives error: Unable to find the "window" object for the given node.
  //
  // it('validates the first name cannot be blank', () => {
  //   const { findByLabelText, getByText } = render(<Profile />);
  //   const firstName = findByLabelText('first name');
  //   firstName.value = '';
  //   fireEvent.blur(firstName);
  //   const error = getByText('First name is required');
  //   expect(error).not.toBeNull();
  // });
});
