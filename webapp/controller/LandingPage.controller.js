//define modules 
sap.ui.define([
  './BaseController.controller',
  'sap/m/MessageToast',
  'sap/ui/core/ValueState',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/ui/model/Sorter',
  'sap/m/MessageBox'
  //func injects these so they can be used inside the controller
], function (Controller, MessageToast, ValueState, Filter, FilterOperator, Sorter, MessageBox) {
  'use strict';

  return Controller.extend("in.khushboo.ui5.app.controller.LandingPage", {

    onPress: function () {
      var message = this.getModel().getProperty("/message"); //gets value from default model
      MessageToast.show(message); //show popup
    },

   
    //formats full name using i18n
    formatName: function (sFname, sLname) {
      var i18nText = this.getResourceBundle(); //get i18n bundle
      return i18nText.getText("combine_names", [sFname, sLname]); //fetches the string using "combine_names" then replace by sFname,sLname
    },

    searchEmployee: function (oEvt) {
      var sQuery = oEvt.getParameter("query"), //gets search input
          oTable = this.byId("employeeTable"),
          oBinding = oTable.getBinding("items"),
          aFilter = [], //empty file to hold multiple files
          oFilter = null; //hold final filter to apply

      //if query not empty
      if (sQuery.length !== 0) {
        aFilter = [
          new Filter("firstName", FilterOperator.Contains, sQuery),
          new Filter("lastName", FilterOperator.Contains, sQuery)
        ];
        oFilter = new Filter({
          filters: aFilter,
          and: false  //combine both filters with OR Logic(if and:true->and logic applied)
        });
      }

      oBinding.filter(oFilter); //auto hide the content that don't match
    },

    //Checks if the settings dialog (this.employeeSettings) is already loaded.
    // If not, it loads the fragment (EmployeeSettings.fragment.xml) asynchronously.
    // When loaded, opens the dialog.
    openSettings: function () {
      if (!this.employeeSettings) {
        this.employeeSettings = this.loadFragment({
          name: "in.khushboo.ui5.app.fragment.EmployeeSettings"
        });
      }
      this.employeeSettings.then(function (oDialog) {
        oDialog.open();
      });
    },

    //applies sorting and grouping to employe table
    applySettings: function (oEvt) {
      var sortItem = oEvt.getParameter("sortItem"), //extract selected sort item from the event
          groupItem = oEvt.getParameter("groupItem"), //extract select group from event
          sortDesc = oEvt.getParameter("sortDescending"), //hets boolean indicating if sorting should be in descending
          groupDesc = oEvt.getParameter("groupDescending"),
          oTable = this.byId("employeeTable"),
          oBinding = oTable.getBinding("items"),
          aSorters = []; //intialize empty array to store sorter objects

      //if sort option selected->create a sorter with the property  and direction(asc/des)->add sorter to array
      if (sortItem) {
        aSorters.push(new Sorter(sortItem.getKey(), sortDesc));
      }

      if (groupItem) {
        aSorters.push(new Sorter(groupItem.getKey(), groupDesc, true));
      }

      oBinding.sort(aSorters);
    },

    createEmployee: function () {
      this.getRouter().navTo("createWithoutIndex");
    },

    //editing an employee
    navigate: function (oEvent) {
      var oSource = oEvent.getSource(),
          oContext = oSource.getBindingContext("empModel"),
          sPath = oContext.getPath(),
          iIndex = sPath.split("/")[2];

      this.getRouter().navTo("create", { index: iIndex });
    },

    //Index is passed via route to determine which employee to edit
    onEditEmployee: function (oEvent) {
      const oContext = oEvent.getSource().getBindingContext("empModel");
      const sPath = oContext.getPath();         // "/employees/0"
      const iIndex = sPath.split("/")[2];       // "0"
      this.getRouter().navTo("create", { index: iIndex }); 
    },

    //Shows a confirmation box using MessageBox.confirm()->if confirms deletes the employee using splice ->update model , shows a toast
    onDeleteEmployee: function (oEvent) {
      var oModel = this.getModel("empModel");
      var oContext = oEvent.getSource().getBindingContext("empModel");
      var sPath = oContext.getPath();   // "/employees/1"
      var iIndex = parseInt(sPath.split("/")[2]);

      MessageBox.confirm("Are you sure you want to delete this employee?", {
        onClose: function (sAction) {
          if (sAction === MessageBox.Action.OK) {
            var aEmployees = oModel.getProperty("/employees");
            aEmployees.splice(iIndex, 1); // Remove the selected employee((array.splice(startIndex, numberOfItemsToRemove);))

            oModel.setProperty("/employees", aEmployees); //Update the model
            MessageToast.show("Employee deleted.");
          }
        }
      });
    }
  });
});


