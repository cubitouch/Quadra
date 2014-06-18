
function getDifficulty() {
	return true;
	// return ($('#ia .btn.active').attr('id')=='enable');
}

function placeCardIA() {
	var cardSpaces = $('#game .cardSpace:not(:has(.card))');
	var cardSpace = $(cardSpaces).first();
	var cards = $('#player2 .card');
	
	var cardSpaceValues = new Array();
	var cardValues = new Array();
	
	// faire la liste des emplacements vides // fightCard(x,x,x,x,true)
	for (i = 0; i<cardSpaces.length; i++) {
		cardSpaceValues[i] = {x:$(cardSpaces[i]).data('x'), y:$(cardSpaces[i]).data('y'), score:0};
	}
	// pour chaque cartes en main
	for (i = 0; i<cards.length; i++) {
		cardValues[i] = new Array();
		// faire la liste des X emplacements vides qui font gagner X cartes
		for (j = 0; j<cardSpaceValues.length; j++) {
			cardSpaceValues[j].score = 0;
		}
		
		for (j = 0; j<cardSpaceValues.length; j++) {
			cardSpaceValues[j].score += (fightIACard(cards[i],cardSpaceValues[j].x,cardSpaceValues[j].y,cardSpaceValues[j].x-1,cardSpaceValues[j].y) ? 1 : 0);
			cardSpaceValues[j].score += (fightIACard(cards[i],cardSpaceValues[j].x,cardSpaceValues[j].y,cardSpaceValues[j].x+1,cardSpaceValues[j].y) ? 1 : 0);
			cardSpaceValues[j].score += (fightIACard(cards[i],cardSpaceValues[j].x,cardSpaceValues[j].y,cardSpaceValues[j].x,cardSpaceValues[j].y-1) ? 1 : 0);
			cardSpaceValues[j].score += (fightIACard(cards[i],cardSpaceValues[j].x,cardSpaceValues[j].y,cardSpaceValues[j].x,cardSpaceValues[j].y+1) ? 1 : 0);
			
			cardValues[i][j] = {x:cardSpaceValues[j].x, y:cardSpaceValues[j].y, score:cardSpaceValues[j].score};
		}
	}
	
	var cardId = 0;
	var cardScore = 0;
	var cardSpacesScore = 0;
	
	// choisir la carte qui fait gagner le plus de cartes
	for (i = 0; i<cardValues.length; i++) {
		cardSpacesScore = 0;
		
		for (j = 0; j<cardValues[i].length; j++) {
			cardSpacesScore += cardValues[i][j].score;
		}
		
		if (cardScore < cardSpacesScore) {
			cardScore = cardSpacesScore;
			cardId = i;
		}
	}
	
	var cardSpaceId = 0;
	var cardSpaceScore = 0;
	
	// choisir l'emplacement qui fait gagner le plus de cartes
	for (i = 0; i < cardValues[cardId].length; i++) {
		if (cardSpaceScore < cardValues[cardId][i].score) {
			cardSpaceScore = cardValues[cardId][i].score;
			cardSpaceId = i;
		}
	}
	
	cardSpace = $(cardSpaces).filter(function() {
		return ($(this).data('x')==cardValues[cardId][cardSpaceId].x && $(this).data('y')==cardValues[cardId][cardSpaceId].y);
	});
	dropCard(cards[cardId],cardSpace);
	$(cardSpace).addClass('player2');
	
	placeCard(cardSpace);
	$('#player2 #loader').remove();
}

function fightIACard(card1,card1X,card1Y,card2X,card2Y) {
	if (card2X < 0 || card2X < 0) {
		return false;
	}
	
	var fightZone = '';
	var card2 = $('#game .cardSpace[data-x="'+card2X+'"][data-y="'+card2Y+'"] .card');
	
	if ($(card2).parent().hasClass('player2')) {
		// console.log('same');
		return false;
	}
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
	
	return fightResult;
}
