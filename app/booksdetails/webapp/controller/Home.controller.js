sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, MessageToast, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.app.booksdetails.controller.Home", {
            
                onInit: function () {
                    var oModel = new ODataModel("/v2/BooksSRV/");
                    this.getView().setModel(oModel);
                    // const oLocalModel = new JSONModel({
                    //     userame: "",
                    //     password: "",
    
                    // });
                    // this.getView().setModel(oLocalModel, "localModel");
                },
            

            onClick: async function () {
                if (!this.oLoginDialog) {
                    this.oLoginDialog = await this.loadFragment("LoginPage")
                }
                this.oLoginDialog.open();
            },
            onCloseDialog: function () {
                if (this.oLoginDialog.isOpen()) {
                    this.oLoginDialog.close()
                }
            },

            onBtnClick: function () {

                var oView = this.getView();

                var sUsername = oView.byId("user").getValue();  //get input value data in oUser variable
                var sPassword = oView.byId("pwd").getValue();    //get input value data in oPwd variable

                if (!sUsername || !sPassword) {
                    MessageToast.show("please enter username and password.");
                    return
                }

                var oModel = this.getView().getModel();
                oModel.read("/Users", {
                    filters: [
                        new Filter("userName", FilterOperator.EQ, sUsername),
                        new Filter("password", FilterOperator.EQ, sPassword)

                    ],
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            var userId = oData.results[0].ID;
                            var usertype = oData.results[0].userType;
                            MessageToast.show("Login Successful");
                            if (usertype === "Non Admin") {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteUser", { id: userId })
                            }
                            else {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteAdmin", { id: userId })
                            }
                        } else {
                            MessageToast.show("Invalid username or password.")
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("An error occured during login.");
                    }
                })

                // if(oUser==="admin" && oPwd==="admin"){              
                //     const oRouter = this.getOwnerComponent().getRouter();
                //     oRouter.navTo("RouteAdmin")
                // }
                // else if (oUser==="user" && oPwd==="user") {
                //     const oRouter = this.getOwnerComponent().getRouter();
                //     oRouter.navTo("RouteUser")
                // } 
                // else{
                //     alert("Re-Enter your Detail");
                // }


            }


        });
    });