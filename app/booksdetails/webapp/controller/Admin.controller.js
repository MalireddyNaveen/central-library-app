sap.ui.define([
    
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Token",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel, MessageBox, Token, MessageToast, ODataModel) {
        "use strict";

        return Controller.extend("com.app.booksdetails.controller.Admin", {

            onInit: function () {
                this.oQuantity = null;
                this.oAq = null;
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
                    availability: 0

                });
                this.getView().setModel(oLocalModel, "localModel");
                this.getRouter().attachRoutePatternMatched(this.onBookListLoad, this);

                //     var oTable = this.getView().byId("idBookTable"); // Replace "yourTableId" with the ID of your table
                //     var oBinding = oTable.getBinding("items");
                //     oBinding.attachEvent("updateFinished", this.onTableUpdateFinished, this);

                const oView1 = this.getView();
                const oMulti1 = oView1.byId("idTitleFilterValue");
                const oMulti2 = oView1.byId("idAuthorFilterValue");
                const oMulti3 = oView1.byId("idGenreFilterValue");
                const oMulti4 = oView1.byId("idISBNFilterValue");

                let validate = function (arg) {
                    if (true) {
                        var text = arg.text;
                        return new Token({ key: text, text: text });
                    }
                };
                oMulti1.addValidator(validate);
                oMulti2.addValidator(validate);
                oMulti3.addValidator(validate);
                oMulti4.addValidator(validate);
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);

            },
            onUserDetailsLoad: function (oEvent) {
                const { id } = oEvent.getParameter("arguments");
                this.ID = id;
                const sRouterName = oEvent.getParameter("name");
                const oObjectPage = this.getView().byId("idBooksListPage");

                oObjectPage.bindElement(`/Users(${id})`);
            },
            setHeaderContext: function () {
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
                    sTitle = oTitleFilter.getTokens(),
                    oAuthorFilter = oView.byId("idAuthorFilterValue"),
                    sAuthor = oAuthorFilter.getTokens(),
                    oGerneFilter = oView.byId("idGenreFilterValue"),
                    sGerne = oGerneFilter.getTokens(),
                    oIsbnFilter = oView.byId("idISBNFilterValue"),
                    sIsbn = oIsbnFilter.getTokens(),
                    oTable = oView.byId("idBookTable"),
                    aFilters = [];
                sTitle.filter((ele) => {
                    ele ? aFilters.push(new Filter("title", FilterOperator.EQ, ele.getKey())) : "";
                });
                sAuthor.filter((ele) => {
                    ele ? aFilters.push(new Filter("author", FilterOperator.EQ, ele.getKey())) : "";
                });
                sGerne.filter((ele) => {
                    ele ? aFilters.push(new Filter("genre", FilterOperator.EQ, ele.getKey())) : "";
                });
                sIsbn.filter((ele) => {
                    ele ? aFilters.push(new Filter("ISBN", FilterOperator.EQ, ele.getKey())) : "";
                })

                oTable.getBinding("items").filter(aFilters);
            },
            onClearFilterPress: function () {
                const oView = this.getView(),
                    oTitleFilter = oView.byId("idTitleFilterValue"),
                    sTitle = oTitleFilter.removeAllTokens(),
                    oAuthorFilter = oView.byId("idAuthorFilterValue"),
                    sAuthor = oAuthorFilter.removeAllTokens(),
                    oGerneFilter = oView.byId("idGenreFilterValue"),
                    sGerne = oGerneFilter.removeAllTokens(),
                    oIsbnFilter = oView.byId("idISBNFilterValue"),
                    sIsbn = oIsbnFilter.removeAllTokens();

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
                var oPayload = this.getView().getModel("localModel").getProperty("/"),

                    oModel = this.getView().getModel("ModelV2");
                oPayload.availability = oPayload.quantity;
                this.getView().getModel("localModel").setData(oPayload);
                if (!(oPayload.ISBN && oPayload.author && oPayload.availability && oPayload.genre && oPayload.language && oPayload.publisher && oPayload.quantity && oPayload.title)) {
                    MessageToast.show("Enter all details");
                    return
                }
                if(!(typeof(parseInt(oPayload.quantity))==="number")){
                    MessageToast.show("Quantity should be numbers")
                    return
                }


                try {
                    const oTitleExist = await this.checkTitle(oModel, oPayload.title, oPayload.ISBN)
                    if (oTitleExist) {
                        MessageToast.show("Book already exsist")
                        return
                    }
                    const oISBNExist = await this.checkISBN(oModel, oPayload.ISBN)
                    if (oISBNExist) {
                        MessageToast.show("Book with ISBN already exsist")
                        return
                    }
                    await this.createData(oModel, oPayload, "/Books");
                    this.getView().byId("idBookTable").getBinding("items").refresh();

                    this.oCreateEmployeeDialog.close();
                } catch (error) {
                    this.oCreateEmployeeDialog.close();
                    MessageBox.error("Some technical Issue");
                }

                this.getView().byId("idBookTable").getBinding("items").refresh();

            },
            checkTitle: async function (oModel, stitle, sISBN) {
                return new Promise((resolve, reject) => {
                    oModel.read("/Books", {
                        filters: [
                            new Filter("title", FilterOperator.EQ, stitle),
                            //new Filter("ISBN", FilterOperator.EQ, sISBN)

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
            checkISBN: async function (oModel, sISBN) {
                return new Promise((resolve, reject) => {
                    oModel.read("/Books", {
                        filters: [
                            //new Filter("title", FilterOperator.EQ, stitle),
                            new Filter("ISBN", FilterOperator.EQ, sISBN)

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
            onDeleteBtnPress: async function () {
                var aSelectedItems = this.byId("idBookTable").getSelectedItems();
                if (aSelectedItems.length > 0) {
                    var aISBNs = [];
                    aSelectedItems.forEach(function (oSelectedItem) {
                        var sISBN = oSelectedItem.getBindingContext().getObject().title;
                        var oQuantity1 = oSelectedItem.getBindingContext().getObject().quantity
                        var oAQuantity1 = oSelectedItem.getBindingContext().getObject().availability


                        if (oQuantity1 === oAQuantity1) {
                            aISBNs.push(sISBN);
                            oSelectedItem.getBindingContext().delete("$auto");
                        }
                        else {
                            MessageToast.show("Book was in active loan")
                            return
                        }
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
                this.getView().byId("idBookTable").getBinding("items").refresh()

            },
            // onUpdateBtnPress: function () {
            //     var oBookTable = this.byId("idBookTable");
            //     var oSelectedBook = oBookTable.getSelectedItem();

            //     if (oSelectedBook) {
            //         // Get the selected book's details
            //         var oSelectedBookContext = oSelectedBook.getBindingContext();
            //         var sISBN = oSelectedBookContext.getProperty("isbn");
            //         var sTitle = oSelectedBookContext.getProperty("title");
            //         var sAuthor = oSelectedBookContext.getProperty("author");
            //         // Assuming you have other properties like title, author, etc.

            //         // Open an edit dialog
            //         this.openEditDialog(sISBN, sTitle, sAuthor); // Pass book details to the dialog
            //     } else {
            //         MessageToast.show("Please Select a Book to Edit");
            //     }
            // },
            onActiveLoansFilterPress: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteActiveLoans")
            },
            onIssueBooksFilterPress: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteIssueBooks");
               
                
            },
            onUpdateBtnPress: async function () {
                var oSelected = this.byId("idBookTable").getSelectedItems();
                if (oSelected.length === 0) {
                    MessageToast.show("Please Select atleast one Book to Edit");
                    return
                }
                if (oSelected.length > 1) {
                    MessageToast.show("Please Select only one Book to Edit");
                    return
                }
                var oSelect = oSelected[0]
                if (oSelect) {
                    var oID = oSelect.getBindingContext().getProperty("ID");
                    var oISBN = oSelect.getBindingContext().getProperty("ISBN");
                    var oAuthorName = oSelect.getBindingContext().getProperty("author");
                    var oBookname = oSelect.getBindingContext().getProperty("title");
                    this.oQuantity = oSelect.getBindingContext().getProperty("quantity");
                    //var oAuthor = oSelected.getBindingContext().getProperty("author");
                    var oGenre = oSelect.getBindingContext().getProperty("genre");
                    var oPublisher = oSelect.getBindingContext().getProperty("publisher");
                    var oLanguage = oSelect.getBindingContext().getProperty("language");
                    this.oAq = oSelect.getBindingContext().getProperty("availability");


                    var newBookModel = new sap.ui.model.json.JSONModel({
                        ID: oID,
                        ISBN: oISBN,
                        title: oBookname,
                        quantity: this.oQuantity,
                        author: oAuthorName,
                        genre: oGenre,
                        publisher: oPublisher,
                        language: oLanguage,
                        availability: this.oAq
                    });

                    this.getView().setModel(newBookModel, "newBookModel");

                    if (!this.oEditBooksDialog) {
                        this.oEditBooksDialog = await this.loadFragment("EditBookDialog"); // Load your fragment asynchronously
                    }

                    this.oEditBooksDialog.open();
                    var oPayload = this.getView().getModel("newBookModel").getData();
                    console.log(oPayload)
                }
            },

            onSave: function () {
                console.log(this.oQuantity)
                console.log(this.oAq)
                var oQ = parseInt(this.getView().byId("idEditBookQtyVal").getValue());
                var oAq = parseInt(this.getView().byId("idAvailabilityVal").getValue());
                if (this.oQuantity < oQ) {
                    oQ = oQ - this.oQuantity
                    oAq = oAq + oQ
                }
                else if (this.oQuantity > oQ) {
                    oQ = this.oQuantity - oQ
                    oAq = oAq - oQ
                }
                else {
                    oAq = oAq
                }
                console.log(oQ)
                var oPayload = this.getView().getModel("newBookModel").getData();
                oPayload.availability = oAq
                this.getView().getModel("newBookModel").setData(oPayload);
                var oDataModel = this.getOwnerComponent().getModel("ModelV2");// Assuming this is your OData V2 model
                console.log(oDataModel.getMetadata().getName());

                try {
                    // Assuming your update method is provided by your OData V2 model
                    oDataModel.update("/Books(" + oPayload.ID + ")", oPayload, {
                        success: function () {
                            this.getView().byId("idBookTable").getBinding("items").refresh();
                            this.oEditBooksDialog.close();
                        }.bind(this),
                        error: function (oError) {
                            this.oEditBooksDialog.close();
                            sap.m.MessageBox.error("Failed to update book: " + oError.message);
                        }.bind(this)
                    });
                } catch (error) {
                    this.oEditBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
                
                var oDataModel = new sap.ui.model.odata.v2.ODataModel({
                    serviceUrl: "https://port4004-workspaces-ws-ttkcq.us10.trial.applicationstudio.cloud.sap/v2/BooksSRV",
                    defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
                    // Configure message parser
                    messageParser: sap.ui.model.odata.ODataMessageParser
                })
                this.getView().byId("idBookTable").getBinding("items").refresh();
            },
            onClose: function () {
                if (this.oEditBooksDialog.isOpen()) {
                    this.oEditBooksDialog.close();
                }
            },
            onAdminNotificationPress:async function(){
                if (!this.oLoginDialog) {
                    this.oLoginDialog = await this.loadFragment("NewUserSignUp")
                }
                this.oLoginDialog.open();
            },
            onCloseDialog1:function(){
                if (this.oLoginDialog.isOpen()) {
                    this.oLoginDialog.close()
                }
            },
            onConfromPress:async function(oEvent){
                var oModel = this.getView().getModel("ModelV2");
                var oSelectedItem = oEvent.getSource().getParent().getParent();
    
                // Get the data bound to the selected item
                var oBindingContext = oSelectedItem.getBindingContext();
                
                // Get the data object associated with the selected item
                var oSelectedData = oBindingContext.getObject();
                console.log(oSelectedData)
                oSelectedData.exsist=true;
                var newBookModel = new sap.ui.model.json.JSONModel({
                    exsist:true
                });

                this.getView().setModel(newBookModel, "newBookModel");
    
                console.log(oSelectedData)
                try {
                    // Assuming your update method is provided by your OData V2 model
                    oModel.update("/Users(" + oSelectedData.ID + ")", oSelectedData, {
                        success: function () {
                            MessageToast.show("Accepted")
            
                        }.bind(this),
                        error: function (oError) {
                           
                            sap.m.MessageBox.error("Failed to update User: " );
                        }.bind(this)
                    });
                } catch (error) {
                    
                    sap.m.MessageBox.error("Some technical Issue");
                }
                
            },
            onDeletePress:function (oEvent) {
                oEvent.getSource().getParent().getParent().getBindingContext().delete("$auto");
                
            }
        });
    });
