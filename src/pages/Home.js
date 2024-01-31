import React, { useState, useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../Home.css'

const Home = () => {

    useEffect(() => {
        document.title = 'Login | Code Harbor';
    }, []);

    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    const logoMethod = () => {
        navigate('/')
    }

    return (
        <>
            <div className='mainWrapper'>
                <div className='baseWrapper'>
                    <div className='asideOne'></div>
                    <div className='asideTwo'></div>
                </div>
                <div className='formWrapper'>
                    <div className='asideInner hideOnSmallScreen'>
                        <img src='./Full_Logo.png' alt='code-harbor-logo' onClick={logoMethod}></img>
                    </div>
                    <div className='loginWrapper'>
                        <div className='inputForms'>
                            <div className='form-group'>
                                <span>Room ID</span>
                                <input className='form-field' type="text" placeholder="Paste the room id here." value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleInputEnter} />
                            </div>
                            <div className='form-group'>
                                <span>Username</span>
                                <input className='form-field' type="text" placeholder="Enter your username." value={username} onChange={(e) => setUsername(e.target.value)} onKeyUp={handleInputEnter} />
                            </div>
                            <div className='button-group'>
                                <button className='btn createBtn' onClick={createNewRoom}>Create Room</button>
                                <button className='btn joiningBtn' onClick={joinRoom}>Join Room</button>
                            </div>
                            <div className='footerText'>
                                <span>Don't have a Room ID?</span><span className='green'> Create one.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;



