var _cards = new Array();
var _lastCard = 0;

var _tour = 0;
var _difficulty = 0;
var _currentPlayer = 2;

function initGame() {
	displayGame();
	createDeck();
	distributeCards();
	gameLoop();
}

function clearGame() {
	_cards = new Array();
	_lastCard = 0;
	_tour = 0;
	_difficulty = 0;
	_currentPlayer = Math.round(randomInt(10,20)/10);
	console.log('Joueur '+_currentPlayer+' commence');
	
	$('#container').empty();
	$('#tour').empty();
}

function gameLoop(){
	_tour += 1;
	_difficulty = getDifficulty();
	
	var totalPlayer1 = $('#game .player1').length;
	var totalPlayer2 = $('#game .player2').length;
	$('#tour').html('Tour&nbsp;:&nbsp;'+_tour+'&nbsp;|&nbsp;Scores&nbsp;:&nbsp;'+totalPlayer1+'&nbsp;vs&nbsp;'+totalPlayer2);
	
	if ($('#player1 .card, #player2 .card').length > 0) {
		keepPlaying();
	} else {
		stopPlaying(totalPlayer1,totalPlayer2);
	}
}

function keepPlaying() {
	$('.player fieldset legend i.icon-time').remove();
	if (_currentPlayer == 1) {
		_currentPlayer = 2;
		
		destroyDraggableCards(1);
		if (_difficulty === false) {
			createDraggableCards(2);
		} else {
			playIA();
		}
	} else {
		_currentPlayer = 1;
		
		destroyDraggableCards(2);
		createDraggableCards(1);
	}
	$('#player'+_currentPlayer+' fieldset legend').append('<i class="icon-time"/>');
}
function stopPlaying(totalPlayer1,totalPlayer2) {
	if (_difficulty === false) {
		if (totalPlayer1 == totalPlayer2){
			alertBox('Fin du jeu : Egalit&eacute;.');
		} else {
			alertBox('Fin du jeu : Joueur '+(totalPlayer1 > totalPlayer2 ? '1' : '2')+' gagne.');
		}
	} else {
		if (totalPlayer1 > totalPlayer2){
			alertBox('Fin du jeu : Vous avez gagn&eacute;.');
		} else if (totalPlayer1 < totalPlayer2){
			alertBox('Fin du jeu : Vous avez perdu.');
		} else {
			alertBox('Fin du jeu : Egalit&eacute;.');
		}
	}
	console.log('game over');
}

function createCardObject(
	top_a, 		top_d,
	bottom_a, 	bottom_d,
	left_a, 	left_d,
	right_a, 	right_d
) {
	// console.log('create card: ['+top_a+'/'+top_d+']-['+bottom_a+'/'+bottom_d+']-['+left_a+'/'+left_d+']-['+right_a+'/'+right_d+']');
	var card = $('<table class="card"/>');
	
	$(card).append('<tr/><tr/><tr/>');
	
	$(card).find('tr:eq(0)').append('<td/><td class="caracteristic top"><span class="attack">'+top_a+'</span>/<span class="defense">'+top_d+'</span></td><td/>');
	$(card).find('tr:eq(2)').append('<td/><td class="caracteristic bottom"><span class="attack">'+bottom_a+'</span>/<span class="defense">'+bottom_d+'</span></td><td/>');
	$(card).find('tr:eq(1)').append('<td class="caracteristic left"><span class="attack">'+left_a+'</span>/<span class="defense">'+left_d+'</span></td>');
	$(card).find('tr:eq(1)').append('<td/>');
	$(card).find('tr:eq(1)').append('<td class="caracteristic right"><span class="attack">'+right_a+'</span>/<span class="defense">'+right_d+'</span></td>');
	
	$(card).attr('data-top-attack',top_a);
	$(card).attr('data-top-defense',top_d);
	$(card).attr('data-bottom-attack',bottom_a);
	$(card).attr('data-bottom-defense',bottom_d);
	$(card).attr('data-left-attack',left_a);
	$(card).attr('data-left-defense',left_d);
	$(card).attr('data-right-attack',right_a);
	$(card).attr('data-right-defense',right_d);
	
	_cards[_cards.length] = card;
	
	return card;
}

