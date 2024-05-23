sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
 
        return Controller.extend("com.app.booksdetails.controller.Home", {
            onInit: function () {
 
            },
           
            userlogin:function(){
                const router=this.getOwnerComponent().getRouter();
                router.navTo("RouteLogin")
            },
            AdminLogin:function(){
                const orouter=this.getOwnerComponent().getRouter();
                orouter.navTo("RouteAdminLogin")
            }
           
        });
    });