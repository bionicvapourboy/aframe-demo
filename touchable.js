function isPointInsideRotatedParallelepiped(point, obj) {
  
   var localPoint = point.clone(); // Copia del punto
    var box = obj.getObject3D('mesh');
    // Trasformazione inversa del punto rispetto alla trasformazione del box
    box.worldToLocal(localPoint);

    // Coordinate del box allineato agli assi (dopo la trasformazione)
    var boxMin = box.geometry.boundingBox.min;
    var boxMax = box.geometry.boundingBox.max;

    // Verifica se il punto trasformato è all'interno del box allineato agli assi
    return (
        localPoint.x >= boxMin.x && localPoint.x <= boxMax.x &&
        localPoint.y >= boxMin.y && localPoint.y <= boxMax.y &&
        localPoint.z >= boxMin.z && localPoint.z <= boxMax.z
    );
}

/* global AFRAME, THREE */
AFRAME.registerComponent('touchable', {
  schema: {
    pressDistance: { default: 0.06 }
  },

  init: function () {
    this.worldPosition = new THREE.Vector3();
    this.handEls = document.querySelectorAll('[hand-tracking-controls]');
    this.pressed = false;
    this.debugger= document.querySelector('#inspect_el');
    this.boxGeometryEl = document.querySelector('#boxGeometry');
  },

  tick: function () {
    var handEls = this.handEls;
    var handEl;
    var distance;
    for (var i = 0; i < handEls.length; i++) {
      handEl = handEls[i];
      distance = this.calculateFingerDistance(handEl.components['hand-tracking-controls'].indexTipPosition);
      let mesh=this.el.getObject3D('mesh');
      let bbox = new THREE.Box3().setFromObject(mesh);
      
      if(
        isPointInsideRotatedParallelepiped(
          handEl.components['hand-tracking-controls'].indexTipPosition,
          this.el
        )
      ) {
        this.debugger.setAttribute('text', 'value', this.el.id);
        if (!this.pressed) { this.el.emit('pressedstarted'); }
        this.pressed = true;
        return;
      } 
      
    }
    if (this.pressed) { this.el.emit('pressedended'); }
    this.pressed = false;
  },

  calculateFingerDistance: function (fingerPosition) {
    var el = this.el;
    var worldPosition = this.worldPosition;

    worldPosition.copy(el.object3D.position);
    el.object3D.parent.updateMatrixWorld();
    el.object3D.parent.localToWorld(worldPosition);

    return worldPosition.distanceTo(fingerPosition);
  }
});
