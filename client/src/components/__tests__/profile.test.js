import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'axios';
import Profile from '../Profile/Profile';

describe('Profile', () => {
  // Pass a fake user with formik default values for use in mapPropsToValues
  const user = { userId: 1, firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

  beforeEach(() => {
    mockAxios.doMockReset();
  });

  it('renders correctly', () => {
    const tree = renderer.create(<Profile />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('submits form successfully', async () => {
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

  it('validates the first name cannot be blank', async () => {
    const { getByLabelText, getByText } = render(<Profile />);
    const firstName = getByLabelText(/first name/i);

    fireEvent.blur(firstName);

    let error;
    await waitFor(() => {
      error = getByText('First name is required');
    });

    expect(error).not.toBeNull();
  });

  it('validates the last name cannot be blank', async () => {
    const { getByLabelText, getByText } = render(<Profile />);
    const lastName = getByLabelText(/last name/i);

    fireEvent.blur(lastName);

    let error;
    await waitFor(() => {
      error = getByText('Last name is required');
    });

    expect(error).not.toBeNull();
  });

  it('validates email cannot be blank', async () => {
    const { getByLabelText, getByText } = render(<Profile />);
    const email = getByLabelText(/email/i);

    fireEvent.blur(email);

    let error;
    await waitFor(() => {
      error = getByText('Email is required');
    });

    expect(error).not.toBeNull();
  });

  it('validates that first name must be longer than one character', async () => {
    const { getByLabelText, getByText } = render(<Profile user={user} />);
    const firstName = getByLabelText(/first name/i);

    await waitFor(() => {
      fireEvent.change(firstName, {
        target: {
          value: 'M',
        },
      });
    });

    fireEvent.blur(firstName);

    let error;
    await waitFor(() => {
      error = getByText("C'mon, your first name is longer than that");
    });

    expect(error).not.toBeNull();
  });

  it('validates that last name must be longer than one character', async () => {
    const { getByLabelText, getByText } = render(<Profile user={user} />);
    const lastName = getByLabelText(/last name/i);

    await waitFor(() => {
      fireEvent.change(lastName, {
        target: {
          value: 'K',
        },
      });
    });

    fireEvent.blur(lastName);

    let error;
    await waitFor(() => {
      error = getByText("C'mon, your last name is longer than that");
    });

    expect(error).not.toBeNull();
  });

  it('validates email address must be correctly formatted', async () => {
    const { getByLabelText, getByText } = render(<Profile user={user} />);
    const email = getByLabelText(/email/i);

    await waitFor(() => {
      fireEvent.change(email, {
        target: {
          value: 'email at dot com',
        },
      });
    });

    fireEvent.blur(email);

    let error;
    await waitFor(() => {
      error = getByText('Invalid email address');
    });

    expect(error).not.toBeNull();
  });

  it('validates that new password must be at least 8 characters long', async () => {
    const { getByLabelText, getByText } = render(<Profile user={user} />);
    const password = getByLabelText(/new password/i);

    await waitFor(() => {
      fireEvent.change(password, {
        target: {
          value: 'p',
        },
      });
    });

    fireEvent.blur(password);

    let error;
    await waitFor(() => {
      error = getByText('Password has to be at least 8 characters!');
    });

    expect(error).not.toBeNull();
  });

  it('validates that new password must contain at least one uppercase letter', async () => {
    const { getByLabelText, getByText } = render(<Profile user={user} />);
    const password = getByLabelText(/new password/i);

    await waitFor(() => {
      fireEvent.change(password, {
        target: {
          value: 'asdfjkl;3',
        },
      });
    });

    fireEvent.blur(password);

    let error;
    await waitFor(() => {
      error = getByText(
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      );
    });

    expect(error).not.toBeNull();
  });

  it('validates that new password must contain at least one lowercase letter', async () => {
    const { getByLabelText, getByText } = render(<Profile user={user} />);
    const password = getByLabelText(/new password/i);

    await waitFor(() => {
      fireEvent.change(password, {
        target: {
          value: 'ASDFJKL;3',
        },
      });
    });

    fireEvent.blur(password);

    let error;
    await waitFor(() => {
      error = getByText(
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      );
    });

    expect(error).not.toBeNull();
  });

  it('validates that new password must contain at least one number', async () => {
    const { getByLabelText, getByText } = render(<Profile user={user} />);
    const password = getByLabelText(/new password/i);

    await waitFor(() => {
      fireEvent.change(password, {
        target: {
          value: 'ASDFJKLa;',
        },
      });
    });

    fireEvent.blur(password);

    let error;
    await waitFor(() => {
      error = getByText(
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      );
    });

    expect(error).not.toBeNull();
  });

  it('validates that new password must contain at least one special character', async () => {
    const { getByLabelText, getByText } = render(<Profile user={user} />);
    const password = getByLabelText(/new password/i);

    await waitFor(() => {
      fireEvent.change(password, {
        target: {
          value: 'ASDFJKLa3',
        },
      });
    });

    fireEvent.blur(password);

    let error;
    await waitFor(() => {
      error = getByText(
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      );
    });

    expect(error).not.toBeNull();
  });

  it('validates a well-formatted password', async () => {
    const { getByLabelText, queryByText } = render(<Profile user={user} />);
    const password = getByLabelText(/new password/i);

    await waitFor(() => {
      fireEvent.change(password, {
        target: {
          value: 'ASDFJKLa3!',
        },
      });
    });

    fireEvent.blur(password);

    let error;
    await waitFor(() => {
      error = queryByText(
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      );
    });

    expect(error).toBeNull();
  });

  it('validates that confirm password matches new password', async () => {
    const { getByLabelText, getByText } = render(<Profile user={user} />);
    const password = getByLabelText(/new password/i);
    const confirmPassword = getByLabelText(/confirm password/i);

    await waitFor(() => {
      fireEvent.change(password, {
        target: {
          value: 'ASDFJKLa3!',
        },
      });
      fireEvent.change(confirmPassword, {
        target: {
          value: 'ASDFJKLa3',
        },
      });
    });

    fireEvent.blur(confirmPassword);

    let error;
    await waitFor(() => {
      error = getByText('Passwords must match');
    });

    expect(error).not.toBeNull();
  });

  it('validates succesfully that confirm password matches new password', async () => {
    const { getByLabelText, queryByText } = render(<Profile user={user} />);
    const password = getByLabelText(/new password/i);
    const confirmPassword = getByLabelText(/confirm password/i);

    await waitFor(() => {
      fireEvent.change(password, {
        target: {
          value: 'ASDFJKLa3!',
        },
      });
      fireEvent.change(confirmPassword, {
        target: {
          value: 'ASDFJKLa3!',
        },
      });
    });

    fireEvent.blur(confirmPassword);

    let error;
    await waitFor(() => {
      error = queryByText('Passwords must match');
    });

    expect(error).toBeNull();
  });
});
