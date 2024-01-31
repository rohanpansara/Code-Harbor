import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { language, cmtheme } from "../../src/atoms";
import '../App.css'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import ACTIONS from "../Actions";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {

  useEffect(() => {
    document.title = 'Editor | Code Harbor';
  }, []);

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  const [lang, setLang] = useRecoilState(language);
  const [them, setThem] = useRecoilState(cmtheme);

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  // const runCode = () => {
  //   try {
  //     const result = eval(code);
  //     setOutput(result);
  //   } catch (error) {
  //     setOutput(`Error: ${error.message}`);
  //   }
  // };

  const [showOutput, setShowOutput] = useState(false);

  const handleRunButtonClick = () => {
    try {
      const result = eval(code);
      console.log(result);
      setOutput(result);
      setShowOutput(!showOutput);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (

    <div className="mainWrap">
      <div className="aside">
        <div className="asideInnerE">
          <div className="logo">
            <img className="logoImage" src="/New_Full_Logo.png" alt="logo" />
            <h3>Connected</h3>
          </div>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
          <div className="labelWrapper">
            <label className="languageSelector">
              Select Language:
              <select
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value);
                  window.location.reload();
                }}
                className="seLang"
              >
                <option value="clike">C / C++ / C#</option>
                <option value="css">CSS</option>
                <option value="dart">Dart</option>
                <option value="django">Django</option>
                <option value="dockerfile">Dockerfile</option>
                <option value="go">Go</option>
                <option value="htmlmixed">HTML-mixed</option>
                <option value="javascript">JavaScript</option>
                <option value="jsx">JSX</option>
                <option value="markdown">Markdown</option>
                <option value="php">PHP</option>
                <option value="python">Python</option>
                <option value="r">R</option>
                <option value="rust">Rust</option>
                <option value="ruby">Ruby</option>
                <option value="sass">Sass</option>
                <option value="shell">Shell</option>
                <option value="sql">SQL</option>
                <option value="swift">Swift</option>
                <option value="xml">XML</option>
                <option value="yaml">yaml</option>
              </select>
            </label>

            <label className="themeSelector">
              Select Theme:
              <select
                value={them}
                onChange={(e) => {
                  setThem(e.target.value);
                  window.location.reload();
                }}
                className="seLang"
              >
                <option value="default">Default</option>
                <option value="3024-day">3024-day</option>
                <option value="3024-night">3024-night</option>
                <option value="abbott">abbott</option>
                <option value="abcdef">abcdef</option>
                <option value="ambiance">Ambiance</option>
                <option value="ayu-dark">Ayu-dark</option>
                <option value="ayu-mirage">Ayu-mirage</option>
                <option value="base16-dark">base16-dark</option>
                <option value="base16-light">base16-light</option>
                <option value="bespin">Bespin</option>
                <option value="blackboard">Blackboard</option>
                <option value="cobalt">Cobalt</option>
                <option value="colorforth">Colorforth</option>
                <option value="darcula">Dracula</option>
                <option value="duotone-dark">Duotone-dark</option>
                <option value="duotone-light">Duotone-light</option>
                <option value="eclipse">Eclipse</option>
                <option value="elegant">Elegant</option>
                <option value="erlang-dark">Erlang-dark</option>
                <option value="gruvbox-dark">Gruvbox-dark</option>
                <option value="hopscotch">Hopscotch</option>
                <option value="icecoder">IceCoder</option>
                <option value="idea">Idea</option>
                <option value="isotope">Isotope</option>
                <option value="juejin">Juejin</option>
                <option value="lesser-dark">Lesser-dark</option>
                <option value="liquibyte">Liquibyte</option>
                <option value="lucario">Lucario</option>
                <option value="material">Material</option>
                <option value="material-darker">Material-Darker</option>
                <option value="material-palenight">Material-Palenight</option>
                <option value="material-ocean">Material-Ocean</option>
                <option value="mbo">MBO</option>
                <option value="mdn-like">MDN-like</option>
                <option value="midnight">Midnight</option>
                <option value="monokai">Monokai</option>
                <option value="moxer">Moxer</option>
                <option value="neat">Neat</option>
                <option value="neo">Neo</option>
                <option value="night">Night</option>
                <option value="nord">Nord</option>
                <option value="oceanic-next">Oceanic-Next</option>
                <option value="panda-syntax">Panda-Syntax</option>
                <option value="paraiso-dark">Paraiso-Dark</option>
                <option value="paraiso-light">Paraiso-Light</option>
                <option value="pastel-on-dark">Pastel-On-Dark</option>
                <option value="railscasts">Railscasts</option>
                <option value="rubyblue">Rubyblue</option>
                <option value="seti">Seti</option>
                <option value="shadowfox">Shadow Fox</option>
                <option value="solarized">Solarized</option>
                <option value="the-matrix">The Matrix</option>
                <option value="tomorrow-night-bright">
                  Tomorrow-Night-Bright
                </option>
                <option value="tomorrow-night-eighties">
                  tomorrow-night-eighties
                </option>
                <option value="ttcn">ttcn</option>
                <option value="twilight">twilight</option>
                <option value="vibrant-ink">vibrant-ink</option>
                <option value="xq-dark">xq-dark</option>
                <option value="xq-light">xq-light</option>
                <option value="yeti">yeti</option>
                <option value="yonce">yonce</option>
                <option value="zenburn">zenburn</option>
              </select>
            </label>
          </div>

          <div className="buttons">
            <button className="btn1 copyBtn" onClick={copyRoomId}>
              Copy ROOM ID
            </button>
            <button className="btn1 leaveBtn" onClick={leaveRoom}>
              Leave
            </button>
            <button className="btn1 runBtn" onClick={handleRunButtonClick}>
              Run
            </button>
          </div>
        </div>
      </div>


      <div className="container">
        {showOutput && (
          <div className="output">
            {output}
            <p>This is the output!</p>
          </div>
        )}
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
