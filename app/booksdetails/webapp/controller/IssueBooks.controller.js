sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("com.app.booksdetails.controller.IssueBooks", {
            onInit: function () {
                var oTable = this.byId("idIssueBooks");
 
         
                var oColumn1 = oTable.getColumns()[6]; // Index 1 represents the second column
                  
                // Hide the column
                oColumn1.setVisible(false);
            },
            onAcceptReservedBook: async function (oEvent) {
                console.log(this.byId("idIssueBooks").getSelectedItem().getBindingContext().getObject())
                // var oSelectedItem = oEvent.getSource().getParent();
                // console.log(oSelectedItem)
                // console.log(oEvent.getSource().getBindingContext().getObject())
                // console.log(oEvent.getParameters())
                // var oSelectedUser = oSelectedItem.getBindingContext().getObject();
                if (this.byId("idIssueBooks").getSelectedItems().length > 1) {
                    MessageToast.show("Please Select only one Book");
                    return
                }
                var oSelectedBook = this.byId("idIssueBooks").getSelectedItem().getBindingContext().getObject(),
                oAval=oSelectedBook.book.availability-1
                console.log(oSelectedBook.book_ID);
                // var currentDate = new Date();
                // var duedate = currentDate.setMonth(currentDate.getMonth() + 1);
                var now = new Date();
                if (now.getMonth() == 11) {
                    var current = new Date(now.getFullYear() + 1, 0, 1);
                } else {
                    var current = new Date(now.getFullYear(), now.getMonth() + 1);
                    console.log(current)
                }

                
                const userModel = new sap.ui.model.json.JSONModel({
                    bookId_ID: oSelectedBook.book.ID,
                    userId_ID: oSelectedBook.user.ID,
                    issueDate: now,
                    dueDate: current,
                    notify:`Your reserved book  title "${oSelectedBook.book.title}" is issued`,
                    bookId:{
                        availability:oAval
                    }

                });
                this.getView().setModel(userModel, "userModel");

                const oPayload = this.getView().getModel("userModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");

                try {
                    await this.createData(oModel, oPayload, "/ActiveLoans");
                    sap.m.MessageBox.success("Book Accepted");
                    this.byId("idIssueBooks").getSelectedItem().getBindingContext().delete("$auto");
                    oModel.update("/Books(" + oSelectedBook.book.ID + ")", oPayload.bookId, {
                        success: function() {
                            // this.getView().byId("idBooksTable").getBinding("items").refresh();
                            //this.oEditBooksDialog.close();
                        },
                        error: function(oError) {
                            //this.oEditBooksDialog.close();
                            sap.m.MessageBox.error("Failed to update book: " + oError.message);
                        }.bind(this)
                    });

                    //this.getView().byId("idIssueBooks").getBinding("items").refresh();
                    //this.oCreateBooksDialog.close();
                } catch (error) {
                    //this.oCreateBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }

            },
        });
    });
