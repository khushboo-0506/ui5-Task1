sap.ui.define([
  'sap/ui/core/mvc/Controller'
], function (Controller) {
  'use strict';

  return Controller.extend("in.khushboo.ui5.app.controller.BaseController", {

    // Fetches a model by name from the component
    getModel: function (sModelName) {
      return this.getOwnerComponent().getModel(sModelName);
    },
    // Sets a model in the component scope
    setModel: function (oModel, sModelName) {
      this.getOwnerComponent().setModel(oModel,sModelName);
    },

    // Loads the i18n resource bundle
    getResourceBundle : function() {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },
    
    // Provides access to the router defined in Component.js
    getRouter : function(){
      return this.getOwnerComponent().getRouter();
    }
  });
});