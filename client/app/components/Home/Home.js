import React, { Component } from 'react'
import 'whatwg-fetch'

import {
  getFromStorage,
  setInStorage
} from '../../utils/storage'
import { isThisISOWeek } from 'date-fns'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      signUpError: '',
      signInError: '',
      token: '',
      masterError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: ''
    }

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this)
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this)
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this)
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this)
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this)
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this)

    this.onSignIn = this.onSignIn.bind(this)
    this.onSignUp = this.onSignUp.bind(this)
  }

  onTextboxChangeSignInEmail (event) {
    this.setState({
      signInEmail: event.target.value
    })
  }
  onTextboxChangeSignInPassword (event) {
    this.setState({
      signInPassword: event.target.value
    })
  }

  onTextboxChangeSignUpEmail (event) {
    this.setState({
      signupEmail: event.target.value
    })
  }

  onTextboxChangeSignUpPassword (event) {
    this.setState({
      signupPassword: event.target.value
    })
  }

  onTextboxChangeSignUpFirstName (event) {
    this.setState({
      signupFirstName: event.target.value
    })
  }
  onTextboxChangeSignUpLastName (event) {
    this.setState({
      signupLastName: event.target.value
    })
  }

  onSignUp () {
    // grab state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state

    this.setState({
      isLoading: true
    })
    // validate
    // post request to backend
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        password: signUpPassword,
        email: signUpEmail
      })
    })
      .then(res => res.json)
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signupEmail: '',
            signUpFirstName: '',
            signUpLastName: '',
            signUpPassword: ''
          })
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false
          })
        }
      })
  }

  onSignIn () {

  }

  componentDidMount () {
    const obj = getFromStorage('token')
    if (obj && obj.token) {
      const { token } = obj
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json)
        .then(json => {
          if (json.success) {
            this.setState({
              token: json.token, 
              isLoading: false
            })
          } else {
            this.setState({
              isLoading: false
            })
          }
        })
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  render () {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
      signUpError
    } = this.state
    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }
    if (!token) {
      return (
        <div>
          <div>
            {
              (signInError) ? (<p>{signInError}</p>) : (null)
            }
            <p>Sign In</p>
            <input type='email'
              placeholder='Email'
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
            <br />
            <input type='password'
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br />
          <br />
          <div>
            {
              (signUpError) ? (<p>{signUpError}</p>) : (null)
            }
            <p>Sign Up</p>
            <input
              type='text'
              placeholder='first name'
              value={signUpFirstName}
              onChange={this.onTextboxChangeSignUpFirstName}
            /><br />
            <input
              type='text'
              placeholder='last name'
              value={signUpLastName}
              onChange={this.onTextboxChangeSignUpLastName}
            /><br />
            <input
              type='email'
              placeholder='Email'
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            /><br />
            <input
              type='password'
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            /><br />
            <button oncClick={this.onSignUp}>Sign Up </button>
          </div>
        </div>
      )
    }

    return (
      <div>
        <p>Account</p>
      </div>
    )
  }
}

export default Home
