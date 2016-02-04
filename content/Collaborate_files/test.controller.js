angular.module("cp").controller("testCtrl", testController)

//testController.$inject(["$scope","$log","$http"]);
function testController($scope, $log, $http) {
    var vm = $scope;
    vm.name = {};
    vm.title = "test";
    vm.sendMessage = _sendMessage;


		$scope.sourceFile = "";
    $scope.openSelectFile = function(dataUrl ){
			console.info(dataUrl);
    }


		$scope.closeDialog = function() {
		  $mdDialog.hide();
		}

    var _sendMessage =  function(){

    }

}