sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("com.app.booksdetails.controller.Admin", {
            onInit: function () {
                //     var oTable=this.byId("idBookTable");
                //     var oBinding =oTable.getBinding("items");
                //     oBinding.attachChange(this._updateRowCount.bind(this));
                //     this._updateRowCount();
                // },
                // _updateRowCount:function(){
                //     var oTable = this.byId("idBookTable");
                //     var oBinding=oTable.getBinding("items");
                //     var iRowCount =oBinding.getLength();
                //     var oInput =this.byId("idTotalBooks");
                //     oInput.setValue(iRowCount);
                //     console.log(oInput.getValue())
                const oLocalModel = new JSONModel({
                    ISBN: "",
                    title: "",
                    quantity: 0,
                    author: "",
                    genre: "",
                    publisher: "",
                    language: "",
                    price: 0,
                    availability: "",
                });
                this.getView().setModel(oLocalModel, "localModel");
                this.getRouter().attachRoutePatternMatched(this.onBookListLoad, this);
               
                //     var oTable = this.getView().byId("idBookTable"); // Replace "yourTableId" with the ID of your table
                //     var oBinding = oTable.getBinding("items");
                //     oBinding.attachEvent("updateFinished", this.onTableUpdateFinished, this);
                
       
                
            },
            setHeaderContext : function () {
                var oView = this.getView();
                oView.byId("Bookstitle").setBindingContext(
                    oView.byId("_IDGenTable1").getBinding("items").getHeaderContext());
            },
            // onTableUpdateFinished: function(oEvent) {
            //     var oTable = oEvent.getSource().getParent(); // Get the table
            //     var oBinding = oEvent.getSource(); // Get the binding
            //     var iRowCount = oBinding.getLength(); // Get the number of rows
    
            //     console.log("Number of rows: " + iRowCount);
            // },
            onBookListLoad: function () {
                this.getView().byId("idBookTable").getBinding("items").refresh();
            },


            onGoPress: function () {
                /**
                 * Create all the filters
                 * Use Multi Input in Filters so that we can push multiple filters at a time
                 * Add the Functionality for Clear Filter
                 */
                const oView = this.getView(),
                    oTitleFilter = oView.byId("idTitleFilterValue"),
                    sTitle = oTitleFilter.getValue(),
                    oTable = oView.byId("idBookTable"),
                    aFilters = [];

                sTitle ? aFilters.push(new Filter("title", FilterOperator.EQ, sTitle)) : "";
                oTable.getBinding("items").filter(aFilters);
            },
            onCreateBtnPress: async function () {
                if (!this.oCreateEmployeeDialog) {
                    this.oCreateEmployeeDialog = await this.loadFragment("CreateBookDialog")
                }
                this.oCreateEmployeeDialog.open();
            },
            onCloseDialog: function () {
                if (this.oCreateEmployeeDialog.isOpen()) {
                    this.oCreateEmployeeDialog.close()
                }
            },
            onCreateBook: async function () {
                const oPayload = this.getView().getModel("localModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
                try {
                    await this.createData(oModel, oPayload, "/Books");
                    this.getView().byId("idBookTable").getBinding("items").refresh();
                    this.oCreateEmployeeDialog.close();
                } catch (error) {
                    this.oCreateEmployeeDialog.close();
                    MessageBox.error("Some technical Issue");
                }
                location.reload();

            }
        });
    });
