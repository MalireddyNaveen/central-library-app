sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Token",
    "sap/ui/model/odata/v2/ODataModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel, MessageBox, Token,ODataModel) {
        "use strict";

        return Controller.extend("com.app.booksdetails.controller.ActiveLoans", {
           onInit:function(){
            // var oModel = new ODataModel("/v2/BooksSRV/");
            //        this.getView().setModel(oModel);
            
            },
            setHeaderContext: function () {
                var oView = this.getView();
                oView.byId("idUserLoans").setBindingContext(
                    oView.byId("_IDGenTable1").getBinding("items").getHeaderContext());
            },
            onCloseLoan:async function () {
                var aSelectedItems = this.byId("idUserLoans").getSelectedItems();
                if (aSelectedItems.length > 0) {
                    var aISBNs = [];
                    aSelectedItems.forEach(function (oSelectedItem) {
                        var sISBN = oSelectedItem.getBindingContext().getObject().isbn;
                        aISBNs.push(sISBN);
                        oSelectedItem.getBindingContext().delete("$auto");
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

                    this.getView().byId("idBookTable").removeSelections(true);
                    this.getView().byId("idBookTable").getBinding("items").refresh();
                } else {
                    MessageToast.show("Please Select Rows to Delete");
                };
                location.reload();
            }
        });
    });
