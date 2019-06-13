import os
import signal
import threading

from eventlet.green import socket
from eventlet.green import subprocess
import time
import subprocess as sp


class VLCPlayer(threading.Thread):
    def __init__(self, filename):
        super().__init__()

        self.process = None
        self.filename_to_play = filename

    def run(self):
        self._play(self.filename_to_play)

    # def play(self, filename):
    #     self.filename_to_play = filename
    #     print("Play")

    def _play(self, filename):
        self.process = subprocess.Popen(["cvlc", "-f", "--no-osd", "--play-and-exit", filename])
        # self.x('play')

    def stop(self):
        os.kill(self.process.pid, signal.SIGTERM)
