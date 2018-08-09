/**
 * Created by Equipo 1 on 28/06/2016.
 */

(function() {
    'use strict';

    angular
        .module('app')
        .factory('serviceLogin', serviceLogin);

    serviceLogin.$inject = ['$http', '$q', '$state', '$sessionStorage'];


    function serviceLogin($http, $q, $state, $sessionStorage) {

       
            
         /**   $.ajax('app/login.php',{
               data : eval(datos),
                dataType: 'json',
                method: 'POST'
        
    }); **/



          /**
           * var url = "app/login.php";

           var datos = { 'username': username , 'password' :password};

           datos = JSON.stringify(datos);
           * $.ajax({
                type : 'POST',
                url : url,
                data :  datos,
              //  dataType: "json",
                    success: function (response) {
                        response = JSON.parse(response);
                        console.log(response);
                        window.location=response;

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        window.location = 'app';
                        alert("Usuario o Contraseña mal escrita");
                    }

            }

            ); **/


              //  var redireccionar =JSON.parse() ;
           //window.location="http://godoycruz.gestionyservicios.com.ar/es";



     
    }
})();