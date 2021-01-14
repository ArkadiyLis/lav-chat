import Head from 'next/head'
import Router from 'next/router'
import styles from '../styles/Home.module.css'
import Chat from "../components/Chat";

import io from "../helpers/socketIo";
import React from "react";
import {useState, useEffect} from 'react';


export default function Home() {
    const [name, setName] = useState('');
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState({});
    const [users, setUsers] = useState({});
    const [messages, setMessages] = useState([]);

    io.on('users', (users) => {
        console.log('users', users);
        setUsers(users);
    });

    io.on('messages', (messages) => {
        console.log('messages', messages);
        setMessages(messages);
    });

    const onChangeName = (e) => {
        const value = e.target.value;
        setName(value);
    };

    const onEnter = () => {
        console.log('name', name);
        io.emit("auth", {name});
        io.on('auth.success', (user) => {
            setUser(user);
            setAuth(true);
        });
    };

    return (
        <div className="app-container">
            {
                auth
                    ? (
                        <>
                            <Chat user={user} users={users} messages={messages}/>
                        </>
                    )
                    : (
                        <>
                            <input className="login-input" type="text" placeholder="Type name" value={name} onChange={onChangeName}/>
                            <button className="login-button" onClick={onEnter}>Enter</button>
                        </>
                    )
            }
        </div>
    );
}
