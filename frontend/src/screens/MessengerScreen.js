import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatOnline from '../components/ChatOnline';
import Conversation from '../components/Conversation';
import Message from '../components/Message';
import TopBar from '../components/TopBar';
import styles from './MessengerScreen.module.css';
import { AuthContext } from '../context/AuthContext'
import axios from 'axios';
import { io } from 'socket.io-client';

const MessengerScreen = () => {
    const { user, token } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [incomingMessage, setIncomingMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const scrollRef = useRef();

    // console.log(incomingMessage);
    useEffect(() => {
        socket.current = io('ws://localhost:8900');
        socket.current.on('getMessage', data => {
            console.log(currentChat);
            setMessages([...messages, {
                // _id: Math.random(),
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            }]);
            console.log('Message incoming..', data);
            // if (currentChat?.members.includes(data.senderId)) {
            // }
        });
    }, []);

    // useEffect(() => {
    // }, [])


    // useEffect(() => {
    //     console.log('In update useEffect ' + incomingMessage);
    //     console.log(currentChat?.members.includes(incomingMessage?.sender));
    //     incomingMessage && currentChat?.members.includes(incomingMessage.sender) &&

    //     console.log(messages);
    // }, [incomingMessage, currentChat]);

    useEffect(() => {
        socket.current.emit('addUser', user._id);
        socket.current.on('getUsers', users => {
            setOnlineUsers(user.following.filter(f => users.some((u) => u.userId === f)));
        });

    }, [user]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const reqConfig = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const { data } = await axios.get('/api/conversations/', reqConfig);
                setConversations(data);
            } catch (err) {
                console.log(err);
            }
        }
        getConversations();
    }, [token]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const reqConfig = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const { data } = await axios.get(`/api/messages/${currentChat?._id.toString()}`, reqConfig);
                setMessages(data);
            } catch (err) {
                console.log(err);
            }
        }
        if (currentChat)
            getMessages();
    }, [token, currentChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages]);

    const messageChangeHandler = (e) => {
        setNewMessage(e.target.value);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            const message = {
                text: newMessage,
                conversationId: currentChat._id.toString()
            }
            const recvId = currentChat.members.find(member => member !== user._id.toString());
            // console.log('In send message handler');
            socket.current.emit('sendMessage', {
                senderId: user._id.toString(),
                recvId,
                text: newMessage
            });
            try {
                const reqConfig = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const { data } = await axios.post('/api/messages/', message, reqConfig);
                setMessages([...messages, data]);
                // console.log(data);
            } catch (err) {
                console.log(err);
            }
            setNewMessage('');
        }
    }
    // console.log(messages);
    return (
        <>
            <TopBar />
            <div className={styles['container']}>
                <div className={styles['chat-menu']}>
                    <div className={styles['chat-menu-wrapper']}>
                        <input type="text" className={styles['search-input']} placeholder='Search for a friend' />
                        {conversations.map(c => (
                            <div onClick={() => setCurrentChat(c)} key={c._id}>
                                <Conversation conversation={c} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles['chat-box']}>
                    <div className={styles['chat-box-wrapper']}>
                        {currentChat ?
                            <>
                                <div className={styles['chat-box-top']}>
                                    {messages.map(msg => (
                                        <div key={Math.random()} ref={scrollRef}>
                                            <Message message={msg} own={msg.sender.toString() === user._id.toString()} />
                                        </div>
                                    ))}
                                </div>
                                <form className={styles['chat-box-bottom']} onSubmit={sendMessage}>
                                    <textarea placeholder='Enter message' className={styles['message-input']} onChange={messageChangeHandler} value={newMessage}></textarea>
                                    <button className={styles['send-button']} type='submit'>Send</button>
                                </form>
                            </>
                            : <span className={styles['no-conversation-text']}>Open a conversation to chat</span>}
                    </div>
                </div>
                <div className={styles['online']}>
                    <div className={styles['online-wrapper']}>
                        <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
                    </div>
                </div>
            </div>

        </>
    )
}

export default MessengerScreen