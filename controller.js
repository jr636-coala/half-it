var app = angular.module("tApp", []);
app.controller("tController", ($scope, $interval) => {
	$scope.numPlayers = 0;
	$scope.players = [];
	$scope.roundTypes = [
		{index: 0, name: "S"},
		{index: 1, name: "D"},
		{index: 2, name: "T"},
		{index: 3, name: "Fat "},
		{index: 4, name: "Thin "},
		{index: 5, name: "Over "},
		{index: 6, name: "Exactly "},
		{index: 5, name: "Any Double"},
		{index: 6, name: "Any Triple"},
		{index: 7, name: "Bowtie"},
		{index: 8, name: "Black-White-Black"},
		{index: 9, name: "All same color"},
		{index: 10, name: "All different color"},
		{index: 11, name: "25 bull"},
	];
	$scope.rounds = [{type: 1, num: 19}, {type: 7, num: 0}];
	$scope.defaultrounds = $scope.rounds.concat();
	$scope.input = {numPlayers: 1, addRoundType: 0, addRoundNumber: 1, playerName: "", currentScoreNum: 0};

	$scope.currentRound = 0;
	$scope.currentPlayer = 0;
	$scope.showScoresheet = false;

	$scope.genNumberArray = (x) => Array(20).fill(0).map((_,i) => i+1);
	$scope.getRoundName = (roundNumber) => $scope.roundTypes[$scope.rounds[roundNumber].type].name + ($scope.rounds[roundNumber].type < 7 ? $scope.rounds[roundNumber].num : "");
	$scope.addRandomRound = () => $scope.rounds.push({type: Math.floor(Math.random()*$scope.roundTypes.length), num: Math.floor(Math.random()*20) + 1});
	$scope.sortPlayers = () => $scope.players.concat().sort((a,b) => b.score - a.score);
	$scope.halfScore = () => $scope.players[$scope.currentPlayer].score = (($scope.players[$scope.currentPlayer].score + 1) / 2) | 0;

	$scope.submitScore = () => {
		$scope.calculateScore();
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

	$scope.calculateScore = () => {
		let score = $scope.input.currentScoreNum;
		let roundType = $scope.rounds[$scope.currentRound].type;
		$scope.input.currentScoreNum = 0;
		if (score == 0) {
			$scope.halfScore();
		}
		else if (roundType < 3) {
			$scope.players[$scope.currentPlayer].score += (roundType + 1) * $scope.rounds[$scope.currentRound].num * score;
		}
		else if (roundType < 5) {
			$scope.players[$scope.currentPlayer].score += $scope.round[$scope.currentRound].num * score;
		}
		else if (roundType == 5) {
			if (score <= $scope.round[$scope.currentRound].num) {
				$scope.halfScore();
			}
			else {
				$scope.players[$scope.currentPlayer].score += score;
			}
		}
		else if (roundType == 6) {
			if (score != $scope.round[$scope.currentRound].num) {
				$scope.halfScore();
			}
			else {
				$scope.players[$scope.currentPlayer].score += score;
			}
		}
		else {
			$scope.players[$scope.currentPlayer].score += score;
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
		// Add the final round
		$scope.rounds.push({type: 11, num: 0});
		}
	}

	

	$scope.newGame = () => {
		$scope.players = [];
		$scope.rounds = $scope.defaultrounds.concat();
		$scope.numPlayers = 0;
		$scope.gameFinished = false;
		$scope.showScoresheet = false;
	}

	$scope.replay = () => {
		$scope.gameFinished = false;
		$scope.playersAdded();
		$scope.rounds.pop();
		$scope.showScoresheet = false;
	}

	$scope.playersAdded = () => {
		$scope.numPlayers = $scope.players.length;
		$scope.players.forEach(player => player.score = 0);
	}
});
