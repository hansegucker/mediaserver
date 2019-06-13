import os

from vlcplayer import VLCPlayer

# vlc.start()
# vlc.fullscreen()
#
#
# input()
# vlc.stop()


from flask import Flask, render_template, request, flash, redirect, url_for
from flask_socketio import SocketIO
from flask_uploads import UploadSet, configure_uploads

ALLOWED_EXTENSIONS = ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', "mp4", "mp3", "avi", "wav"]

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

# Configure uploads
app.config["UPLOADED_MEDIA_DEST"] = "media"
app.config["UPLOADED_MEDIA_ALLOW"] = ALLOWED_EXTENSIONS
app.config["UPLOADED_MEDIA_DENY"] = ["exe", "bat", "sh", "run", "dll", "ps"]
media = UploadSet('media')

configure_uploads(app, (media,))

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
socketio = SocketIO(app)

STATUS_NO_FILE = 0
STATUS_STOPPED = 1
STATUS_PLAY = 2
# STATUS_PAUSE = 3

running_file = None
status = STATUS_NO_FILE
vlc = None


def send_status():
    socketio.emit("status", {"status": status, "running_file": running_file})


@socketio.on("ready")
def ready():
    files = os.listdir(app.config["UPLOADED_MEDIA_DEST"])
    print(files)
    socketio.emit("files", {"files": files})
    send_status()


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST' and 'media' in request.files:
        print("Handle here.")

        filename = media.save(request.files['media'])
        # flash("Photo saved.")

    return redirect("http://localhost:3000/")


#@app.route('/')
#def index():
#    return render_template('index.html')


@socketio.on('play')
def handle_play(message):
    global running_file, status, vlc
    print(message)
    filename = os.path.join(app.config["UPLOADED_MEDIA_DEST"], message["file"])
    print(filename)
    # vlc.add(filename)
    vlc = VLCPlayer(filename)
    vlc.start()
    print("playing")
    running_file = filename
    status = STATUS_PLAY
    send_status()

@socketio.on('stop')
def handle_play():
    global running_file, status, vlc
    if vlc is not None:
        vlc.stop()
    print("stopped")
    status = STATUS_STOPPED
    running_file = None
    send_status()

if __name__ == '__main__':
    socketio.run(app)
