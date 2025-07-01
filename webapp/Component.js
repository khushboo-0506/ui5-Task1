sap.ui.define([
  'sap/ui/core/UIComponent',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/BindingMode'
], function (UIComponent, JSONModel, BindingMode) {
  'use strict';
  
  //create a custom component by extendind base ui5component
  return UIComponent.extend("in.khushboo.ui5.app.Component", {
    metadata: {
      interfaces: ["sap.ui.core.IAsyncContentCreation"], //to load asynchronously
      manifest: "json"
    },


    //app initialization
    init: function () {
      UIComponent.prototype.init.apply(this, arguments); 
      
      //defin local data structure
      var oData = {
        employee: {
          firstName: "",
          lastName: "",
          age: "",
          salary: "",
          email: ""
        },
        employees: [] //maintain list of all employees
      };

      var oModel = new JSONModel(oData);
      oModel.setDefaultBindingMode(BindingMode.TwoWay); //changes in ui update model automatically and vice versa
      this.setModel(oModel, "empModel");

      this.getRouter().initialize();
    }
  });
});
