sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, JSONModel) {
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
            onBorrowNewBookPress: async function () {
                var aSelectedItems = this.byId("idBooksTable").getSelectedItems();
                if (aSelectedItems.length > 0) {
                    var aISBNs = [];

                    aSelectedItems.forEach(function (oSelectedItem) {
                        var oTitle = oSelectedItem.getBindingContext().getObject().title;
                        

                        const newBookReserve = new JSONModel(
                            {
                                book: {
                                    title: oTitle
                                }
                            }
                        )
                        this.setModel(newBookReserve,"newBookModel");
                        var oNewBook = this.getModel(
                            "newBookModel"
                            ).getData();
                        console.log(oBookID)



                        try {
                            this.createData(ODataModel, oNewBook, "/IssueBooks");

                        } catch (error) {

                            MessageBox.error("Some technical Issue");
                        }
                        // aISBNs.push(sISBN);
                        // oSelectedItem.getBindingContext().delete("$auto");
                    });

                    Promise.all(aISBNs.map(function (sISBN) {
                        return new Promise(function (resolve, reject) {
                            resolve(sISBN + " Successfully Deleted");
                        });
                    })).then(function (aMessages) {
                        aMessages.forEach(function (sMessage) {
                            MessageToast.show(sMessage);
                        });
                    }).catch(function (oError) {
                        MessageToast.show("Deletion Error: " + oError);
                    });

                    // this.getView().byId("idBookTable").removeSelections(true);
                    // this.getView().byId("idBookTable").getBinding("items").refresh();
                } else {
                    MessageToast.show("Please Select Rows to Delete");
                };

            }

        });
    });
