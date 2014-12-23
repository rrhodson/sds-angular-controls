/**
 * Created by stevegentile on 12/18/14.
 */
(function (){
  'use strict';

  angular.module('myApp', [
    'ngSanitize',
    'ngMessages',
    'toggle-switch',
    'sds-angular-controls'
  ]);

  angular.module('myApp').controller("DemoCtrl", function() {
    var vm = this;

    vm.masterTestForm = {
      FirstName: "",
      LastName: "Gentile",
      Email: "",
      PhoneNumber: "",
      Age: 25,
      City: "",
      State: "",
      ZipCode: "",
      Price:  5.983,
      LikesIceCream: false,
      DateOfBirth : null
    };

    vm.testForm = angular.copy(vm.masterTestForm);


    vm.states = [
      {stateCode: "OH", stateName: "Ohio"},
      {stateCode: "IN", stateName: "Indiana"},
      {stateCode: "MI", stateName: "Michigan"}
    ];
    vm.itemList = [];

    vm.save = function(testFrm){
      debugger;
      if(!testFrm.$invalid) {
        vm.itemList.push(vm.testForm);
        vm.testForm = angular.copy(vm.masterTestForm);
        testFrm.$setPristine(true);
        testFrm.$setDirty(false);
      }
    };

    /* Grid */

    vm.cols = [
      {name: 'First Name', key:"FirstName", sortable: true},
      {name: 'Last Name', key:"LastName", sortable: true},
      {name: 'DOB', key:"DateOfBirth", sortable:false},
      {name: 'Email', key:"Email", template: '<a href="mailto:{{Email}}">{{Email}}</a>'},
      {template: '<a href="#" class="btn btn-danger">Delete</a>',  callback: deleteItem}
    ];

    function deleteItem (item){
      window.alert('todo: delete ' + item);
    }

  });
})();
