import React, {Component} from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client/dist/socket.io";

const SOCKET_URL = "http://127.0.0.1:5000";
const STATUS_NO_FILE = 0;
const STATUS_STOPPED = 1;
const STATUS_PLAY = 2;
const STATUS_PAUSE = 3;

class App extends Component {
    constructor() {
        super();
        this.state = {
            files: [],
            runningFile: null,
            status: STATUS_NO_FILE
        }
    }

    componentDidMount() {
        const that = this;

        this.socket = io.connect(SOCKET_URL);
        this.socket.on('connect', function () {
            that.socket.emit('ready');
        });
        this.socket.on("files", function (data) {
            console.log(data);
            that.setState({files: data.files});
        });
        this.socket.on("status", function (data) {
            console.log(data);
            that.setState({status: data.status, runningFile: data.running_file})
        });
    }

    _onPlay = (file) => {
        this.socket.emit("play", {file: file});
    };
    _onStop = () => {
        console.log("irgendwas damit du das erkennen kannst, ob das durchgeführt wird");
        this.socket.emit("stop");
    };

    render() {
        const that = this;
        return <div className="App">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand">Mediaserver der Technik-AG</a>

            </nav>

            <main>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Laufender Medienvorgang</h5>
                        {this.state.runningFile ? <div> {this.state.runningFile}
                            <button type="button" className="btn btn-primary" id="play" onClick={
                                this._onStop}>Stop</button></div> : ""}
                    </div>
                </div>
                <br/>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Alle Medien</h5>
                        <ul className="list-group">
                            {this.state.files.map((val) => {
                                    return <li className={"list-group-item"}>{val}&nbsp;

                                        <button className={"btn btn-primary right"} onClick={function () {
                                            that._onPlay(val);
                                        }}>Play
                                        </button>
                                    </li>;
                                }
                            )}
                        </ul>
                    </div>
                </div>
                <br/>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Neue Mediendateien hochladen</h5>

                        <form method="post" action="http://localhost:5000/upload" encType="multipart/form-data">
                            <div className="form-group">

                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="media-file"
                                           name="media"/>
                                    <label className="custom-file-label" htmlFor="media-file"
                                           data-browse="Auswählen">Datei
                                        auswählen</label>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Mediendatei hochladen</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>;
    }
}

export default App;
