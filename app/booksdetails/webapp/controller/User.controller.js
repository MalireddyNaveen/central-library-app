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

        return Controller.extend("com.app.booksdetails.controller.User", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);
            },
            onUserDetailsLoad: function (oEvent) {
                const { id } = oEvent.getParameter("arguments");
                this.ID = id;
                const sRouterName = oEvent.getParameter("name");
                const oObjectPage = this.getView().byId("ObjectPageLayout");

                oObjectPage.bindElement(`/Users(${id})`);
            },
            onBorrowNewBookPress: async function (oEvent) {
                console.log(this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject())
                var oSelectedItem = oEvent.getSource().getParent();
                console.log(oSelectedItem)
                console.log(oEvent.getSource().getBindingContext().getObject())
                console.log(oEvent.getParameters())
                var oSelectedUser = oSelectedItem.getBindingContext().getObject();
                if(this.byId("idBooksTable").getSelectedItems().length>1){
                    MessageToast.show("Please Select only one Book");
                    return
                }
                var oSelectedBook=this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject()
                console.log(oSelectedBook)
            
                const userModel = new sap.ui.model.json.JSONModel({
                    user_ID : oSelectedUser.ID,
                    book_ID: oSelectedBook.ID,
                    reservedDate: new Date(),
                });
                this.getView().setModel(userModel, "userModel");
            
                const oPayload = this.getView().getModel("userModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
            
                try {
                    await this.createData(oModel, oPayload, "/IssueBooks");
                    sap.m.MessageBox.success("Book Reserved");
                    //this.getView().byId("idIssueBooks").getBinding("items").refresh();
                    //this.oCreateBooksDialog.close();
                } catch (error) {
                    //this.oCreateBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
            },

        });
    });
