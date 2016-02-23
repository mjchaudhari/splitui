
/*
  Storage should store all data in main wrapper object with name cp-data.
  Ideal structure
  cp-api = {
    [key:value]
  }
  
  e.g.
  cp-api = {
      user:{FirstName: abc, 
      LastName : 'xyz', 
      AccessToken:'asdf-asd-afdgdg-', 
      dp:"asdf/asdf/asf"
      Status: "REGISTERED"
    }
  }
*/

angular.module('cp').factory('$repository', 
function($q, $log, $localStorage, storageService, dataService){
	var isInitialized = false;
	var me = {};
  var _groups = []
  /**
   * Check if the local repo is created. Create if not already created 
   * @param {string} groupId - groupId for which repository is to be initialized if provided.
  */
  var _initialize = function(){
  	me = storageService.get("__splituser");
  	_getlocalGroups ();
  }
  /**
  * get local groups
  */
  var _getlocalGroups = function(){
  	_groups = [];
    //get local groups
    var localRepo = storageService.get();
	//pickup groups
	for(var prop in localRepo) {
	   // propertyName is what you want
	   // you can get the value like this: myObject[propertyName]
	   if(localRepo[prop].type == "g"){
	   		var val = localRepo[prop];
			_groups.push(val);
	   }
	}
  }

  /**
   * Check if the local repo is created. Create if not already created 
   * @param {string} groupId - groupId for which repository is to be initialized if provided.
  */
  var _cleanGroup = function(groupId){
    storageService.remove(groupId);
  }

  /***
  * Refresh Groups
  * 
  */
  var _refreshGroups = function(){
  	return getGroups();
  }
	
  /**
   * Check if the local repo is created. Create if not already created 
   * @param {string} groupId - groupId for which repository is to be initialized if provided.
  */
	var _refreshGroup = function(groupId){
	  return dataService.getGroup(groupId).then(function(d){
	  	d.data.data.forEach(function(obj){
			  obj.DateCreated = new Date(obj.DateCreated);
		});
		var g = d.data.data[0];
		var lg = _.findWhere(_groups, {"_id":g._id});
		if(lg == undefined){
			lg = {};
			_groups.push(lg);
		}

		lg._id = g._id;
		lg.Name = g.Name;
		lg.Description = g.Description;

		lg.CreatedOn = Date(g.CreatedOn);
		lg.CreatedBy = Date(g.CreatedBy);
		
		lg.Thumbnail = g.Thumbnail;

		lg.Members = g.Members;
		lg.Status = g.Status;
		lg.type = "g"; //Just to indentify it as agroup

		storageService.add(lg._id,lg);

		var lastUpdated = lastUpdatedInLocalRepo()

		var filter = {
			groupId : g._id,
			from : lastUpdated
		}
		getAssets(filter)


	  });
	}
 
	var getAssets = function(filter){
		return dataService.getAssets(filter)
		.then(function(d){
			if(d.data == undefined){
				return;
			}
			if(d.data.data[0] == undefined){
				return;
			}
			var grp = d.data.data[0].GroupId;
			var existingGroup  = _.findWhere(_groups, {"_id":grp});

		  	if(existingGroup){
		  		existingGroup.lastUpdated = new Date().toISOString();
		  		d.data.data.forEach(function(a){
					if(existingGroup.list == undefined){
						existingGroup.list = [];
					}
					var updatedBy = "";
					if(a.AuditTrail){
						var audit = _.last(a.AuditTrail);
						if(audit){
							updatedBy = audit.UpdatedBy._id;
						}
					}
					//is this asset created by me?
					if(me && updatedBy){
						if(me._id == updatedBy){
							a.isMine = true;
						}
					}

					var existingAsset  = _.findWhere(existingGroup.list, {"_id":a._id});
					if(existingAsset){
						existingAsset = a;
					}
					else{
						existingGroup.list.push(a);
					}
		  		});

		  		storageService.add(existingGroup._id,existingGroup);
		  	}
		});
	};
	
	var getGroups = function(){
	  return dataService.getGroups()
	  .then(function(d){
			//getGroups from local storage and sync
			d.data.data.forEach(function(g){
				var lg = _.findWhere(_groups, {"_id":g._id});
				if(lg == undefined){
					lg = {};
					_groups.push(lg);
				}
				
				lg._id = g._id;
				lg.Name = g.Name;
				lg.Description = g.Description;

				lg.CreatedOn = Date(g.CreatedOn);
				lg.CreatedBy = Date(g.CreatedBy);

				lg.Thumbnail = g.Thumbnail;

				lg.Members = g.Members;
				lg.Status = g.Status;
				lg.type = "g"; //Just to indentify it as agroup
				
				storageService.add(lg._id,lg);

				var lastUpdated = lastUpdatedInLocalRepo()

				var filter = {
					groupId : g._id,
					from : lastUpdated
				}
				getAssets(filter)
			});
		});
	};
	
	var createLocalGroup = function (groupId){
		//get groups from local storage 
		  var store = {
		  	"type":"g",
			"lastUpdated":null,
			"list":[],
		  }
		  storageService.add(groupId,store);
	}

	var lastUpdatedInLocalRepo = function(groupId){
		var last =  new Date(2015,1,1);
		var localRepo = storageService.get(groupId);
		if(localRepo && localRepo.lastUpdated){
		  last = new Date(localRepo.lastUpdated).toISOString();
		}

		return last;
	}
	var validate = function(asset){
		var isValid = true;
		if(asset == null){
			isValid = false;
		}

		if(asset.Name == "" && $scope.Description == ""){
			isValid = false;
		}
		return true;
	}
	var _syncGroupWithLocalStorage = function(groupId){
		var g = storageService.get(groupId);
		g.type="g";

		var existingGroup = _.findWhere(_groups, {"_id":groupId});
		if(existingGroup){
			existingGroup = g;
		}
		else{
			_groups.push(g);
		}
	}
	/**
	* Save the asset to the given group to DB as well as update repo.groups
	* return promise
	*/
	var _saveAsset = function(asset) {
		var isValid = validate(asset);     
		var defered = $q.defer();
		dataService.saveAsset(asset)
		.then(function(d){
			if(d.data.isError){
				$scope.showToast("Error occured,", "error");		
				defered.resolve(d);
		
			}
			else{
			
				//Get group from local
				var g = _.findWhere(_groups, {"_id":asset.GroupId});
				if(g.list == undefined){
					g.list = [];
				}
				var a = _.findWhere(g.list,{"_id":d.data.data._id});
				if(a){
					a = d.data.data;
				}
				else{
					g.list.push(d.data.data);
				}
				storageService.add(asset.GroupId,g);
				defered.resolve(d);
			}
		}, function(e){
				defered.reject(e);	
		}); 
		return defered.promise;
    };
    /**
	* Save the asset to the given group to DB as well as update repo.groups
	* return promise
	*/
	var _saveAssetThumbnail = function(assetId, base64thumbnail) {
		return dataService.saveAssetThumbnail(assetId, base64thumbnail)
		.then(function(d){
			if(d.data.isError){
				//$scope.showToast("Error occured,", "error");
			}
			else{
				_groups.forEach(function(g){
					var a = _.findWhere(g.list,{"_id":assetId});
					if(a){
						a.Thumbnail = d.data.data.imageUrl;
					}	
				});
			}
		}, function(e){
			
		}); 
    };
    
	if(!isInitialized){
		_initialize()
		isInitialized = true;
	}

	var _saveGroup = function(){
		//saveGroup
	}

	var svc = {
	  initialize : _initialize,
	  refreshGroup : _refreshGroup,
	  refreshGroups : _refreshGroups,
	  groups : _groups,
	  saveAsset : _saveAsset,
	  saveAssetThumbnail : _saveAssetThumbnail,
	  saveGroup : _saveGroup,
  }
  return svc;

});