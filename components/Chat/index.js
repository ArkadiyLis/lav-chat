import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import _ from 'lodash';
import io from "../../helpers/socketIo";
import cn from "classnames";

export default function Chat({user, users, messages}) {
    const [message, setMessage] = useState('');

    const onChangeMessage = (e) => {
        const value = e.target.value;
        setMessage(value);
    };

    const onEnter = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            io.emit("message", message);
            setMessage('');
        }
    };

    return (
        <div className="container">
            <div className="body">
                <div className="groups">
                    <div className="group">
                        <div className="group-img">C</div>
                        <div className="group-info">
                            <div className="group-title">Chat 1</div>
                        </div>

                    </div>
                </div>
                <div className="chat">
                    <div className="chat-header">
                        <div className="chat-header-title">Chat 1</div>
                        <div className="chat-header-users">{_.size(users)} users</div>
                    </div>
                    <div className="chat-body">
                        <div className="chat-container">
                            {
                                _.map(messages, (messageOptions) => {
                                    const {user: {id, name}, message} = messageOptions

                                    const chatRowClassNames = cn('chat-row', {
                                        'chat-row-user': id === user.id
                                    })

                                    return (
                                        <div className={chatRowClassNames}>
                                            <div className="chat-img">{name.substring(0, 1)}</div>
                                            <div className="chat-message">
                                                <div className="message-title">{name}</div>
                                                <div className="message-text">{message}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>

                    </div>
                    <div className="chat-bottom">
                        <Icon className="chat-input-icon">message</Icon>
                        <TextareaAutosize className="chat-textarea" placeholder="Type message" rowsMin={3} rowsMax={10} value={message} onKeyDown={onEnter} onChange={onChangeMessage}/>

                    </div>
                </div>
                <div className="info">
                    <div className="info-users">
                        <div className="users-header">
                            <Icon className="users-header-icon">people_alt</Icon>
                            <div className="users-header-title">{_.size(users)} users</div>
                        </div>
                        <div className="users-list">
                            {
                                _.map(_.sortBy(users), ({id, name}) => {
                                    return (
                                        <div className="user" key={id}>
                                            <div className="user-img">{name.substring(0, 1)}</div>
                                            <div className="user-name">{name}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
