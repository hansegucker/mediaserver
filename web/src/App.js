import React, {Component} from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-material-design-icons/css/material-icons.css";
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
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="player-tab" data-toggle="tab" href="#player" role="tab"
                           aria-controls="home" aria-selected="true">Medienplayer</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="manager-tab" data-toggle="tab" href="#manager" role="tab"
                           aria-controls="profile" aria-selected="false">Medienverwaltung</a>
                    </li>
                </ul>


                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="player" role="tabpanel"
                         aria-labelledby="player-tab">
                        <br/>
                        <div className="card">
                            <div
                                className={"card-body " + (this.state.status === STATUS_PLAY ? "bg-success " : "bg-danger text-white")}>
                                {this.state.status === STATUS_PLAY ?
                                    <i className={"mdi mdi-play-arrow right mdi-3x"}/> :
                                    <i className={"mdi mdi-stop right mdi-3x"}/>}
                                <h5 className="card-title">Laufender Medienvorgang</h5>
                                {this.state.runningFile ? <div>
                                    <p> {this.state.runningFile}</p>
                                    <div>
                                        <button type="button" className="btn btn-danger" onClick={this._onStop}>
                                            <i className="mdi mdi-stop"/> STOP
                                        </button>
                                    </div>
                                </div> : "Aktuell wird keine Datei abgespielt"}
                            </div>
                        </div>
                        <br/>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Alle Medien</h5>
                                <div className={"play-buttons"}>
                                    {this.state.files.map((val) => {
                                            return <button className={"btn btn-primary btn-lg"} onClick={function () {
                                                that._onPlay(val);
                                            }}>
                                                <i className="mdi mdi-play-arrow"/> {val}
                                            </button>
                                                ;
                                        }
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>


                    <div className="tab-pane fade" id="manager" role="tabpanel" aria-labelledby="manager-tab">
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
                        <br/>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Alle Medien</h5>
                                <ul className="list-group">
                                    {this.state.files.map((val) => {
                                            return <li className={"list-group-item"}>{val}&nbsp;

                                                <button className={"btn btn-primary right"} onClick={function () {
                                                    that._onPlay(val);
                                                }}>
                                                    <i className="mdi mdi-play-arrow"/>
                                                </button>
                                            </li>;
                                        }
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <br/>

            </main>
        </div>;
    }
}

export default App;
