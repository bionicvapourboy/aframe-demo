/* global AFRAME */
AFRAME.registerComponent('interactive-box', {
  schema: {
    label: {default: 'label'},
    width: {default: 0.11},
    toggable: {default: false}
  },
  init: function () {
    var el = this.el;
    var labelEl = this.labelEl = document.createElement('a-entity');
    this.handEls = document.querySelectorAll('[hand-tracking-controls]');
    this.color = '#ccddaa';
    el.setAttribute('geometry', {
      primitive: 'box'
    });
    
    el.setAttribute('pinchable', {
      pinchDistance: 0.2
    });
    
    
    
    this.pinched=true;
    el.setAttribute('material', {color: this.color});
    el.setAttribute('touchable', {pressDistance: 0.25 });
    var sceneEl = this.el.sceneEl;
    this.bindMethods();
    this.el.addEventListener('stateadded', this.stateChanged);
    this.el.addEventListener('stateremoved', this.stateChanged);
    this.el.addEventListener('pressedstarted', this.onPressedStarted);
    this.el.addEventListener('pressedended', this.onPressedEnded);
    this.el.addEventListener('pinchedmoved', this.onPinchedMoved);
    sceneEl.addEventListener('pinchedstarted', this.onPinchedStarted);
    // sceneEl.el.addEventListener('pinchedended', this.onPinchedEnded);
  },

  bindMethods: function () {
    this.stateChanged = this.stateChanged.bind(this);
    this.onPressedStarted = this.onPressedStarted.bind(this);
    this.onPressedEnded = this.onPressedEnded.bind(this);
    this.onPinchedMoved = this.onPinchedMoved.bind(this);
    this.onPinchedStarted = this.onPinchedStarted.bind(this);
    // this.onPinchEnded = this.onPinchEnded.bind(this);
  },

  update: function (oldData) {
    if (oldData.label !== this.data.label) {
      this.labelEl.setAttribute('text', 'value', this.data.label);
    }
  },

  stateChanged: function () {
    var color = this.el.is('pressed') ? 'green' : this.color;
    this.el.setAttribute('material', {color: color});
  },

  onPressedStarted: function () {
    var el = this.el;

    el.setAttribute('material', {color: 'green'});
    el.emit('click');
    if (this.data.togabble) {
      if (el.is('pressed')) {
        el.removeState('pressed');
      } else {
        el.addState('pressed');
      }
    }
  },

  onPressedEnded: function () {
    if (this.el.is('pressed')) { return; }
    this.el.setAttribute('material', {color: this.color});
  },
  
   onPinchedMoved: function (evt) {
    var el = this.el
    
    var evtDetail = this.evtDetail;
    var halfWidth = this.data.width / 2;
     
    let localPosition =  new THREE.Vector3().copy(evt.detail.position);
    
    el.object3D.position.x = localPosition.x;
    el.object3D.position.y = localPosition.y;
    el.object3D.position.z = localPosition.z;
    
  },
  onPinchedStarted: function (evt) {
     if (el.is('pinched')) {
        this.el.removeState('pinched');
      } else {
        this.el.addState('pinched');
      }
  }
 
});
