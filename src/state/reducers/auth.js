import jwtDecode from 'jwt-decode'
import { combineReducers } from 'redux'

import * as types from 'state/types/auth'


const token = (state = null, action) => {
    switch(action.type) {
        case types.AUTHENTICATION_STARTED: {
            return null
        }
        case types.AUTHENTICATION_COMPLETED: {
            return action.payload.token
        }
        case types.TOKEN_REFRESH_COMPLETED: {
            return action.payload.newToken
        }
        case types.AUTHENTICATION_FAILED: {
            return null
        }
        case types.AUTHENTICATION_IDENTITY_CLEARED: {
            return null
        }
        default: {
            return state
        }
    }
}

const isAuthenticating = (state = false, action) => {
    switch (action.type) {
        case types.AUTHENTICATION_STARTED: {
            return true
        }
        case types.AUTHENTICATION_COMPLETED: {
            return false
        }
        case types.AUTHENTICATION_FAILED: {
            return false
        }
        default: {
            return state
        }
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case types.AUTHENTICATION_STARTED: {
            return null
        }
        case types.AUTHENTICATION_COMPLETED: {
            return null
        }
        case types.AUTHENTICATION_FAILED: {
            return action.payload.error
        }
        case types.SIGN_UP_STARTED: {
            return null
        }
        case types.SIGN_UP_COMPLETED: {
            return null
        }
        case types.SIGN_UP_FAILED: {
            return action.payload.error
        }
        default: {
            return state
        }
    }
}

const decoded = (state = null, action) => {
    switch (action.type) {
        case types.AUTHENTICATION_STARTED: {
            return null
        }
        case types.AUTHENTICATION_COMPLETED: {
            return jwtDecode(action.payload.token)
        }
        case types.TOKEN_REFRESH_COMPLETED: {
            return jwtDecode(action.payload.newToken)
        }
        case types.AUTHENTICATION_FAILED: {
            return null
        }
        case types.AUTHENTICATION_IDENTITY_CLEARED: {
            return null
        }
        default: {
            return state
        }
    }
}

const isSigningUp = (state = false, action) => {
    switch(action.type) {
        case types.SIGN_UP_STARTED: {
            return true
        }
        case types.SIGN_UP_COMPLETED: {
            return false
        }
        case types.SIGN_UP_FAILED: {
            return false
        }
        default: {
            return state
        }
    }
}

const isRefreshing = (state = false, action) => {
    switch(action.type) {
        case types.TOKEN_REFRESH_STARTED: {
            return true
        }
        case types.TOKEN_REFRESH_COMPLETED: {
            return false
        }
        case types.TOKEN_REFRESH_FAILED: {
            return false
        }
        default: {
            return state
        }
    }
}

const refreshingError = (state = null, action) => {
    switch(action.type) {
        case types.TOKEN_REFRESH_STARTED: {
            return null
        }
        case types.TOKEN_REFRESH_COMPLETED: {
            return null
        }
        case types.TOKEN_REFRESH_FAILED: {
            return action.payload.error
        }
        default: {
            return state
        }
    }
}

const firebaseUserUID = (state = null, action) => {
    switch(action.type) {
        case types.FIREBASE_USER_UID_SETTED: {
            return action.payload.uid
        }
        case types.AUTHENTICATION_IDENTITY_CLEARED: {
            return null
        }
        default: {
            return state
        }
    }
}


const auth = combineReducers({
    token,
    isSigningUp,
    isAuthenticating,
    error,
    decoded,
    isRefreshing,
    refreshingError,
    firebaseUserUID,
})

export default auth

export const getToken = state => state.token
export const getIsAuthenticating = state => state.isAuthenticating
export const getAuthenticatingError = state => state.error
export const getAuthUserID = state => state.decoded ? state.decoded.user_id : null
export const getAuthUsername = state => state.decoded ? state.decoded.username : null
export const getAuthExpiration = state => state.decoded ? state.decoded.exp : null
export const getIsRefreshingToken = state => state.isRefreshing
export const getRefreshingError = state => state.refreshingError
export const getIsSigningUp = state => state.isSigningUp
export const getFirebaseUserUID = state => state.firebaseUserUID
