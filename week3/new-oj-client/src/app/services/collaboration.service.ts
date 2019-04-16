 import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  collaborationSocket: any;

  constructor() { }

  init(sessionId: string, editor: any): void{
    this.collaborationSocket = io(window.location.origin, {query : 'sessionId=' + sessionId });

    this.collaborationSocket.on('change', (delta: string) => {
      console.log('collaboration : editor change by' +  delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.session.getDocument().applyDeltas([delta]);
    })

    this.collaborationSocket.on("message", (message) => {
      console.log("received: " + message);
    })
  }

  change(delte: string): void {
    this.collaborationSocket.emit("change", delte);
  }



}
