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
            //         this.getView().setModel(oModel);
            },
            setHeaderContext: function () {
                var oView = this.getView();
                oView.byId("idUserLoans").setBindingContext(
                    oView.byId("_IDGenTable1").getBinding("items").getHeaderContext());
            },
        });
    });
