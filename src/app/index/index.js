
import React, { useState } from 'react'
import { connect } from 'react-redux'


import Modal from 'react-native-modal'
import { Field, reduxForm } from 'redux-form'
import auth from '@react-native-firebase/auth'
import { launchImageLibrary } from 'react-native-image-picker'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { faEnvelope, faUser, faLock, faCamera } from '@fortawesome/free-solid-svg-icons'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import { TouchableOpacity, ImageBackground, StyleSheet, Dimensions, View, Text, TextInput, Image } from 'react-native'


import { layoutColors } from 'src/settings'
import * as actions from 'state/actions/auth'
import background from 'assets/index-background.jpg'


const FormInput = props => {
    const {
        input: { onChange, ...restInput },
        meta: { error, ...restMeta },
        style,
        ...restProps
    } = props

    return (
        <TextInput
            onChangeText={ onChange }
            { ...restInput }
            style={ style }
            { ...restProps }
        />
    )
}

const Index = ({
    handleSubmit,
    login,
    signUp,
    getInfoFromFBToken,
    getInfoFromGoogleToken,
}) => {
    const [isModalVisible, setModalVisible] = useState(false)
    const toggleModal = () => setModalVisible(!isModalVisible)

    const [isModalVisible2, setModalVisible2] = useState(false)
    const toggleModal2 = () => setModalVisible2(!isModalVisible2)

    const deviceWidth = Dimensions.get('window').width
    const deviceHeight = Dimensions.get('window').height

    GoogleSignin.configure()

    const loginWithFacebook = type => {
        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            login => {
                if (login.isCancelled) {
                    console.log('Login cancelled')
                } else {
                    AccessToken.getCurrentAccessToken().then(data => getInfoFromFBToken(data.accessToken.toString(), type))
                }
            },
            error => {
                console.log('Login fail with error: ' + error)
            },
        )
    }

    const loginWithGoogle = async(type) => {
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            getInfoFromGoogleToken(userInfo, type)
        } catch (error) {
            console.log('Login fail with error: ' + error)
        }
    }

    return (
        <ImageBackground source={ background } style={ styles.image }>
            <View style={ styles.bottom }>
                <View>
                    <TouchableOpacity style={ styles.btnSignUp } onPress={ toggleModal }>
                        <Text style={ styles.txtSignUp }>Registrarme</Text>
                    </TouchableOpacity>

                    <Modal
                        isVisible={ isModalVisible }
                        style={ styles.bottomModal }
                        onBackdropPress={ toggleModal }
                        backdropOpacity={ 0 }
                        deviceWidth={ deviceWidth }
                        deviceHeight={ deviceHeight }>
                        <View style={ styles.signUpModal }>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={ styles.viewTxtNewAccount }>
                                    <Text style={ styles.txtNewAccount }>Nueva Cuenta</Text>
                                </View>
                                <View style={{ width: '40%', marginLeft: '10%', marginTop: '2%', alignItems: 'center' }}>
                                    <View style={ styles.uploadImage }>
                                        <TouchableOpacity
                                            onPress={() =>
                                                launchImageLibrary(
                                                    {
                                                        mediaType: 'photo',
                                                        includeBase64: false,
                                                        maxHeight: 200,
                                                        maxWidth: 200,
                                                    },
                                                    response => {
                                                        setResponse(response)
                                                    },
                                                )
                                            }>
                                            <FontAwesomeIcon icon={ faCamera } size={ 25 } />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={ styles.txtInputs }>Subir foto</Text>
                                </View>
                            </View>
                            <View style={ styles.inputsView }>
                                <Text style={ styles.txtInputs }>Email</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <FontAwesomeIcon icon={ faEnvelope } />
                                    <Field
                                        component={ FormInput }
                                        name='signUpEmail'
                                        style={ styles.inputs }
                                        autoCapitalize='none'
                                    />
                                </View>
                            </View>
                            <View style={ styles.inputsView }>
                                <Text style={ styles.txtInputs }>Usuario</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <FontAwesomeIcon icon={ faUser } />
                                    <Field
                                        component={ FormInput }
                                        name='signUpUsername'
                                        style={ styles.inputs }
                                        autoCapitalize='none'
                                    />
                                </View>
                            </View>
                            <View style={ styles.inputsView }>
                                <Text style={ styles.txtInputs }>Contraseña</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <FontAwesomeIcon icon={ faLock } />
                                    <Field
                                        component={ FormInput }
                                        name='signUpPassword'
                                        style={ styles.inputs }
                                        autoCapitalize='none'
                                        secureTextEntry={ true }
                                    />
                                </View>
                            </View>
                            <View style={ styles.bottomSignUp }>
                                <TouchableOpacity style={ styles.btnSignUp } onPress={ handleSubmit(signUp) }>
                                    <Text style={ styles.txtSignUp }>Registrarme</Text>
                                </TouchableOpacity>
                                <Text style={ styles.txtSignUpWith }>o regístrate con</Text>
                                <View style={{ flexDirection: 'row', marginTop: 17 }}>
                                    <TouchableOpacity onPress={ () => loginWithGoogle('signup') }>
                                        <Image source={ require('assets/google.png') } style={{ width: 27, height: 27 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={ () => loginWithFacebook('signup') }>
                                        <Image source={ require('assets/facebook.png') } style={{ width: 27, height: 27, marginLeft: 15, marginRight: 15 }} />
                                    </TouchableOpacity>
                                    <Image source={ require('assets/twitter.png') } style={{ width: 27, height: 27 }} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View>
                    <TouchableOpacity style={ styles.btnSignIn } onPress={ toggleModal2 }>
                        <Text style={ styles.txtSignIn }>Iniciar sesión</Text>
                    </TouchableOpacity>

                    <Modal
                        isVisible={ isModalVisible2 }
                        style={ styles.bottomModal }
                        onBackdropPress={ toggleModal2 }
                        backdropOpacity={ 0 }
                        deviceWidth={ deviceWidth }
                        deviceHeight={ deviceHeight }>
                        <View style={ styles.LogInModal }>
                            <View style={ styles.viewTxtNewAccount }>
                                <Text style={ styles.txtWelcomeBack }>Bienvenido de vuelta</Text>
                            </View>
                            <View style={ styles.inputsView }>
                                <Text style={ styles.txtInputs }>Email</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <FontAwesomeIcon icon={ faUser } />
                                    <Field
                                        component={ FormInput }
                                        name='username'
                                        style={ styles.inputs }
                                        autoCapitalize='none'
                                    />
                                </View>
                            </View>
                            <View style={ styles.inputsView }>
                                <Text style={ styles.txtInputs }>Contraseña</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <FontAwesomeIcon icon={ faLock } />
                                    <Field
                                        component={ FormInput }
                                        name='password'
                                        style={ styles.inputs }
                                        autoCapitalize='none'
                                        secureTextEntry={ true }
                                    />
                                </View>
                            </View>
                            <View>
                                <Text style={ styles.txtForgotPassword }>Olvidé mi contraseña</Text>
                            </View>
                            <View style={ styles.bottomSignUp }>
                                <TouchableOpacity onPress={ handleSubmit(login) } style={ styles.btnSignUp }>
                                    <Text style={ styles.txtSignUp }>Iniciar sesión</Text>
                                </TouchableOpacity>
                                <Text style={ styles.txtSignUpWith }>o inicia sesión con</Text>
                                <View style={{ flexDirection: 'row', marginTop: 17 }}>
                                    <TouchableOpacity onPress={ () => loginWithGoogle('login') }>
                                        <Image source={ require('assets/google.png') } style={{ width: 27, height: 27 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={ () => loginWithFacebook('login') }>
                                        <Image source={ require('assets/facebook.png') } style={{ width: 27, height: 27, marginLeft: 15, marginRight: 15 }} />
                                    </TouchableOpacity>
                                    <Image source={ require('assets/twitter.png') } style={{ width: 27, height: 27 }} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </ImageBackground>
    )
}


export default reduxForm({
    form: 'auth',
})(connect(
    state => ({}),
    dispatch => ({
        login(props) {
            const { username, password } = props
            dispatch(actions.startLogin({ username, password }))
            auth().signInWithEmailAndPassword(username, password).then(() => {
                dispatch(actions.setFirebaseUserUID(auth().currentUser.uid))
            })
        },
        signUp(props) {
            const { signUpUsername, signUpPassword, signUpEmail } = props
            dispatch(actions.startSignUp({
                username: signUpUsername,
                password: signUpPassword,
                email: signUpEmail,
                type: 'normal'
            }))
        },
        getInfoFromFBToken(token, type) {
            const PROFILE_REQUEST_PARAMS = {
                fields: {
                    string: 'id,name,email,first_name,last_name,picture,short_name',
                },
            }
            const profileRequest = new GraphRequest(
                '/me',
                { token, parameters: PROFILE_REQUEST_PARAMS },
                (error, user) => {
                    if (error) {
                        console.log('Login info has error: ' + error)
                    } else {
                        const facebookCredential = auth.FacebookAuthProvider.credential(token)

                        // Sign-in the user with the facebook credentials on Firebase
                        auth().signInWithCredential(facebookCredential).then(() => {
                            dispatch(actions.setFirebaseUserUID(auth().currentUser.uid))
                        })

                        if (type == 'signup') {
                            dispatch(actions.startSignUp({ user, type: 'third-party' }))
                        } else {
                            dispatch(actions.startLogin({ user, type: 'third-party' }))
                        }
                    }
                },
            )
            new GraphRequestManager().addRequest(profileRequest).start()
        },
        getInfoFromGoogleToken(userInfo, type) {
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken)

            auth().signInWithCredential(googleCredential).then(() => {
                dispatch(actions.setFirebaseUserUID(auth().currentUser.uid))
            })

            const user = userInfo.user

            if (type == 'signup') {
                dispatch(actions.startSignUp({ user, type: 'third-party' }))
            } else {
                dispatch(actions.startLogin({ user, type: 'third-party' }))
            }
        }
    })
)(Index))


const styles = StyleSheet.create({
    image: {
        flex: 1
    },

    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 57,

    },

    btnSignUp: {
        backgroundColor: layoutColors.seaGreen,
        shadowColor: layoutColors.shadow,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.6,
        borderRadius: 22,
        width: 250,
        padding: 12,
    },

    txtSignUp: {
        color: layoutColors.white,
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },

    btnSignIn: {
        marginTop: 20,
        backgroundColor: layoutColors.white,
        shadowColor: layoutColors.shadow,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.6,
        borderRadius: 22,
        width: 250,
        padding: 12,
    },

    txtSignIn: {
        color: layoutColors.seaGreen,
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },

    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },

    signUpModal: {
        backgroundColor: layoutColors.white,
        height: '65%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingTop: 25,
        paddingLeft: 38,
        paddingRight: 38
    },

    LogInModal: {
        backgroundColor: layoutColors.white,
        height: '63%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingTop: 25,
        paddingLeft: 38,
        paddingRight: 38
    },

    txtNewAccount: {
        fontFamily: 'Poppins-Bold',
        fontSize: 35,
    },

    txtWelcomeBack: {
        fontFamily: 'Poppins-Bold',
        fontSize: 35,
        marginBottom: 30
    },

    viewTxtNewAccount: {
        width: '60%',
        marginBottom: 17
    },

    txtInputs: {
        color: layoutColors.black,
        opacity: 0.5,
        fontSize: 14,
        fontFamily: 'Poppins-Regular'
    },

    inputsView: {
        borderBottomWidth: 2,
        borderBottomColor: layoutColors.seaGreen,
        marginBottom: 28.5
    },

    inputs: {
        width: '95%',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        paddingLeft: 5
    },

    bottomSignUp: {
        alignItems: 'center',
        marginTop: 33
    },

    txtSignUpWith: {
        color: layoutColors.black,
        opacity: 0.5,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginTop: 13
    },

    uploadImage: {
        borderColor: layoutColors.seaGreen,
        borderWidth: 1,
        borderRadius: 40,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },

    txtForgotPassword: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: layoutColors.seaGreen,
        textAlign: 'right'
    }
})
