angular.module("cp").controller("addEditGroupCtrl", 
['$scope', '$log', '$q','$state', '$stateParams', '$mdToast', 'storageService','$timeout', 'Upload', 'dataService', '$mdMedia','$mdDialog', '$window',
function ($scope, $log, $q, $state, $stateParams, $mdToast,  storageService, $timeout, Upload, dataService,$mdMedia, $mdDialog, $window){
	$scope.$parent.currentViewName = "Edit Group";
	
	$scope.isLoading = false;
	$scope.defaultImage = "./content/images/group-default3.png"
	$scope.toastPosition = 'top';
	$scope.message = "";
    $scope.currentView = "main";
	$scope.current = {
		action:"Create",
	    id:0,
	    group:{},
	    selectedUser:null
	};
	$scope.selectedUser = {Name:'Not selected'};
	/*Add participants*/
	$scope.members = [];
	$scope.searchText = "";
	$scope.searchResult = [];
	$scope.showMemberManagement = false;
	var preInit = function(){
		$scope.isLoading = true;
        $scope.current.group = {
            Id : 0,
            Name : "",
            Description : "",
            Status : "",
            Thumbnail : null,
            Url:"",
            GroupType : "",
            Members:[]
        }
		if($stateParams.id != 0)
		{
			$scope.current.group._id = $stateParams.id;
			$scope.$parent.currentViewName = "Create Group" ;
		}
		
		if($scope.current.group._id && $scope.current.group._id != 0){
			getGroupDetail($scope.current.group._id)
			.finally(function(d){
				init();
			});
		}
		else{
			init();
		}

// 		var tasks = [];
// 		if($scope.current.group._id && $scope.current.group._id != 0){
// 			tasks.push(getGroupDetail($scope.current.group._id));
// 		}
//   		$q.all([
// 			getGroupDetail($scope.current.group._id)
//   		])
	}
  	
	var init = function(){
		//$scope.showToast("Loaded", "");
		$scope.isLoading = false;
	};
	$scope.showToast = function(msg, type) {
		var toast = $mdToast.simple()
			  .content(msg)
			  .action('OK')
			  .highlightAction(true)
			  .position('top');

		$mdToast.show(toast).then(function(response) {
		  if ( response == 'ok' ) {

		  }
		});
	};
	
	var getGroupDetail = function(id){
		//var defered = $q.defer();
		var promise =  dataService.getGroup(id).then(function(d){
			if(d.data.isError){
				//toaster.pop("error","",d.Message)
			}
			else{
				//angular.copy(d.data.data,$scope.myGroups);  
				d.data.data.forEach(function(obj){
					//obj.Id = obj._id;
					  obj.DateCreated = new Date(obj.DateCreated);
			   	});
			   	$scope.current.group = d.data.data[0];

			   	//if this group is created by current user then allow user to manage users

			   	if($scope.current.group.CreatedBy == $scope.AUTHDATA._id ){
			   		$scope.showMemberManagement = true;
			   	}
			   	
			}
			//defered.resolve();
		},
		function(){
			//defered.reject();
		}
		);
		return promise;
	};
	
	$scope.save = function(){
		$scope.message = "";
		//blockUI()
		//$scope.current.group._id = $scope.current.group.Id; 
		dataService.saveGroup($scope.current.group)
		.then(function(g){
			
			$scope.showToast("Group saved.");
			//if this group is created by current user then allow user to manage users
			$scope.current.group._id = g.data._id;
			$scope.current.group.Members = g.data.Members;
			$scope.current.group.CreatedBy = g.data.CreatedBy;
			if($scope.current.group.CreatedBy == $scope.AUTHDATA._id ){
				$scope.showMemberManagement = true;
			}
		},
		function(e){
			$log.error(e);
		});
	}
	
	$scope.getUsers = function(term){
		var defer = $q.defer();
		dataService.getUsers(term)
		.then(function(d){   
			var users = [];
			d.data.data.forEach(function(u){
				u.Name = u.FirstName + ' ' + u.LastName;
			});
			defer.resolve(d.data.data);
		});
		return defer.promise;
	}
	
  	$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
        	var baseUrl = config.apiBaseURL
            file.upload = Upload.upload({
                url: config.apiBaseUrl + '/v1/file/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    //file.result = response.data;
                    if(!response.data.isError){
                    	$scope.current.group.Thumbnail = response.data.url
                    }
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }
	}   
	var confirmMessageHtml = 
			'<md-dialog aria-label="List dialog" class="layout-padding">' +
           '  <md-dialog-heading>'+
           '  	<h2>{{title}}</h2>'+	
           '  </md-dialog-heading>'+
           '  <md-dialog-content>'+
		   '	<img ng-disabled="item.__added"  ng-if="item.Picture!=null" ng-src="{{item.Picture}}" class="md-avatar" />' +
           '         <ez-initials ng-disabled="item.__added" ng-if="item.Picture==null" class="md-avatar" text="item.FirstName" ></ez-initials >'+
           '         <div class="md-list-item-text" layout="column">' +
           '                 <h3>{{ item.FirstName }} {{item.LastName }}</h3>' +
           '                 <p>{{ item.UserName}}, {{item.City }}</p>' +
           '                 <p>{{item.__added==true?"Added":""}}' +
           '         </div>' + 
		   '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="confirmed()" class="md-primary">' +
           '      Yes' +
           '    </md-button>' +
           '  	<md-button ng-click="canceled()" class="md-primary">' +
           '      Cancel' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>';
	
	$scope.removeMemberConfirmation = function(ev,selUser) {
		var confirmOpts = {
			template: confirmMessageHtml,
			//targetEvent:ev,
			locals: {
			   item: selUser,
			   title: 'Remove member '
			 },
			controller : function ($scope, $mdDialog, item, title){
				$scope.item = item;
				$scope.title = title;
				$scope.confirmed = function() {
              		$mdDialog.hide();
              	}
              	$scope.canceled = function() {
              		$mdDialog.cancel();
              	}
			}
		}
		
		$mdDialog.show(confirmOpts)
		.then(function(a){
			removeMember(selUser);
		}, function(e){
			
		})
		.finally(function(a) {
            cnf = undefined;
          });

	};           
	var removeMember = function (item){
		var data = 
		{
			"groupId":$scope.current.group._id,
			"members":[item._id]
		}
		dataService.removeGroupMembers(data).then(function(d){
			if(d.isError){
				$scope.showToast("Failed to add member", "");	
			}
			else{

				var index = _.indexOf(_.pluck($scope.current.group.Members, '_id'), item._id);
				$scope.current.group.Members.splice(index,1);		
				
			}
		});

	}
	$scope.onSerch = function(searchText){
		$scope.searchResult=[];
		if(searchText && searchText.length > 0){

		}
		
		$scope.getUsers(searchText).then(function(d){
			
			d.forEach(function(u){
				//check if this user is alredy added
				var exist = _.findWhere($scope.current.group.Members,{"_id":u._id});
				if(exist){
					u.__added = true;
				}
			})
			var sorted = _.sortBy(d,"FirstName");
			angular.copy(sorted,$scope.searchResult)
			
		})
	}

	$scope.addMemberConfirmation = function(ev,selUser) {
		var confirmOpts = {
			template: confirmMessageHtml,
			//targetEvent:ev,
			locals: {
			   item: selUser,
			   title: 'Add new member  '
			 },
			controller : function ($scope, $mdDialog, item, title){
				$scope.item = item;
				$scope.title = title;
				$scope.confirmed = function() {
              		$mdDialog.hide();
              	}
              	$scope.canceled = function() {
              		$mdDialog.cancel();
              	}
			}
		}
		
		
		$mdDialog.show(confirmOpts)
		.then(function(a){
			
			addMember(selUser);
		}, function(e){
			
		})
		.finally(function(a) {
          
          });

	};

	var addMember = function (selUser){
		var exist = false;
		$scope.current.group.Members.forEach(function(u){
		  if(u.UserName == selUser.UserName){
			exist = true;
		  }
		});
		if(!exist){
			var data = 
			{
				"groupId":$scope.current.group._id,
				"members":[selUser._id]
			}
			dataService.addGroupMembers(data).then(function(d){
				if(d.isError){
					$scope.showToast("Failed to add member", "");	
				}
				else{
					$scope.showToast("Member added", "");	
					$scope.current.group.Members.push(selUser);
					selUser.__added = true;
				}
			});
		}
	}

	


	$scope.cancel =function(){
		//take back to list of groups
		$window.history.back();
	}
    $scope.showAddMembers = function(){
        $scope.currentView = "members"
    }
    $scope.cancelMemberAdd = function(){
        $scope.currentView = "main"
    }
	preInit();
}]);