function getMaxCaraceristic(max_value,max_caracteristic){
	return (max_value > max_caracteristic ? max_caracteristic : max_value);
}

function createDeck() {
	var top_a;
	var top_d;
	var bottom_a;
	var bottom_d;
	var left_a;
	var left_d;
	var right_a;
	var right_d;
	
	var max_caracteristic = 10;
	var max_attack = 20;
	var max_defense = 20;
	//if (level) {
		//prise en compte des niveau des cartes (1, 2, 3 ?)
	//}
	var total_attack = 0;
	var total_defense = 0;
	for (i = 0; i < 24; i++) {
		total_attack = 0;
		total_defense = 0;
		
		if (randomInt(0,1) == 0) {
			right_a = randomInt(0,getMaxCaraceristic(max_attack-total_attack,max_caracteristic));
			total_attack += right_a;
			left_a = randomInt(0,getMaxCaraceristic(max_attack-total_attack,max_caracteristic));
			total_attack += left_a;
			bottom_a = randomInt(0,getMaxCaraceristic(max_attack-total_attack,max_caracteristic));
			total_attack += bottom_a;
			top_a = randomInt(0,getMaxCaraceristic(max_attack,max_caracteristic));
			total_attack += top_a;
		} else {
			top_a = randomInt(0,getMaxCaraceristic(max_attack,max_caracteristic));
			total_attack += top_a;
			bottom_a = randomInt(0,getMaxCaraceristic(max_attack-total_attack,max_caracteristic));
			total_attack += bottom_a;
			left_a = randomInt(0,getMaxCaraceristic(max_attack-total_attack,max_caracteristic));
			total_attack += left_a;
			right_a = randomInt(0,getMaxCaraceristic(max_attack-total_attack,max_caracteristic));
			total_attack += right_a;
		}
		
		if (total_attack < max_attack) {
			var key = getMin(top_a,bottom_a,left_a,right_a);
			
			if (key == 'top') {
				top_a += max_attack - total_attack;
			} else if (key == 'bottom') {
				bottom_a += max_attack - total_attack;
			} else if (key == 'left') {
				left_a += max_attack - total_attack;
			} else if (key == 'right') {
				right_a += max_attack - total_attack;
			}
			total_attack += max_attack - total_attack;
		}
		
		if (total_attack < max_attack) {
			console.log('attack issue '+total_attack+' ('+(max_attack - total_attack)+')');
			console.log(top_a);
			console.log(bottom_a);
			console.log(left_a);
			console.log(right_a);
		}
		
		top_d = randomInt(0,getMaxCaraceristic(max_defense,max_caracteristic));
		total_defense += top_d;
		bottom_d = randomInt(0,getMaxCaraceristic(max_defense-total_defense,max_caracteristic));
		total_defense += bottom_d;
		left_d = randomInt(0,getMaxCaraceristic(max_defense-total_defense,max_caracteristic));
		total_defense += left_d;
		right_d = randomInt(0,getMaxCaraceristic(max_defense-total_defense,max_caracteristic));
		total_defense += right_d;
		
		if (total_defense < max_defense) {
			var key = getMin(top_d,bottom_d,left_d,right_d);
			
			if (key == 'top') {
				top_d += max_defense - total_defense;
			} else if (key == 'bottom') {
				bottom_d += max_defense - total_defense;
			} else if (key == 'left') {
				left_d += max_defense - total_defense;
			} else if (key == 'right') {
				right_d += max_defense - total_defense;
			}
			total_defense += max_defense - total_defense;
		}
		
		if (total_defense < max_defense) {
			console.log('defense issue '+total_defense+' ('+(max_defense - total_defense)+')');
			console.log('defense issue '+total_defense);
			console.log(top_d);
			console.log(bottom_d);
			console.log(left_d);
			console.log(right_d);
		}
		
		createCardObject(
			top_a, 		top_d,
			bottom_a, 	bottom_d,
			left_a, 	left_d,
			right_a, 	right_d
		);
	}
}

