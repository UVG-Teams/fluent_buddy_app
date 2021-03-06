import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'


import 'firebase/auth'
import 'firebase/firestore'
import firebase from 'firebase/app'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faPhoneAlt, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { ImageBackground, StyleSheet, View, Text, TextInput, Image, ScrollView } from 'react-native'


import { layoutColors } from 'src/settings'
import * as selectors from 'state/reducers'



const Chat = ({ navigation, chatroom, current_user_uid, sendMessage }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState()

    useEffect(() => {
        firebase.firestore().collection('chatrooms').doc(chatroom.id)
        .collection('messages')
        .orderBy('sent_at').limit(50)
        .onSnapshot(querySnapshot => {
            const chatroomMessages = []
            querySnapshot.forEach(doc => {
                if (doc.exists) {
                    chatroomMessages.push({
                        id: doc.id,
                        ...doc.data()
                    })
                }
            })
            setMessages(chatroomMessages)
        })
    }, [])

    const getOtherUserName = chatroom => {
        return chatroom.members_uids.map(member_uid => {
            if (member_uid != current_user_uid && chatroom.members[member_uid]) {
                return chatroom.members[member_uid].full_name
            }
        })
    }

    return (
        <ImageBackground style={ styles.background }>
            <View style={ styles.chatHeader }>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <TouchableOpacity onPress={ () => navigation.navigate('home') }>
                            <FontAwesomeIcon icon={ faChevronLeft } size={ 20 } color={ layoutColors.white } />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 25 }}>
                        {
                            chatroom.language == 'us' && <Image source={ require(`assets/us.jpg`) } style={ styles.imgConversation } /> ||
                            chatroom.language == 'ru' && <Image source={ require(`assets/ru.jpg`) } style={ styles.imgConversation } /> ||
                            chatroom.language == 'it' && <Image source={ require(`assets/it.jpg`) } style={ styles.imgConversation } /> ||
                            chatroom.language == 'fr' && <Image source={ require(`assets/fr.jpg`) } style={ styles.imgConversation } /> ||
                            chatroom.language == 'de' && <Image source={ require(`assets/de.jpg`) } style={ styles.imgConversation } />
                        }
                    </View>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={ styles.txtChatName }>{ getOtherUserName(chatroom) }</Text>
                    </View>
                </View>
                <View>
                    <FontAwesomeIcon icon={ faPhoneAlt } size={ 20 } color={ layoutColors.white } />
                </View>
            </View>
            <View style={ styles.body }>
                <View style={{ height: '80%', paddingBottom: 29 }}>
                    <ScrollView>
                        <View >
                            <Text style={ styles.txtDate }>Hoy, 23/03/20</Text>
                        </View>
                        {
                            messages.map(message => (
                                <View key={ message.id } style={ (message.sent_by == current_user_uid) ? styles.userMessageBox : styles.botMessageBox }>
                                    <View style={ (message.sent_by == current_user_uid) ? styles.userBubble : styles.botBubble }>
                                        <Text style={styles.txtMessage}>{ message.text }</Text>
                                    </View>
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={ (message.sent_by == current_user_uid) ? styles.txtMessageHourUser : styles.txtMessageHourBot }>{ new Date(message.sent_at.seconds * 1000).toLocaleTimeString() }</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <TextInput
                            style={ styles.iptMessage }
                            value={ newMessage }
                            onChangeText={ text => setNewMessage(text) }
                        />
                    </View>
                    <View style={ styles.btnVoiceNote }>
                        <TouchableOpacity
                            onPress={() => {
                                sendMessage(current_user_uid, chatroom.id, newMessage)
                                setNewMessage('')
                            }}
                        >
                            <FontAwesomeIcon icon={ faMicrophone } size={ 20 }/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
}


export default connect(
    (state, { route }) => ({
        current_user_uid: selectors.getFirebaseUserUID(state),
        chatroom: route.params.chatroom,
    }),
    dispatch => ({
        sendMessage(current_user_uid, chatroom_id, message) {
            // Send message
            firebase.firestore().collection('chatrooms').doc(chatroom_id).collection('messages').add({
                text: message,
                sent_at: new Date(),
                sent_by: current_user_uid
            }).then(() => {
                // Add last message
                firebase.firestore().collection('chatrooms').doc(chatroom_id).update({
                    last_message: {
                        text: message,
                        sent_at: new Date(),
                        sent_by: current_user_uid
                    }
                })
            })
        }
    })
)(Chat)


const styles = StyleSheet.create({
    background: {
        backgroundColor: layoutColors.seaGreen,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 70,
        paddingLeft: 30,
        paddingRight: 30,
        alignItems: 'center'
    },
    imgConversation: {
        width: 50,
        height: 50,
        borderRadius: 15
    },
    txtChatName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: layoutColors.white
    },
    body: {
        backgroundColor: layoutColors.white,
        height: '90%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginTop: 20,
        paddingLeft: 27,
        paddingRight: 27,
        paddingTop: 29
    },
    txtDate: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        textAlign: 'center',
        color: layoutColors.black,
        opacity: 0.5
    },
    userMessageBox: {
        marginTop: 18,
        width: '100%',
        alignItems: 'flex-end'
    },
    botMessageBox: {
        marginTop: 18
    },
    botBubble: {
        alignSelf: 'flex-start',
        padding: 10,
        backgroundColor: layoutColors.lightGray,
        // maxWidth: 255,
        width: 'auto',
        height: 'auto',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    userBubble: {
        padding: 10,
        backgroundColor: layoutColors.teaGreen,
        maxWidth: 255,
        width: 'auto',
        height: 'auto',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    txtMessageHourBot: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: layoutColors.black,
        opacity: 0.5
    },
    txtMessageHourUser: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: layoutColors.black,
        opacity: 0.5
    },
    iptMessage: {
        backgroundColor: layoutColors.lightGray,
        width: 320,
        height: 40,
        borderRadius: 30,
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: 'Poppins-Regular'
    },
    btnVoiceNote: {
        backgroundColor: layoutColors.teaGreen,
        width: 40,
        height: 40,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtMessage: {
        fontFamily: 'Poppins-Medium',

    }
})
