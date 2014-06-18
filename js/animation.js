
function playIA() {
	$('#player2').append('<img id="loader" src="img/ajax-loader.gif">');
	setTimeout('placeCardIA();',1500);
}
function dropCard(card,cardSpace) {
	$(card).hide();
	$(cardSpace).append(card);
	// console.log($(card).closest('#game'));
	if ($(card).closest('#game').length > 0) {
		$(card).find('.caracteristic').each(function(){
			var defense = $(this).find('.defense'); 
			$(this).html(defense);
		});
	}
	$(card).show( 'pulsate', {direction: (_currentPlayer == 1 ? 'left' : 'right')}, 200 );
	$(cardSpace).droppable('destroy').removeClass('ui-state-highlight');
}
function addCard(card,cardSpace) {
	$(card).hide();
	$(cardSpace).append(card);
	$(card).show( 'drop', {direction: (_currentPlayer == 1 ? 'left' : 'right')}, 200, function() {
		$(this).attr('style','position: relative;');
	});
}