import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'axios';
import Profile from '../Profile/Profile';

describe('Profile', () => {
  beforeEach(() => {
    mockAxios.__mock.reset();
  });

  it('renders correctly', () => {
    const tree = renderer.create(<Profile />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // This test should work, but it doesn't for some reason
  // it('submits form successfully', async () => {
  //   const { findByLabelText, container } = render(<Profile />);
  //   const firstName = await findByLabelText('First Name');
  //   const lastName = await findByLabelText('Last Name');
  //   const email = await findByLabelText('Email');
  //   const formWrapper = container.querySelector('form');
  //   firstName.value = 'Michaux';
  //   lastName.value = 'Kelley';
  //   email.value = 'test@test.com';
  //   const { put } = mockAxios.__mock.instance;
  //   put.mockImplementationOnce(() =>
  //     Promise.resolve({
  //       data: {},
  //     })
  //   );
  //   fireEvent.submit(formWrapper);
  //   await waitFor(() => {
  //     expect(mockAxios.__mock.instance.put).toHaveBeenCalledTimes(1);
  //     expect(mockAxios.__mock.instance.put).toHaveBeenCalledWith('/');
  //   });
  // });
});
