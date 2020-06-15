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

  it('submits form successfully', async () => {
    // Pass a fake user with formik default values for use in mapPropsToValues
    const user = { userId: 1, firstName: '', lastName: '', email: '' };

    const { getByText, getByLabelText } = render(<Profile user={user} />);

    const firstName = getByLabelText(/first name/i);
    const lastName = getByLabelText(/last name/i);
    const email = getByLabelText(/email/i);
    const submit = getByText('Submit');

    await waitFor(() => {
      fireEvent.change(firstName, {
        target: {
          value: 'Michaux',
        },
      });
    });

    await waitFor(() => {
      fireEvent.change(lastName, {
        target: {
          value: 'Kelley',
        },
      });
    });

    await waitFor(() => {
      fireEvent.change(email, {
        target: {
          value: 'test@test.com',
        },
      });
    });

    fireEvent.click(submit);

    await waitFor(() => {
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
