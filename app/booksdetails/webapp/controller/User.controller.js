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
                console.log(oSelectedBook.availability)
                if(oSelectedBook.availability===0){
                    MessageToast.show("Book not available")
                    return
                }
                var oQuantity=oSelectedBook.availability-1;
                console.log(oQuantity)
                
            
                const userModel = new sap.ui.model.json.JSONModel({
                    user_ID : oSelectedUser.ID,
                    book_ID: oSelectedBook.ID,
                    reservedDate: new Date(),
                    book:{
                        availability:oQuantity
                    }
                });
                this.getView().setModel(userModel, "userModel");
            
                const oPayload = this.getView().getModel("userModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
            
                try {
                    await this.createData(oModel, oPayload, "/IssueBooks");
                    sap.m.MessageBox.success("Book Reserved");
                    this.getView().byId("idBooksTable").getBinding("items").refresh();
                    //this.oCreateBooksDialog.close();
                    // oModel.update("/Books(" + oSelectedBook.ID + ")", oPayload.book, {
                    //     success: function() {
                    //         this.getView().byId("idBooksTable").getBinding("items").refresh();
                    //         //this.oEditBooksDialog.close();
                    //     }.bind(this),
                    //     error: function(oError) {
                    //         //this.oEditBooksDialog.close();
                    //         sap.m.MessageBox.error("Failed to update book: " + oError.message);
                    //     }.bind(this)
                    // });
                } catch (error) {
                    //this.oCreateBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
            },
            onNotificationPress:async function(){
                if (!this.oNotifyDialog) {
                    this.oNotifyDialog = await this.loadFragment("Notify")
                }
                this.oNotifyDialog.open();
                const oObjectPage = this.getView().byId("idloginDialog");

                oObjectPage.bindElement(`/Users(${this.ID})`);
                
            },
            
            onCloseDialog: function () {
                if (this.oNotifyDialog.isOpen()) {
                    this.oNotifyDialog.close()
                }
            },

        });
    });
