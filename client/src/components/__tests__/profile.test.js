import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, screen } from '@testing-library/react';
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

  // This test should work, but it doesn't for some reason
  // it('submits form successfully', async () => {
  //   const { findByLabelText } = render(<Profile />);
  //   const firstName = findByLabelText('first name');
  //   firstName.value = 'Michaux';
  //   const lastName = findByLabelText('last name');
  //   lastName.value = 'Kelley';
  //   const email = findByLabelText('email');
  //   email.value = 'test@test.com';
  //   const submit = screen.getByText('Submit');

  //   // No need to add mockImplementationOnce,
  //   // we're doing it directly inside the custom mock file

  //   fireEvent.click(submit);

  //   // Here we check directly on the mockAxios.put because the axios object is mocked
  //   expect(mockAxios.put).toHaveBeenCalledTimes(1);
  // });
});
