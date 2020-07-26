var app = angular.module("tApp", []);
app.controller("tController", ($scope, $interval) => {
	$scope.numPlayers = 0;
	$scope.players = [];
	$scope.roundTypes = ["", "D", "T", "Bowtie", "Black-White-Black", "25 bull"];
	$scope.rounds = [{type: 1, num: 19}, {type: 3, num: 0}];
	$scope.defaultrounds = $scope.rounds.concat();
	$scope.input = {numPlayers: 1, addRoundType: 0, addRoundNumber: 1, playerName: "", currentScoreNum: 0};

	$scope.currentRound = 0;
	$scope.currentPlayer = 0;

	$scope.genNumberArray = (x) => Array(20).fill(0).map((_,i) => i+1);
	$scope.getRoundName = (roundNumber) => $scope.roundTypes[$scope.rounds[roundNumber].type] + ($scope.rounds[roundNumber].type < 3 ? $scope.rounds[roundNumber].num : "");
	$scope.addRandomRound = () => $scope.rounds.push({type: Math.floor(Math.random()*$scope.roundTypes.length), num: Math.floor(Math.random()*20) + 1});
	$scope.sortPlayers = () => $scope.players.concat().sort((a,b) => b.score - a.score);

	$scope.submitScore = () => {
		let score = $scope.input.currentScoreNum;
		$scope.input.currentScoreNum = 0;
		if (score == 0) {
			$scope.players[$scope.currentPlayer].score = (($scope.players[$scope.currentPlayer].score + 1) / 2) | 0;
		}
		else if ($scope.rounds[$scope.currentRound].type < 3) {
			$scope.players[$scope.currentPlayer].score += ($scope.rounds[$scope.currentRound].type + 1) * $scope.rounds[$scope.currentRound].num * score;
		}
		else {
			$scope.players[$scope.currentPlayer].score += score;
		}
		$scope.currentPlayer++;
		if ($scope.currentPlayer == $scope.players.length) {
			$scope.currentRound++;
			$scope.currentPlayer = 0;
			if ($scope.currentRound == $scope.rounds.length) {
				$scope.gameFinished = true;
				$scope.gameStarted = false;
				$scope.currentRound = 0;
			}
		}
	}

	$scope.submitRoundOne = () => {
		$scope.players[$scope.currentPlayer].score += $scope.input.currentScoreNum;
		$scope.input.currentScoreNum = 0;
		$scope.currentPlayer++;
		if ($scope.currentPlayer == $scope.players.length) {
			$scope.firstRound = false;
			$scope.gameStarted = true;
			$scope.currentPlayer = 0;
		}
		// Add the final round
		$scope.rounds.push({type: 5, num: 0});
	}

	

	$scope.newGame = () => {
		$scope.players = [];
		$scope.rounds = $scope.defaultrounds.concat();
		$scope.numPlayers = 0;
		$scope.gameFinished = false;
	}

	$scope.replay = () => {
		$scope.gameFinished = false;
		$scope.playersAdded();
		$scope.rounds.pop();
	}

	$scope.playersAdded = () => {
		$scope.numPlayers = $scope.players.length;
		$scope.players.forEach(player => player.score = player.handicap);
	}
});
