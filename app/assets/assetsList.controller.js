<div flex class='md-padding' >
                Add members
                <!--Add members-->
                <form ng-submit="$event.preventDefault()">
                    <div layout="column" >
<!--                            
                            <md-autocomplete
                                class=""
                                md-selected-item"selectedUser"
                                md-selected-item-change="onItemChanged(d)"
                                md-search-text="searchText"
                                md-items="item in getUsers(searchText)"
                                md-item-text="Name"
                                md-min-length="0"
                                placeholder="Choose group member"
                                md-menu-class="autocomplete-custom-template">
                                <md-item-template>
                                        <span class="item-title" lauout="column"> 
                                            <img ng-if="item.Picture != null" ng-src="{{item.Picture}}" class="md-avatar" />
                                           
                                            <span> {{item.Name}}</span>
                                            <p>{{ item.UserName }}{{item.City}} {{item.Country}}</p>
                                        </span>
                                        <span class="item-metadata">
                                            <span class="item-metastat">
                                            <strong>{{item.City}}</strong> 
                                            </span>
                                        </span>
                                </md-item-template>
                            </md-autocomplete> -->
                            <div layout="row" >
                                <md-button class="md-icon-button" ng-click="searchText=''" >
                                        <ng-md-icon icon="search"></ng-md-icon>
                                </md-button>
                                <md-input-container flex class="flex" md-no-float>
                                        <input placeholder="Search members" ng-model="searchText" ng-change="onSerch(searchText)"/>
                                </md-input-container>

                                <md-button class="md-icon-button" ng-click="searchText=''" >
                                        <ng-md-icon icon="clear"></ng-md-icon>
                                </md-button>
                            </div>
                            
                        <div>
                    </div>
                </form>
                <!--Add members End-->
            </div>
            <md-sub-header ng-show="searchResult.length > 0">{{"Found :" + searchResult.length}}</md-sub-header>
            
            <md-list>
                <md-list-item class="md-2-line" ng-repeat="item in searchResult">
                    
                    <img ng-disabled="item.__added"  ng-if="item.Picture!=null" ng-src="{{item.Picture}}" class="md-avatar" />
                    <ez-initials ng-disabled="item.__added" ng-if="item.Picture==null" class="md-avatar" text="item.FirstName" ></ez-initials >
                    
                    <div class="md-list-item-text" layout="column">
                            <h3>{{ item.FirstName }} {{item.LastName }}</h3>
                            <p>{{ item.UserName}}, {{item.City }}</p>
                            <p>{{item.__added==true?"Added":""}}
                    </div>

                    <md-button ng-disabled="item.__added" ng-click="addMemberConfirmation($event,item)">
                        <i class="material-icons">add_circle_outline</i>
                    </md-button>
                    
                </md-list-item>
            </md-list>            
        