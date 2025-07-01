sap.ui.define([
  './BaseController.controller'
], function (Controller) {
  'use strict';

  return Controller.extend("in.khushboo.ui5.app.controller.Display", {
    onInit: function () {
      this.getRouter().getRoute("display").attachPatternMatched(this._objectRouteMatched.bind(this)); //listens for route "display" being matched ->when it happens calls objectRouteMatched()
      //.bind(this)->refers that this inside  objectRouteMatched refers to controller
    },

    _objectRouteMatched: function (oEvt) {
      var oParams = oEvt.getParameter("arguments"), //gets argument from route match event
          sEmployeeId = oParams.employeeid; //extract employeeid from it 
          this.bindView(sEmployeeId); //bind to employee's data
    },

    //wait for metadata to load->construct a unique path using createkey()->binds this path to view using bindelement(), so all ui controls with binding ->auto display the data
    bindView : function(sEmployeeId){
      var oModel= this.getModel();
      oModel.metadataLoaded().then(function(){
        var sContextPath = "/"+oModel.createKey("Employee",{
          ID : sEmployeeId
        });
        this.getView().bindElement(sContextPath);
      }.bind(this));
    },


    //Saves any edited changes made(pending chnges->submit) 
    onSave : function(){
      var oModel= this.getModel();
      if(oModel.hasPendingChanges()){
        oModel.submitChanges();
        window.history.go(-1); //navigate back in browser history
      }
    },

    //Delete the current employee and go back
    onDelete : function(){
      var oModel= this.getModel(),
          sPath = this.getView().
          getBindingContext().getPath(); //Gets the binding path of the currently displayed employee
          //call remove() on the path to delete the employee
          oModel.remove(sPath,{
            success : function(){
              window.history.go(-1); //navigate to previous page
            }
          })
    }
  });
});