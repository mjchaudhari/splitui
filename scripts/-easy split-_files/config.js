this.config = {
  //apiBaseUrl : "https://ez-split.azurewebsites.net" // "http://localhost:8085" // "https://splitapi-mjchaudhari-1.c9.io" //"
  apiBaseUrl :  "http://localhost:8085" 
}

this.utils = {

  /**
  * Walk through each node of the tree
  *
  * `node` may be either an actual tree node object which is being traversed
  *
  * `finNodeHandler(node,parent)` function which is called when not in found during tree traversal with params node and its parent
  *          
  * `opts` options describing the ChindrenNode property of the node`.
  *
  * @param {Object|Array} node The tree node whcich has be iterated traversed
  * @param {Object|String} method which will be invoked when node is found .
  * @param {Object} opts [optional] describing the ChindrenNode property of the node`.
     * @param {opts.parent} parent node [optional]  the current node (if any)
  * @return {Object} Returns the ivhTreeviewMgr instance for chaining
  */
  treeWalker: function (node, findNodeHandler, opt) {
      var childrenAttribute = "Children";
      if (opt) {
          if (opt.childrenAttribute && opt.childrenAttribute != "") {
              childrenAttribute = opt.childrenAttribute;
          }
      }

      if (findNodeHandler) {
          findNodeHandler(node, parent);
      }
      if (node[childrenAttribute]) {
          for (var i = 0; i < node[childrenAttribute].length; i++) {
              if (opt == undefined) {
                  opt = {}
                  opt.parent = node;
              }
              utils.treeWalker(node[childrenAttribute][i], findNodeHandler, opt);
          }
      }

  },

  /**
   * Get the Path of given node 
   *
   * `opts` will default to an empty object, `isSelected` defaults to `true`.
   *
   * @param {Object|Array} node The tree node
   * @return {Array} Returns the array of parents
   */
  getTreeNodePath: function (tree, node, opt) {
      var childrenAttribute = "Children";
      if (opt) {
          if (opt.childrenAttribute && opt.childrenAttribute != "") {
              childrenAttribute = opt.childrenAttribute;
          }
      }

      var flatNodes = [];
      utils.treeWalker(tree, function (node) {
          flatNodes.push(node);
      });

      var result = [];
      var n = _.findWhere(flatNodes, { "Id": node.Id });
      result.push(n);
      //find the nodes which containt this node
      var findParentNode = function (nodeToFind) {
          for (var i = 0; i < flatNodes.length; i++) {
              var parent = flatNodes[i];
              if (parent[childrenAttribute]) {
                  var foundParent = _.findWhere(parent[childrenAttribute], { "Id": nodeToFind.Id });
                  if (foundParent) {
                      var p = foundParent[0];
                      result.push(parent);
                      findParentNode(parent);
                  }
              }
          }
      };

      findParentNode(node);
      return result.reverse();
  }
}