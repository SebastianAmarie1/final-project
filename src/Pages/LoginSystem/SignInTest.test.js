import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SignIn from './SignIn'
import { useAuth } from '../../Contexts/AuthContext'

jest.mock('../../Contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}))

jest.mock('../../Contexts/axiosConfig', () => ({
  post: jest.fn(),
}))

describe('SignIn component', () => {
  beforeEach(() => {
    useAuth.mockImplementation(() => ({
      setUser: jest.fn(),
      setFlag: jest.fn(),
    }))
  })

  it('renders SignIn component without errors', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    )

    expect(screen.getByText('Sign Into Your Account'))
  })

  it('handles form input changes', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)

    userEvent.type(usernameInput, 'testuser')
    userEvent.type(passwordInput, 'testpassword')

    expect(usernameInput).toHaveValue('testuser')
    expect(passwordInput).toHaveValue('testpassword')
  })

  it('submits the form and calls axios post with correct data', async () => {
    const axios = require('../../Contexts/axiosConfig');
    axios.post.mockResolvedValue({ data: { status: 'Login Successful' } });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByText("Sign In");

    userEvent.type(usernameInput, 'testuser');
    userEvent.type(passwordInput, 'testpassword');
    userEvent.click(signInButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(axios.post).toHaveBeenCalledWith('/api/login', expect.objectContaining({
      username: 'testuser',
      password: 'testpassword',
    }), expect.objectContaining({
      withCredentials: true,
    }));
  });

})

/*
Rendering the SignIn component without errors.
Testing the input changes for the username and password fields.
Testing the form submission and axios post call with correct data.
*/