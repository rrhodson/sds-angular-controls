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
      LastName: "",
      Email: "",
      PhoneNumber: "",
      City: "",
      State: "",
      ZipCode: "",
      LikesIceCream: false,
      DateOfBirth : null
    };

    vm.testForm = angular.copy(vm.masterTestForm);

    vm.states = {};
    vm.itemList = [];

    vm.save = function(testFrm){
      vm.itemList.push(vm.testForm);
      vm.testForm = angular.copy(vm.masterTestForm);
    };

    /* Grid */

    self.cols = [
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
