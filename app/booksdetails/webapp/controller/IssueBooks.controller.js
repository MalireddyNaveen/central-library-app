sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, JSONModel,MessageToast) {
        "use strict";
 
        return Controller.extend("com.app.booksdetails.controller.IssueBooks", {
            onInit: function() {
                
            },
            onAcceptReservedBook: async function (oEvent) {
                console.log(this.byId("idIssueBooks").getSelectedItem().getBindingContext().getObject())
                // var oSelectedItem = oEvent.getSource().getParent();
                // console.log(oSelectedItem)
                // console.log(oEvent.getSource().getBindingContext().getObject())
                // console.log(oEvent.getParameters())
                // var oSelectedUser = oSelectedItem.getBindingContext().getObject();
                if(this.byId("idIssueBooks").getSelectedItems().length>1){
                    MessageToast.show("Please Select only one Book");
                    return
                }
                var oSelectedBook=this.byId("idIssueBooks").getSelectedItem().getBindingContext().getObject()
                console.log(oSelectedBook)
            
                const userModel = new sap.ui.model.json.JSONModel({
                    bookId_ID : oSelectedBook.book.ID,
                    userId_ID: oSelectedBook.user.ID,
                    issueDate: new Date(),
                    dueDate:new Date()
                });
                this.getView().setModel(userModel, "userModel");
            
                const oPayload = this.getView().getModel("userModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
            
                try {
                    await this.createData(oModel, oPayload, "/ActiveLoans");
                    sap.m.MessageBox.success("Book Accepted");
                    //this.getView().byId("idIssueBooks").getBinding("items").refresh();
                    //this.oCreateBooksDialog.close();
                } catch (error) {
                    //this.oCreateBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
            },
        });
    });
 