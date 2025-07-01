sap.ui.define([
  './BaseController.controller', // here is actually your BaseController, not the default, bcz you imported './BaseController.controller'
  'sap/m/MessageToast'
], function (Controller, MessageToast) {
  'use strict';

  return Controller.extend("in.khushboo.ui5.app.controller.Create", {

    //  Route Setup on Initialization
    onInit: function () {
      const oRouter = this.getRouter();
      oRouter.getRoute("create"). //Gets the router object using your BaseController helper

      attachPatternMatched(this._onPatternMatched, this);
      oRouter.getRoute("createWithoutIndex").// used for creating new employee

      attachPatternMatched(this._onPatternMatched, this); //So when either route is matched, it will trigger _onPatternMatched
    },

    //Decides Edit or Create Mode
    _onPatternMatched: function (oEvent) {
      const oModel = this.getModel("empModel");
      const sIndex = oEvent.getParameter("arguments").index; //extract iindex from route
      const oView = this.getView();
      const oTitle = oView.byId("formTitle");
      const oEmailInput = oView.byId("emailField");

      //IF index is provided → Edit Mode
      if (sIndex !== undefined && sIndex !== null && sIndex !== "") {
        this._editIndex = parseInt(sIndex); //stores edit inde in controller
        const oEmployee = oModel.getProperty("/employees/" + this._editIndex); //Fetches the employee at that index from the model

        //if employee exit
        if (oEmployee) {
          oModel.setProperty("/employee", { ...oEmployee }); //copy data into /employee

          if (oTitle) oTitle.setText("Edit Employee");
          if (oEmailInput) oEmailInput.setEnabled(false); //email edit disabled
        } else {
          MessageToast.show("Employee not found.");
          this.getRouter().navTo("landing_page");
        }
      } else {
        this._editIndex = null;
        oModel.setProperty("/employee", {
          firstName: "",
          lastName: "",
          age: "",
          salary: "",
          email: "",
          city: ""
        });
        if (oTitle) oTitle.setText("Create New Employee");
        if (oEmailInput) oEmailInput.setEnabled(true);
      }
    },

    // Save New or Edited Data
    onSave: function () {
      const oModel = this.getModel("empModel"); //get current model
      const oEmployee = oModel.getProperty("/employee"); 
      const aEmployees = oModel.getProperty("/employees") || []; //Gets existing array of employees.

      if (!oEmployee.firstName || !oEmployee.lastName || !oEmployee.email) {
        MessageToast.show("Please fill all required fields.");
        return;
      }

      if (Number.isInteger(this._editIndex) && aEmployees[this._editIndex]) {
        aEmployees[this._editIndex] = { ...oEmployee };
        MessageToast.show("Employee updated successfully!");
      } else {
        aEmployees.push({ ...oEmployee });
        MessageToast.show("New employee added!");
      }

      //save updated employee array
      //clear form after save
      oModel.setProperty("/employees", aEmployees);
      oModel.setProperty("/employee", {
        firstName: "",
        lastName: "",
        age: "",
        salary: "",
        email: "",
        city: ""
      });

      this._editIndex = null; //Resets internal edit state
      this.getRouter().navTo("landing_page"); //Navigates back to employee list page
    },

    onCancel: function () {
      this.getRouter().navTo("landing_page");
    }
  });
});
