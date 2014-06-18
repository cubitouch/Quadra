function closeMenu() {
	$('.toggle-topbar.menu-icon a').click();
}
function displayGame() {
	var cell;
	var line;
	
	var plateau = $('<div class="row"/>');
	
	var player1 = $('<div id="player1" class="player small-2 columns"></div>');
	var player2 = $('<div id="player2" class="player small-2 columns"></div>');
	var game = $('<div class="game small-8 columns"><table id="game" class=""/></div>');
	
	console.log('clear');
	clearGame();
	
	$(player1).append('<h5>Joueur 1</h5>');
	$(player2).append('<h5>Joueur 2</h5>');
	
	for (i = 0; i < 4; i++) {
		line = $('<tr/>');
		
		for (j = 0; j < 6; j++) {
			$(line).append('<td class="cardSpace" data-x="'+i+'" data-y="'+j+'"></td>');
		}
		
		$(game).find('table').append(line);
	}
	
	$(game).find('.cardSpace').droppable({
		hoverClass: "ui-state-active",
		drop: function( event, ui ) {
			$( this )
			.addClass( "ui-state-highlight" )
			.find( "p" )
			.html( "Dropped!" );
			}
	});
	
	$(plateau).append(player1);
	$(plateau).append(game);
	$(plateau).append(player2);
	
	$('#container').append(plateau);
	
	// $('#game .cardSpace').eq(0).append(_cards[0]);
	// $('#player1 .cardSpace').eq(0).append($(_cards[0]).clone());
}

function distributeCards() {
	for (i = 0; i < 6; i++) {
		distributeCard((i%2 == 1 ? 2 : 1),i);
	}
	_lastCard = i;
}
function _draggableStart() {
    $(this).parent().addClass('dragActive');
}
function _draggableDrag() {
	// $('#game .cardSpace').removeClass('dropActive');
	// $('#game .cardSpace').each(function(){
		// if (
		// window.event.clientX >= $(this).offset().left &&
		// window.event.clientX <= $(this).offset().left + $(this).width()+16 &&
		// window.event.clientY >= $(this).offset().top &&
		// window.event.clientY <= $(this).offset().top + 129 &&
		// $(this).find('.card').length == 0
		// )
			// $(this).addClass('dropActive');
	// });
}
function _draggableStop() {
	var drops = $('#game .cardSpace.ui-droppable.ui-state-highlight');
	
	console.log($(drops).length);
	if ($(drops).length == 1) {
		var cardSpacePlayer = $(this).parent();
		
		dropCard(this,drops);
		
		$(drops).addClass($(cardSpacePlayer).parent().attr('id'));
		$(this).draggable("destroy");
		$(cardSpacePlayer).remove();
		
		var cardSpace = $(this).parent();
		// console.log($(cardSpace).data('x')+'-'+$(cardSpace).data('y'));
		// console.log(($(cardSpace).data('x')-1)+'-'+$(cardSpace).data('y'));
		// console.log(($(cardSpace).data('x')+1)+'-'+$(cardSpace).data('y'));
		// console.log($(cardSpace).data('x')+'-'+($(cardSpace).data('y')-1));
		// console.log($(cardSpace).data('x')+'-'+($(cardSpace).data('y')+1));
		
		// console.log('[[FIGHT]]');
		placeCard(cardSpace);
		
	}
	
	$('#game .cardSpace').removeClass('dropActive');
	$(this).attr('style','position: relative;');
	
	$('.cardSpace.dragActive').removeClass('dragActive');
	$('.cardSpace.dropActive').removeClass('dropActive');
}

function distributeCard(player,id) {
	console.log('player '+player+' pick card '+id);
	$('#player'+player).append('<div id="card'+id+'" class="cardSpace"/>');
	// console.log($(_cards[id]));
	addCard(_cards[id],$('#card'+id));
}
