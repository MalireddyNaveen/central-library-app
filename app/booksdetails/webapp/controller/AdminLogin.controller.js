sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
 
      return BaseController.extend("com.app.booksdetails.controller.AdminLogin", {
        onInit: function() {
        },
        AdminBtnClick : function(){
            var oUser = this.getView().byId("user").getValue();  //get input value data in oUser variable
            var oPwd = this.getView().byId("pwd").getValue();    //get input value data in oPwd variable
           
            if(oUser==="admin" && oPwd==="admin@123"){              
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteAdmin")
            }          
            else{
                alert("Re-Enter your Detail");
            }
        }
      });
    }
  );