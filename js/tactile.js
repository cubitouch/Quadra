function destroyDraggableCards(player) {
	$('#player'+player+' .card.ui-draggable').draggable("destroy");
}

function createDraggableCards(player) {
	$('#player'+player+' .card').draggable({
	  start: _draggableStart,
	  drag: _draggableDrag,
	  stop: _draggableStop
	});
}