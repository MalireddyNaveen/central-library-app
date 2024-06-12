sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, MessageToast, Filter, FilterOperator, JSONModel) {
        "use strict";

        return Controller.extend("com.app.booksdetails.controller.Home", {

            onInit: function () {
                var oModel = new ODataModel("/v2/BooksSRV/");
                this.getView().setModel(oModel);
                const oLocalModel = new JSONModel({
                    userName: "",
                    password: "",
                    email: "",
                    phoneNumber: 0,
                    Address: "",
                    exsist:false,
                    userType: "Non Admin"

                });
                this.getView().setModel(oLocalModel, "localModel");
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
                            if(!(oData.results[0].exsist === true)){
                                MessageToast.show("Not a user")
                               return
                            }
                            MessageToast.show("Login Successful");
                            if (usertype === "Non Admin") {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteUser", { id: userId },true)
                                
                            }
                            else {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteAdmin", { id: userId },true)
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


            },
            signupBtnClick: async function () {

                const oPayload = this.getView().getModel("localModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
                // oPayload.read{

                // }
                if (oPayload.userName && oPayload.password) {

                }
                else {
                    sap.m.MessageBox.error("Please enter valid userName and Password");
                    return
                }
                var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                var phoneRegex=/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/
                if(!(emailRegex.test(oPayload.email)&&phoneRegex.test(oPayload.phoneNumber))){
                    MessageToast.show("please enter valid Email and PhoneNumber")
                    return
                }
                try {
                    var oTitleExist = await this.checkUserName(oModel, oPayload.userName, oPayload.password)
                    var OemailCheck=await this.checkEmail(oModel,oPayload.email)
                    var oPhoneCheck=await this.checkPhone(oModel,oPayload.phoneNumber)
                    if (oTitleExist) {
                        MessageToast.show("User already exsist")
                        return
                    }
                    if(OemailCheck){
                        MessageToast.show("Email already exsist for another user please enter vaild email ")
                        return
                    }
                    if(oPhoneCheck){
                        MessageToast.show("PhoneNumber already exsist for another user please enter valid Phonenumber")
                        return
                    }
                    await this.createData(oModel, oPayload, "/Users");
                    // this.getView().byId("idBooksTable").getBinding("items").refresh();
                    this.oSignupDialog.close();
                } catch (error) {
                    this.oSignupDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
            },
            checkUserName: async function (oModel, sUserName, sPassword) {
                return new Promise((resolve, reject) => {
                    oModel.read("/Users", {
                        filters: [
                            new Filter("userName", FilterOperator.EQ, sUserName),
                            //new Filter("password", FilterOperator.EQ, sPassword)

                        ],
                        success: function (oData) {
                            resolve(oData.results.length > 0);
                        },
                        error: function () {
                            reject(
                                "An error occurred while checking username existence."
                            );
                        }
                    })
                })
            },
            checkEmail: async function (oModel, semail) {
                return new Promise((resolve, reject) => {
                    oModel.read("/Users", {
                        filters: [
                            new Filter("email", FilterOperator.EQ, semail),
                            //new Filter("password", FilterOperator.EQ, sPassword)

                        ],
                        success: function (oData) {
                            resolve(oData.results.length > 0);
                        },
                        error: function () {
                            reject(
                                "An error occurred while checking username existence."
                            );
                        }
                    })
                })
            },
            checkPhone: async function (oModel, sPhone) {
                return new Promise((resolve, reject) => {
                    oModel.read("/Users", {
                        filters: [
                            new Filter("phoneNumber", FilterOperator.EQ, sPhone),
                            //new Filter("password", FilterOperator.EQ, sPassword)

                        ],
                        success: function (oData) {
                            resolve(oData.results.length > 0);
                        },
                        error: function () {
                            reject(
                                "An error occurred while checking username existence."
                            );
                        }
                    })
                })
            },
            onClickSignUp: async function () {
                if (!this.oSignupDialog) {
                    this.oSignupDialog = await this.loadFragment("SignUpDialogue")
                }
                this.oSignupDialog.open();
            },
            onsignupcancelbtn: function () {
                if (this.oSignupDialog.isOpen()) {
                    this.oSignupDialog.close()
                }
            },

            AvailableBooksBtn: async function () {
                if (!this.libraryinfo) {
                    this.libraryinfo = await this.loadFragment("libraryinfo")
                }
                this.libraryinfo.open();
            },
            onlibraryclosedialog: function () {
                if(this.libraryinfo.isOpen()){
                this.libraryinfo.close()
                }
            },

        });
    });