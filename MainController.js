var app = angular.module('HomePageApp',[]);

app.controller('MainController',['$scope',function($scope){
  $scope.pages = [
    {
      url: "tictactoe/index.html",
      img: "_screenshots/tictactoe.png",
      name: "Tic Tac Toe"
    },
    {
      url: "snakegame/index.html",
      img: "_screenshots/snake.png",
      name: "Snake Game"
    },
    {
      url: "simon/index.html",
      img: "_screenshots/simon.png",
      name: "Simon"
    },
    {
      url: "minesweeper/index.html",
      img: "_screenshots/minesweeper.png",
      name: "Minesweeper"
    },
    {
      url: "connect4/index.html",
      img: "_screenshots/connect4.png",
      name: "Connect 4"
    },
    {
      url: "sudoku/index.html",
      img: "_screenshots/sudoku.png",
      name: "Sudoku Solver"
    }
  ];
}]);