function fightCard(card1X,card1Y,card2X,card2Y) {
	if (card2X < 0 || card2X < 0) {
		return false;
	}
	
	var fightZone = '';
	var card1 = $('#game .cardSpace[data-x="'+card1X+'"][data-y="'+card1Y+'"] .card');
	var card2 = $('#game .cardSpace[data-x="'+card2X+'"][data-y="'+card2Y+'"] .card');
	//var card2 = $('#game tr:eq('+card2X+') td:eq('+card2Y+') .card');
	
	// console.log(card1);
	// console.log(card2);
	
	if ($(card1).length == 0 || $(card2).length == 0) {
		return false;
	}
	
	if (card1Y < card2Y) {
		fightZone = 'right';
	} else if (card1Y > card2Y) {
		fightZone = 'left';
	} else if (card1X < card2X) {
		fightZone = 'bottom';
	} else if (card1X > card2X) {
		fightZone = 'top';
	}
	
	var fightResult = false;
	if (fightZone == 'top') {
		// console.log($(card1).data('top-attack') +'VS'+ $(card2).data('bottom-defense'));
		fightResult = ($(card1).data('top-attack') > $(card2).data('bottom-defense'));
	} else if (fightZone == 'bottom') {
		// console.log($(card1).data('bottom-attack') +'VS'+ $(card2).data('top-defense'));
		fightResult = ($(card1).data('bottom-attack') > $(card2).data('top-defense'));
	} else if (fightZone == 'left') {
		// console.log($(card1).data('left-attack') +'VS'+ $(card2).data('right-defense'));
		fightResult = ($(card1).data('left-attack') > $(card2).data('right-defense'));
	} else if (fightZone == 'right') {
		// console.log($(card1).data('right-attack') +'VS'+ $(card2).data('left-defense'));
		fightResult = ($(card1).data('right-attack') > $(card2).data('left-defense'));
	}
	// console.log(fightZone);
	// console.log(fightResult);
	
	if (fightResult) {
		$(card2).parent().removeClass('player1');
		$(card2).parent().removeClass('player2');
		// console.log($(card1).parent().hasClass('player1'));
		$(card2).parent().addClass('player'+($(card1).parent().hasClass('player1')?1:2));
	}
}

function placeCard(cardSpace) {
	var cardSpaceX = $(cardSpace).data('x');
	var cardSpaceY = $(cardSpace).data('y');
	
	fightCard(cardSpaceX,cardSpaceY,cardSpaceX-1,cardSpaceY);
	fightCard(cardSpaceX,cardSpaceY,cardSpaceX+1,cardSpaceY);
	fightCard(cardSpaceX,cardSpaceY,cardSpaceX,cardSpaceY-1);
	fightCard(cardSpaceX,cardSpaceY,cardSpaceX,cardSpaceY+1);
	
	$('#player'+_currentPlayer+' .cardSpace:not(:has(.card))').remove();
	distributeCard(_currentPlayer, _lastCard++);
	gameLoop();
}

/* UTILS */

function randomInt(min, max) {
	var res = 0;
	
	res = Math.floor(Math.random()*max);
	// console.log(res);
	if (res < min) {
		return randomInt(min,max);
	}
	
	return res;
}

function getMin(top,bottom,left,right) {
	var min_value = 0;
	var min_key = '';
	
	min_value = top;
	min_key = 'top';
	
	if (bottom < min_value) {
		min_value = bottom;
		min_key = 'bottom';
	} else if (left < min_value) {
		min_value = left;
		min_key = 'left';
	} else if (right < min_value) {
		min_value = right;
		min_key = 'right';
	}
	
	return min_key;
}

function alertBox(message) {
    var html = '';

    html += '<div title="Notification" class="modal">';
    html += '   <div class="modal-header">';
    html += '       <a href="#" class="close" data-dismiss="modal">x</a>';
    html += '       <h3>Notification</h3>';
    html += '   </div>';
    html += '   <div class="modal-body">';
    html += '       <p>' + message + '</p>';
    html += '   </div>';
    html += '</div>';


    var popup = $(html);

    $('form').append(popup);

    $(popup).on('shown', function () {
        $('.modal-backdrop').last().attr('style', 'z-index: 1055;');
        $(popup).attr('style', 'z-index: 1060;');
    });

    $(popup).modal({ show: false });

    $(popup).on('hidden', function () {
        $(popup).remove();
    });

    $(popup).modal('show');
}