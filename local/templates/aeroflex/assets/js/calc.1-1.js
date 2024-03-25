$(function() {
  if (typeof $.fn.select2 !== 'undefined') {
      $('.js-select-single').select2({
          theme: "classic",
          width: '100%',
          language: 'ru'
      });

      $('.js-select-radio').select2({
          theme: "classic",
          width: '100%',
          language: 'ru',
          minimumResultsForSearch: Infinity
      });

      $('#diameter option').prop('disabled', true);
      $('#diameter optgroup').prop('disabled', true);
      $('#diameter_custom').prop('disabled', false);
      $('#diameter_custom option').prop('disabled', false);
  }
  
  $('.calc_test input, .calc_test select').on('change', function () {
      $(this).removeClass('error');
      $(window).trigger('calc_changes');
  });

  $('[name="region"]').on('change', function () {
    const $calc = $('.calc');
    const $indoor = $calc.find('[name="indoor"]:checked');

    if ($indoor.val() === 'open') {
      $temperature = $calc.find('[name="region"] option:selected').data('heat-temperature');
      
      $calc.find('.temperature_out').val($temperature);
      $calc.find('.temperature_out').prop('readonly', true);
    }
  });

  $('[name="indoor"]').on('change', function () {
    const $calc = $('.calc');
    const $indoor = $calc.find('[name="indoor"]:checked');
    const $temperature = $calc.find('[name="region"] option:selected').data('heat-temperature');
    const $surfaceInsulationTemperature = $calc.find('.surface_insulation_temperature');
    const $pipe = $calc.find('[name="pipe"] option:selected').data('material'); // material or no-material
    
    if ($indoor.val() === 'open') {
      $calc.find('.temperature_out').val($temperature);
      $calc.find('.temperature_out').prop('readonly', true);
      
      if ($pipe === 'metal') {
        $surfaceInsulationTemperature.val('55');
      };

      if ($pipe === 'no-metal') {
        $surfaceInsulationTemperature.val('60');
      }
    } 

    if ($indoor.val() === 'close') {
      $calc.find('.temperature_out').val('20');
      $calc.find('.temperature_out').prop('readonly', false);
      $surfaceInsulationTemperature.val('40');
    }

    $('.surface_insulation_temperature').trigger('change');
  });


  $('[name="diameter_type"]').on('change', function() {
      $('#diameter option').prop('disabled', true);
      $('#diameter optgroup').prop('disabled', true);
      $('#'+$(this).val()).prop('disabled', false);
      $('#'+$(this).val()+' option').prop('disabled', false);
      $('#'+$(this).val()+' option').eq(0).prop('selected', true);
      $('#diameter').trigger('change');
  });

  $('[name="diameter"]').on('change', function() {
      const $calc = $('.calc');

      if ($(this).val()) {
          $calc.find('[name="diameter_in"]').val($(this).val());
          $calc.find('[name="diameter_out"]').val($(this).find('option:selected').data('dh'));
          $calc.find('[name="diameter_in"], [name="diameter_out"]').prop('readonly', true);
      } else {
          $calc.find('[name="diameter_in"], [name="diameter_out"]').prop('readonly', false);
      }
  });

  $('[name="flat"]').on('change', function() {
      const $calc = $('.calc');

      if ($(this).val() === 'flat') {
          $calc.find('[name="diameter"]').prop('disabled', true);
          $calc.find('[name="diameter_in"]').prop('readonly', true);
          $calc.find('[name="diameter_out"]').prop('readonly', true);
      } else {
          $calc.find('[name="diameter"]').prop('disabled', false);
          $('[name="diameter"]').trigger('change');
      }
  });

  $('[name="pipe"]').on('change', function () {
    const $calc = $('.calc');
    const $indoor = $calc.find('[name="indoor"]:checked');
    const $surfaceInsulationTemperature = $calc.find('.surface_insulation_temperature');
    const currentPipeMaterial = $(this).find('option:selected').data('material');


    if (currentPipeMaterial === 'metal') {
      if($indoor.val() === 'open') {
        $surfaceInsulationTemperature.val('55')
      }
    }

    if (currentPipeMaterial === 'no-metal') {
      if($indoor.val() === 'open') {
        $surfaceInsulationTemperature.val('60')
      }
    }
    
    $('.surface_insulation_temperature').trigger('change');

  });

  $('.surface_insulation_temperature').on('change', function () {
    const $calc = $('.calc');
    const $surfaceInsulationTemperature = $calc.find('.surface_insulation_temperature');
    const $pipe = $calc.find('[name="pipe"] option:selected');
    const surfaceInsulationTemperature = parseFloat($surfaceInsulationTemperature.val().replace(/,/, '.'));
    const $indoor = $calc.find('[name="indoor"]:checked');
    const isIndoor = $indoor.val() === 'close';
    const isPipeMetal = $pipe.data('material') === 'metal';

    const errorMessage = () => {
      if (isIndoor && surfaceInsulationTemperature > 40) {
        return `Максимальная температура поверхности с указанными параметрами 40 ºС`
      }

      if (!isIndoor && isPipeMetal && surfaceInsulationTemperature > 55) {
        return `Максимальная температура поверхности с указанными параметрами 55 ºС`
      }

      if (!isIndoor && !isPipeMetal && surfaceInsulationTemperature > 60) {
        return `Максимальная температура поверхности с указанными параметрами 60 ºС`
      }
    }
    
    if (errorMessage()) {
      $surfaceInsulationTemperature.addClass('error');
      $('.surface_insulation_temperature__error').text(errorMessage());
    }

    if (!errorMessage()) {
      $surfaceInsulationTemperature.removeClass('error');
      $('.surface_insulation_temperature__error').text('');
    }
  })


  $(window).on('calc_changes', function () {
      let
          $calc = $('.calc_test'),
          $region_select = $calc.find('[name="region"]').closest('.calc__select'),
          $region = $calc.find('[name="region"] option:selected'),
          indoor = $calc.find('input[name="indoor"]:checked').val(),
          $temperatureOut = $calc.find('.temperature_out');
          

      $calc.find('.calc__result').removeClass('active');

      if (isNaN(parseFloat($region.data('heat-temperature')))) {
          $region_select.addClass('error');
      } else {
          $region_select.removeClass('error');
      }
  });
  
  $('.calc_test ._result').on('click', function () {
      let
          $calc = $(this).closest('.calc_test'),
          $region = $calc.find('[name="region"] option:selected'),
          $position = $calc.find('[name="position"]:checked'),
          $indoor = $calc.find('[name="indoor"]:checked'),
          // $hours = $calc.find('[name="hours"]:checked'),
          $flat = $calc.find('[name="flat"]:checked'),
          $diameter_in = $calc.find('[name="diameter_in"]'),
          $diameter_out = $calc.find('[name="diameter_out"]'),
          $temperatureIn = $calc.find('.temperature_in'),
          $temperatureOut = $calc.find('.temperature_out'),
          $material = $calc.find('[name="material"] option:selected'),
          $pipe = $calc.find('[name="pipe"] option:selected'),
          $result = $calc.find('.calc__result'),
          $approx = $calc.find('.approx'),
          $heat_coefficient = $calc.find('[name="heat_coefficient"]');
          $surfaceInsulationTemperature = $calc.find('.surface_insulation_temperature');

      $approx.closest('.calc__row').addClass('hidden');

      $heat_coefficient.attr('placeholder', '');


      // Main
      const
          material = parseInt($material.val(), 10),
          diameterIn = parseFloat($diameter_in.val().replace(/,/, '.')),
          diameterOut = parseFloat($diameter_out.val().replace(/,/, '.')),
          temperatureIn = parseFloat($temperatureIn.val().replace(/,/, '.')),
          temperatureOut = parseFloat($temperatureOut.val().replace(/,/, '.')),
          isIndoor = $indoor.val() === 'close',
          isFlat = $flat.val() === 'flat',
          isVertical = $position.val() === 'vertical',
          region = $region.data("heat-temperature"),
          emission = parseInt($pipe.val(), 10),
          surfaceInsulationTemperature = parseFloat($surfaceInsulationTemperature.val().replace(/,/, '.'));
      AeroflexCalc.init();

      $heat_coefficient.attr('placeholder', AeroflexCalc.getThermalLossCoefficient(isFlat, isVertical, isIndoor, emission));

      // Extended
      const
          heat_coefficient = parseFloat($heat_coefficient.val().replace(/,/, '.'));

      AeroflexCalc.init({
          heat_coefficient
      });

      const errorMessage = () => {
        const isPipeMetal = $pipe.data('material') === 'metal';

        if (isIndoor && surfaceInsulationTemperature > 40) {
          return `Максимальная температура поверхности с указанными параметрами 40 ºС`
        }

        if (!isIndoor && isPipeMetal && surfaceInsulationTemperature > 55) {
          return `Максимальная температура поверхности с указанными параметрами 55 ºС`
        }

        if (!isIndoor && !isPipeMetal && surfaceInsulationTemperature > 60) {
          return `Максимальная температура поверхности с указанными параметрами 60 ºС`
        }
      }

      if (!isFlat) {
        if (isNaN(diameterIn)) {
          $diameter_in.addClass('error');
        }

        if (isNaN(diameterOut)) {
          $diameter_out.addClass('error');
        }
      } 
      
      if (isNaN(temperatureIn)) {
          $temperatureIn.addClass('error');
      }

      if (isNaN(temperatureOut)) {
          $temperatureOut.addClass('error');
      } 

      if (errorMessage()) {
        $surfaceInsulationTemperature.addClass('error');
        $('.surface_insulation_temperature__error').text(errorMessage());
      }


      if (!$calc.find('.error').length && typeof AeroflexCalc !== 'undefined') {
        
        let depth = AeroflexCalc.getInsulationDepthWithSurfaceTemperature(material, diameterIn, diameterOut, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, emission, surfaceInsulationTemperature);
          $result.addClass('active');

          $('.calc__result').addClass('active');
          $('.otvet').val(
            errorMessage() 
            ? 'По вопросам - calc@aeroflex-russia.ru' 
            : isFlat ? depth.toFixed(2) : Math.round(depth)
            );
      }
  });
});