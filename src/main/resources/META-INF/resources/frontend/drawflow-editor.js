import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import Drawflow from 'drawflow/dist/drawflow.min.js'; // used from window
import DrawflowStyles from 'drawflow/dist/drawflow.min.css';
import customStyles from './drawflow-styles.css';

class DrawflowEditor extends PolymerElement {
    static get is() {
        return 'drawflow-editor';
    }

    static get template() {
        let style = document.createElement('style');
        style.textContent = `
            ${DrawflowStyles}
            ${customStyles}
                        
            :host {                
                display: block;
            }                             
        `
        let template = html`
            
            <div class="wrapper">
                <div class="col">
                  <div class="drag-drawflow" draggable="true" on-dragstart="drag" data-node="task-1">
                    <span>Task 1</span>
                  </div>
                  <div class="drag-drawflow" draggable="true" on-dragstart="drag" data-node="task-2">
                    <span>Task 2</span>
                  </div>
                </div>            
        
               <div id="drawflow" on-drop="drop" on-dragover="allowDrop"></div>                
            </div>            
        `;

        template.content.appendChild(style);
        return template;
    }

    static get properties() {
        return {
            editor: Object
        };
    }

    _attachDom(dom) {
        // attach to light dom for the styling to work properly
        this.appendChild(dom);
    }

    ready() {
        super.ready();
        this.editor = new window.Drawflow(this.$.drawflow); // it registers on window
        this.editor.start();
        this.setupEvents();

        //

        var elements = this.querySelectorAll('drag-drawflow');
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('touchend', (ev) => this.drop(ev), false);
            elements[i].addEventListener('touchmove', (ev) => this.positionMobile(ev), false);
            elements[i].addEventListener('touchstart', (ev) => this.drag(ev), false );
        }

        this.mobile_item_selec = '';
        this.mobile_last_move = null;
    }

    setupEvents() {
        // Events!
        this.editor.on('nodeCreated', function (id) {
            console.log("Node created " + id);
        })

        this.editor.on('nodeRemoved', function (id) {
            console.log("Node removed " + id);
        })

        this.editor.on('nodeSelected', function (id) {
            console.log("Node selected " + id);
        })

        this.editor.on('moduleCreated', function (name) {
            console.log("Module Created " + name);
        })

        this.editor.on('moduleChanged', function (name) {
            console.log("Module Changed " + name);
        })

        this.editor.on('connectionCreated', function (connection) {
            console.log('Connection created');
            console.log(connection);
        })

        this.editor.on('connectionRemoved', function (connection) {
            console.log('Connection removed');
            console.log(connection);
        })

        this.editor.on('mouseMove', function (position) {
            console.log('Position mouse x:' + position.x + ' y:' + position.y);
        })

        this.editor.on('nodeMoved', function (id) {
            console.log("Node moved " + id);
        })

        this.editor.on('zoom', function (zoom) {
            console.log('Zoom level ' + zoom);
        })

        this.editor.on('translate', function (position) {
            console.log('Translate x:' + position.x + ' y:' + position.y);
        })

        this.editor.on('addReroute', function (id) {
            console.log("Reroute added " + id);
        })

        this.editor.on('removeReroute', function (id) {
            console.log("Reroute removed " + id);
        })
    }

    // Misc
    positionMobile(ev) {
        this.mobile_last_move = ev;
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev) {
        if (ev.type === "touchstart") {
            this.mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
        } else {
            ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
        }
    }

    drop(ev) {
        if (ev.type === "touchend") {
            var parentdrawflow = document.elementFromPoint( mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
            if(parentdrawflow != null) {
                addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
            }
            this.mobile_item_selec = '';
        } else {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("node");
            this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
        }
    }

    addNodeToDrawFlow(name, pos_x, pos_y) {
        if (this.editor.editor_mode === 'fixed') {
            return false;
        }
        pos_x = pos_x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)));
        pos_y = pos_y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)));


        switch (name) {
            case 'task-1':
                var task1 = `<div><div class="box">Task 1</div></div>`;
                this.editor.addNode('task1', 0, 1, pos_x, pos_y, 'task-1', {}, task1 );
                break;

            case 'task-2':
                var task2 = `<div><div class="box">Task 2</div></div>`;
                this.editor.addNode('task2', 1, 0, pos_x, pos_y, 'task-2', {}, task2);
                break;

            default:
                break;
        }
    }

}

window.customElements.define(DrawflowEditor.is, DrawflowEditor);