sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",

    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, JSONModel, MessageToast, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.app.booksdetails.controller.User", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);

            },
            onBeforeRendering: function () {
                // Call getRowCount function when the page is rendered
                this.getView().attachEventOnce("afterRendering", this.getRowCount, this);
            },

            getRowCount: function () {
                var oTable = this.getView().byId("idUserActiveLoanTable"); // Replace "yourTableId" with the ID of your table
                var aItems = oTable.getItems();
                var iRowCount = aItems.length;
                console.log("Number of rows in the table: " + iRowCount);
                return iRowCount;
            },
            onUserDetailsLoad: function (oEvent) {
                const { id } = oEvent.getParameter("arguments");
                this.ID = id;
                const sRouterName = oEvent.getParameter("name");
                const oObjectPage = this.getView().byId("ObjectPageLayout");

                oObjectPage.bindElement(`/Users(${id})`);
            },
            onBorrowNewBookPress: async function (oEvent) {

                //console.log(this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject())
                var oSelectedItem = oEvent.getSource().getParent();
                //console.log(oSelectedItem)
                // console.log(oEvent.getSource().getBindingContext().getObject())
                // console.log(oEvent.getParameters())
                var oSelectedUser = oSelectedItem.getBindingContext().getObject();
                var oSelectedBook = this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject()
                var oModel = this.getView().getModel("ModelV2");


                // let promise = new Promise((resolve, reject) => {
                //     oModel.read("/ActiveLoans", {
                //         filters: [
                //             oSelectedUser.activeLoans.forEach(element => {
                //                 new Filter("bookId_ID", FilterOperator.EQ, element.bookId.ID)
                //             })
                //         ],
                //         success: function (oData) {
                //             console.log(oData.results)
                //             if (oSelectedBook.ID === oData.results[0].bookId_ID) {
                //                 MessageToast.show("Book was already in active loans")
                //                 this.bookAlready = 1;
                //                 resolve(oData.results.length >0);

                //             }
                //         }.bind(this),
                //         error: function () {
                //             MessageToast.show("An error occured during login.");
                //             reject(oError);
                //         }
                //     })
                // })
                // oModel.read("/ActiveLoans", {
                //     filters: [
                //         oSelectedUser.activeLoans.forEach(element => {
                //         new Filter("bookId_ID", FilterOperator.EQ, element.bookId.ID)})
                //     ],
                //     success: function (oData) {
                //         console.log(oData.results)
                //         if (oSelectedBook.ID === oData.results[0].bookId_ID){
                //             MessageToast.show("Book was already in active loans")

                //            this.bookAlready = 1;
                //            return true
                //         }
                //     }.bind(this),
                //     error: function () {
                //         MessageToast.show("An error occured during login.");
                //     }
                // })

                // const bIsBookBorrowed= await this.onBookAlready();

                // if (promise) {
                //     return
                // }
                console.log(oSelectedUser.activeLoans)
                if (this.byId("idBooksTable").getSelectedItems().length > 1) {
                    MessageToast.show("Please Select only one Book");
                    return
                }

                console.log(oSelectedBook.availability)
                if (oSelectedBook.availability === 0) {
                    MessageToast.show("Book not available")
                    return
                }
                var oQuantity = oSelectedBook.availability - 1;
                console.log(oQuantity)
                const bIsInActiveLones = await this.bookInactiveLoans(oSelectedBook.ID, oSelectedUser.ID);

                if (bIsInActiveLones) {
                    MessageToast.show("You had a ActiveLoan for selected book.");
                    return;
                }
                const bIsBookReserved = await this.checkIfBookIsReservedByUser(oSelectedBook.ID, oSelectedUser.ID);

                if (bIsBookReserved) {
                    MessageToast.show("This book is already reserved by you.");
                    return;
                }


                const userModel = new sap.ui.model.json.JSONModel({
                    user_ID: oSelectedUser.ID,
                    book_ID: oSelectedBook.ID,
                    reservedDate: new Date(),
                    book: {
                        availability: oQuantity
                    }
                });
                this.getView().setModel(userModel, "userModel");

                const oPayload = this.getView().getModel("userModel").getProperty("/");
                try {
                    await this.createData(oModel, oPayload, "/IssueBooks");
                    var oModel = this.getView().getModel("ModelV2");
                oModel.refresh();
                // var oView2 = oRouter.getViews().View2;
                    sap.m.MessageBox.success("Book Reserved");
                    this.getView().byId("idBooksTable").getBinding("items").refresh();

                } catch (error) {
                    //this.oCreateBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
            },
            checkIfBookIsReservedByUser: function (bookID, userID) {
                return new Promise((resolve, reject) => {
                    const oModel = this.getView().getModel("ModelV2");
                    const oFilters = [
                        new Filter("book_ID", FilterOperator.EQ, bookID),
                        new Filter("user_ID", FilterOperator.EQ, userID)
                    ];

                    oModel.read("/IssueBooks", {
                        filters: oFilters,
                        success: function (oData) {
                            resolve(oData.results.length > 0);
                        },
                        error: function (oError) {
                            reject(oError);
                        }
                    });
                });
            },
            bookInactiveLoans: function (bookID, userID) {
                debugger
                return new Promise((resolve, reject) => {
                    const oModel = this.getView().getModel("ModelV2");
                    const oFilters = [
                        new Filter("bookId_ID", FilterOperator.EQ, bookID),
                        new Filter("userId_ID", FilterOperator.EQ, userID)
                    ];

                    oModel.read("/ActiveLoans", {
                        filters: oFilters,


                        success: function (oData) {
                            console.log("ActiveLoans data:", oData);
                            // Check if any of the loans are still active (no returndate)
                            const bIsBorrowed = oData.results.some(loan => !loan.returndate);
                            console.log("Active loans found:", bIsBorrowed);
                            resolve(bIsBorrowed);
                        },
                        error: function (oError) {
                            console.error("Error reading Bookloans:", oError);
                            reject(oError);
                        }
                    });
                });
            },
            onBookAlready: async function () {
                return new Promise((resolve, reject) => {
                    oSelectedUser.activeLoans.forEach(element => {
                        oModel.read("/ActiveLoans", {
                            filters: [
                                new Filter("bookId_ID", FilterOperator.EQ, element.bookId.ID),
                            ],
                            success: function (oData) {
                                console.log(oData.results)
                                if (oSelectedBook.ID === oData.results[0].bookId_ID) {
                                    MessageToast.show("Book was already in active loans")
                                }
                            }.bind(this),
                            error: function () {
                                MessageToast.show("An error occured during login.");
                            }
                        })
                    });
                });

            },
            onNotificationPress: async function () {
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
            OnSignOutPress: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteHome", {}, true)
            },
            onReservedBooksPress: async function () {
                var oModel = this.getView().getModel("ModelV2");
                oModel.refresh();
                if (!this.oReservedBooks) {
                    
                    this.oReservedBooks = await this.loadFragment("ReservedBooksByUser")
                    
                    const oObjectPage = this.getView().byId("idloginDialog");

                    oObjectPage.bindElement(`/Users(${this.ID})`);
                }
                this.oReservedBooks.open();
                
            },
            onCloseReserved: function () {
                if (this.oReservedBooks.isOpen()) {
                    this.oReservedBooks.close()
                }
            },
            onCancelReservedBook:function(){
                var oSelectedItem = this.byId("idReservedBooks").getSelectedItem();
                oSelectedItem.getBindingContext().delete("$auto");
            }

        });
    });
