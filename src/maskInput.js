/**
 * Created by stevegentile on 12/18/14.
 *
 * Simple Angular Wrapper around the MaskedInputPlugin
 * http://digitalbush.com/projects/masked-input-plugin
 *
 * usage.... input mask-input="(999)-999-9999)
 *
 */
(function () {
  'use strict';
  function maskInput (){
    return {
      restrict: 'A',
      scope:{
        maskInput: '@'
      },
      link: function (scope, element) {
        $(element).mask(scope.maskInput);
      }
    };
  }

  angular.module('sds-angular-controls').directive('maskInput', maskInput);
})();
