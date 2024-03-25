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

  $('[name="diameter_type"]').on('change', function() {
      $('#diameter option').prop('disabled', true);
      $('#diameter optgroup').prop('disabled', true);
      $('#'+$(this).val()).prop('disabled', false);
      $('#'+$(this).val()+' option').prop('disabled', false);
      $('#'+$(this).val()+' option').eq(0).prop('selected', true);
      $('#diameter').trigger('change');
  });

  $('[name="region"]').on('change', function () {
    const $calc = $('.calc');
    const $indoor = $calc.find('[name="indoor"]:checked');

    if ($indoor.val() === 'open') {
        let heatTemperature = $("#region option:selected").data(
            "heat-temperature"
        );
        if (typeof heatTemperature === "string") {
            heatTemperature = Number(heatTemperature.replace(",", "."));
        }
        let coldTemperature = $("#region option:selected").data(
            "cold-temperature"
        );
        if (typeof coldTemperature === "string") {
            coldTemperature = Number(coldTemperature.replace(",", "."));
        }

        const $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]');
        const gasMovingTemperature = Number($gasMovingTemperature.val().replace(",", "."));
        const $temperatureOut = $calc.find('.temperature_out');
        
        if (isNaN(parseFloat($gasMovingTemperature.val()))) {
          return;
        }

        if (gasMovingTemperature > 0) {
          $temperatureOut.val(coldTemperature);
        }

        if (gasMovingTemperature <= 0) {
          $temperatureOut.val(heatTemperature);
        }
    }
  });

  $('[name="indoor"]').on('change', function () {
    const $calc = $('.calc');
    const $indoor = $calc.find('[name="indoor"]:checked');
    const $temperatureOut = $calc.find('.temperature_out');

    let heatTemperature = $("#region option:selected").data(
      "heat-temperature"
    );
    if (typeof heatTemperature === "string") {
      heatTemperature = Number(heatTemperature.replace(",", "."));
    }
    let coldTemperature = $("#region option:selected").data(
      "cold-temperature"
    );
    if (typeof coldTemperature === "string") {
      coldTemperature = Number(coldTemperature.replace(",", "."));
    }


    if ($indoor.val() === 'open') {
      const $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]');
      const gasMovingTemperature = Number($gasMovingTemperature.val().replace(",", "."));

      if (isNaN(parseFloat($gasMovingTemperature.val()))) {
        return;
      }

      if (gasMovingTemperature > 0) {
          $temperatureOut.val(coldTemperature);
          $temperatureOut.prop('readonly', true);
          $temperatureOut.prop('disabled', true);
        }

      if (gasMovingTemperature <= 0) {
        $temperatureOut.val(heatTemperature);
      }

    } else {
      $temperatureOut.val('20')
      $temperatureOut.prop('readonly', false);
      $temperatureOut.prop('disabled', false);
    }
  });

  $('[name="gas-moving-temperature"]').on('change', function () {
    const $calc = $('.calc');
    const $indoor = $calc.find('[name="indoor"]:checked');
    const $temperatureOut = $calc.find('.temperature_out');

    const $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]');
    const gasMovingTemperature = Number($gasMovingTemperature.val().replace(",", "."));

    if (isNaN(parseFloat($gasMovingTemperature.val()))) {
      return;
    }

    if ($indoor.val() === 'open') {

      let heatTemperature = $("#region option:selected").data(
        "heat-temperature"
      );
      if (typeof heatTemperature === "string") {
        heatTemperature = Number(heatTemperature.replace(",", "."));
      }
      let coldTemperature = $("#region option:selected").data(
        "cold-temperature"
      );
      if (typeof coldTemperature === "string") {
        coldTemperature = Number(coldTemperature.replace(",", "."));
      }

      if (gasMovingTemperature > 0) {
        $temperatureOut.val(coldTemperature);
        $temperatureOut.prop('readonly', true);
        $temperatureOut.prop('disabled', true);
      }

      if (gasMovingTemperature <= 0) {
        $temperatureOut.val(heatTemperature);
        $temperatureOut.prop('readonly', false);
        $temperatureOut.prop('disabled', false);
      }
    }
  });

  $('.temperature_out').on('change', function () {
    const $calc = $('.calc');

    const currentValue = parseFloat($(this).val().replace(/,/, '.')); 
    const $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]');
    const gasMovingTemperature = parseFloat($gasMovingTemperature.val().replace(/,/, '.'));

    if (
      (isNaN(currentValue) || isNaN(gasMovingTemperature)) || 
      gasMovingTemperature >= currentValue
      ) {
        $(this).removeClass('error');
        $('.temperature_out_error').text('');
    }
  });


  $('[name="diameter"]').on('change', function() {
    const $calc = $('.calc');

    if ($(this).val()) {
        $calc.find('[name="diameter_in"]').val($(this).val());
        $calc.find('[name="diameter_out"]').val($(this).find('option:selected').data('dh'));
        $calc.find('[name="diameter_in"], [name="diameter_out"]').prop('readonly', true);
      
        $calc.find($('[name="gas-pipe-depth"]')).val(($('[name="diameter_out"]').val() - $('[name="diameter_in"]').val()) / 2)
        $calc.find('[name="diameter_in"]').removeClass('error')
        $calc.find('[name="diameter_out"]').removeClass('error')
        $calc.find($('[name="gas-pipe-depth"]')).removeClass('error')

    } else {
        $calc.find('[name="diameter_in"], [name="diameter_out"]').prop('readonly', false);
    }
  });

  $('[name="diameter_out"]').on('change', function() {
    const $calc = $('.calc');
  
    const diameterIn = $calc.find('[name="diameter_in"]').val()
    const diameterOut = $(this).val()

    if (diameterIn && diameterOut) {
      $calc.find($('[name="gas-pipe-depth"]')).val((diameterOut - diameterIn) / 2)
    }
  })

  $('[name="diameter_in"]').on('change', function() {
    const $calc = $('.calc');
  
    const diameterOut = $calc.find('[name="diameter_out"]').val()
    const diameterIn = $(this).val()

    if (diameterIn && diameterOut) {
      $calc.find($('[name="gas-pipe-depth"]')).val((diameterOut - diameterIn) / 2)
    }
  });

  $('[name="gas-pipe-type"]').on('change', function() {
      const $calc = $('.calc');
      const $diameterInRow = $calc.find('.diameter-in');
      const $diameterOutRow = $calc.find('.diameter-out');
      const $pipeTypeRow = $calc.find('.pipe-type');

      const $gasPipeWidthRow = $calc.find('.gas-pipe-width');
      const $gasPipeHeightRow = $calc.find('.gas-pipe-height');
      const $rectangularPipeDiameterOutRow = $calc.find('.rectangular-pipe-diameter-out');
      const $rectangularPipeDiameterInRow = $calc.find('.rectangular-pipe-diameter-in');
      const $gasPipeDepth = $calc.find('[name="gas-pipe-depth"]');


      if ($(this).val() === 'rectangular') {
        $calc.find('[name="gas-pipe-width"]').prop('disabled', false);
        $calc.find('[name="gas-pipe-height"]').prop('disabled', false);
        $diameterInRow.addClass('hidden');
        $diameterOutRow.addClass('hidden');
        $pipeTypeRow.addClass('hidden');

        $gasPipeWidthRow.removeClass('hidden');
        $gasPipeHeightRow.removeClass('hidden');

        $rectangularPipeDiameterOutRow.removeClass('hidden');
        $rectangularPipeDiameterInRow.removeClass('hidden');

        $gasPipeDepth.prop('disabled', false);
        $gasPipeDepth.prop('readonly', false);
        $(this).removeClass('error');
      } else {
        $(this).removeClass('error');

        $gasPipeDepth.prop('disabled', true);
        $gasPipeDepth.prop('readonly', true);

        $diameterInRow.removeClass('hidden');
        $diameterOutRow.removeClass('hidden');
        $pipeTypeRow.removeClass('hidden');

        $gasPipeWidthRow.addClass('hidden');
        $gasPipeHeightRow.addClass('hidden');

        $rectangularPipeDiameterOutRow.addClass('hidden');
        $rectangularPipeDiameterInRow.addClass('hidden');

        $calc.find('[name="gas-pipe-width"]').prop('disabled', true);
        $calc.find('[name="gas-pipe-height"]').prop('disabled', true);
      }
  });

  $('[name="coolant-type"]').on('change', function () {
    const $calc = $('.calc');

    const $gasPipeType = $calc.find('[name="gas-pipe-type"]:checked');
    const $gasSpeed = $calc.find('[name="gas-speed"]');
    const $diameterIn = $calc.find('[name="diameter_in"]');
    const $gasPipeInnerDiameter = $calc.find('[name="gas-pipe-inner-diameter"]')
    const $heatTransferCoefficient = $calc.find('[name="heat-transfer-coefficient"]');

    const gasSpeed = parseFloat($gasSpeed.val().replace(/,/, '.'));
    const gasPipeInnerDiameter = parseFloat($gasPipeInnerDiameter.val().replace(/,/, '.'));
    const diameterIn = parseFloat($diameterIn.val().replace(/,/, '.'));

    const diameterInRes = $gasPipeType.val() === 'rectangular' ? gasPipeInnerDiameter : diameterIn;

    const $gasThermalConductivity = $calc.find('[name="gas-thermal-conductivity"]');
    const $gasKinematicViscosity = $calc.find('[name="gas-kinematic-viscosity"]');
    const $gasThermalDiffusivity = $calc.find('[name="gas-thermal-diffusivity"]');

    const $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]');
    const gasMovingTemperature = parseFloat($gasMovingTemperature.val().replace(/,/, '.'));

    if ($(this).val() === 'air') {
      
      if (!isNaN(gasMovingTemperature)) {
        const {
          gasThermalConductivity,
          gasKinematicViscosity,
          gasThermalDiffusivity
        } = AeroflexCalc.getGasProperties(parseFloat($gasMovingTemperature.val().replace(/,/, '.')));
  
        $gasThermalConductivity.val(gasThermalConductivity);
        $gasKinematicViscosity.val(gasKinematicViscosity);
        $gasThermalDiffusivity.val(gasThermalDiffusivity); 
        $calc.find('[name="gas-thermal-diffusivity"], [name="gas-kinematic-viscosity"], [name="gas-thermal-conductivity"]').prop('readonly', true);
        $calc.find('[name="gas-thermal-diffusivity"], [name="gas-kinematic-viscosity"], [name="gas-thermal-conductivity"]').prop('disabled', true);

        if(
          !isNaN(gasThermalConductivity) && 
          !isNaN(gasKinematicViscosity) && 
          !isNaN(gasThermalDiffusivity) && 
          !isNaN(diameterInRes) && 
          !isNaN(gasSpeed)
          ) {
            $heatTransferCoefficient.val(AeroflexCalc.getAlphaBetaN(null, diameterInRes, gasSpeed, gasThermalConductivity, gasKinematicViscosity, gasThermalDiffusivity).toFixed(4));
        } else {
          $heatTransferCoefficient.val('')
        }
      }
      
    } else {
      $calc.find('[name="gas-thermal-diffusivity"], [name="gas-kinematic-viscosity"], [name="gas-thermal-conductivity"]').prop('readonly', false);
      $calc.find('[name="gas-thermal-diffusivity"], [name="gas-kinematic-viscosity"], [name="gas-thermal-conductivity"]').prop('disabled', false);
    }
  });

  $('[name="gas-moving-temperature"]').on('change', function() {
    const $calc = $('.calc');
    const $gasMovingHumidity = $calc.find('[name="gas-moving-humidity"]');
  
    if ($(this).val() && $gasMovingHumidity.val()) {
      $calc.find('[name="dew-point-temperature"]').val(AeroflexCalc.getGasDewPointTemperature(parseFloat($(this).val().replace(/,/, '.')), +$gasMovingHumidity.val()));
    } else {
      $calc.find('[name="dew-point-temperature"]').val('');
    }
  });

  
  $('[name="gas-moving-temperature"]').on('change', function () {
    const $calc = $('.calc');

    const $temperatureOut = $calc.find('.temperature_out')
    const $coolantType = $calc.find('[name="coolant-type"]:checked');
    const $gasMovingHumidity = $calc.find('[name="gas-moving-humidity"]');
    const $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]');

    const $gasThermalConductivity = $calc.find('[name="gas-thermal-conductivity"]');
    const $gasKinematicViscosity = $calc.find('[name="gas-kinematic-viscosity"]');
    const $gasThermalDiffusivity = $calc.find('[name="gas-thermal-diffusivity"]');

    const currentValue = parseFloat($(this).val().replace(/,/, '.')); 
    const temperatureOut = parseFloat($temperatureOut.val().replace(/,/, '.')); 
    
    if (
      (isNaN(currentValue) || isNaN(temperatureOut)) || 
      currentValue >= temperatureOut
      ) {
        $temperatureOut.removeClass('error');
        $('.temperature_out_error').text('');
    }

    if (!isNaN(currentValue) && $coolantType.val() === 'air') {
      const {
        gasThermalConductivity,
        gasKinematicViscosity,
        gasThermalDiffusivity
      } = AeroflexCalc.getGasProperties(currentValue);

      $gasThermalConductivity.val(gasThermalConductivity);
      $gasKinematicViscosity.val(gasKinematicViscosity);
      $gasThermalDiffusivity.val(gasThermalDiffusivity);
    }
  });

  $('[name="gas-thermal-conductivity"]').on('change', function() {
    const $calc = $('.calc');
    const $coolantType = $calc.find('[name="coolant-type"]:checked');

    const $gasPipeType = $calc.find('[name="gas-pipe-type"]:checked');
    const $gasSpeed = $calc.find('[name="gas-speed"]');
    const $diameterIn = $calc.find('[name="diameter_in"]');
    const $gasPipeInnerDiameter = $calc.find('[name="gas-pipe-inner-diameter"]')
    const $heatTransferCoefficient = $calc.find('[name="heat-transfer-coefficient"]');

    const $gasKinematicViscosity = $calc.find('[name="gas-kinematic-viscosity"]');
    const $gasThermalDiffusivity = $calc.find('[name="gas-thermal-diffusivity"]');

    const gasThermalDiffusivity = parseFloat($gasThermalDiffusivity.val().replace(/,/, '.'));
    const gasKinematicViscosity = parseFloat($gasKinematicViscosity.val().replace(/,/, '.'));
    const currentValue = parseFloat($(this).val().replace(/,/, '.'));

    const gasSpeed = parseFloat($gasSpeed.val().replace(/,/, '.'));
    const gasPipeInnerDiameter = parseFloat($gasPipeInnerDiameter.val().replace(/,/, '.'));
    const diameterIn = parseFloat($diameterIn.val().replace(/,/, '.'));

    const diameterInRes = $gasPipeType.val() === 'rectangular' ? gasPipeInnerDiameter : diameterIn;

    if ($coolantType.val() === 'other') {
      if(
        !isNaN(currentValue) && 
        !isNaN(gasKinematicViscosity) && 
        !isNaN(gasThermalDiffusivity) && 
        !isNaN(diameterInRes) && 
        !isNaN(gasSpeed)
        ) {
          $heatTransferCoefficient.val(AeroflexCalc.getAlphaBetaN(null, diameterInRes, gasSpeed, currentValue, gasKinematicViscosity, gasThermalDiffusivity).toFixed(4));
      } else {
        $heatTransferCoefficient.val('')
      }

    }

  });

  $('[name="gas-kinematic-viscosity"]').on('change', function() {
    const $calc = $('.calc');
    const $coolantType = $calc.find('[name="coolant-type"]:checked');

    const $gasPipeType = $calc.find('[name="gas-pipe-type"]:checked');
    const $gasSpeed = $calc.find('[name="gas-speed"]');
    const $diameterIn = $calc.find('[name="diameter_in"]');
    const $gasPipeInnerDiameter = $calc.find('[name="gas-pipe-inner-diameter"]')
    const $heatTransferCoefficient = $calc.find('[name="heat-transfer-coefficient"]');

    const $gasThermalConductivity = $calc.find('[name="gas-thermal-conductivity"]');
    const $gasThermalDiffusivity = $calc.find('[name="gas-thermal-diffusivity"]');
    
    const gasThermalConductivity = parseFloat($gasThermalConductivity.val().replace(/,/, '.'));
    const gasThermalDiffusivity = parseFloat($gasThermalDiffusivity.val().replace(/,/, '.'));
    const currentValue = parseFloat($(this).val().replace(/,/, '.'));

    const gasSpeed = parseFloat($gasSpeed.val().replace(/,/, '.'));
    const gasPipeInnerDiameter = parseFloat($gasPipeInnerDiameter.val().replace(/,/, '.'));
    const diameterIn = parseFloat($diameterIn.val().replace(/,/, '.'));

    const diameterInRes = $gasPipeType.val() === 'rectangular' ? gasPipeInnerDiameter : diameterIn;

    if ($coolantType.val() === 'other') {
      if(
        !isNaN(currentValue) && 
        !isNaN(gasThermalConductivity) && 
        !isNaN(gasThermalDiffusivity) && 
        !isNaN(diameterInRes) && 
        !isNaN(gasSpeed)
        ) {
          $heatTransferCoefficient.val(AeroflexCalc.getAlphaBetaN(null, diameterInRes, gasSpeed, gasThermalConductivity, currentValue, gasThermalDiffusivity).toFixed(4));
      } else {
        $heatTransferCoefficient.val('')
      }
    }
  });

  $('[name="gas-thermal-diffusivity"]').on('change', function() {
    const $calc = $('.calc');
    const $coolantType = $calc.find('[name="coolant-type"]:checked');

    const $gasPipeType = $calc.find('[name="gas-pipe-type"]:checked');
    const $gasSpeed = $calc.find('[name="gas-speed"]');
    const $diameterIn = $calc.find('[name="diameter_in"]');
    const $gasPipeInnerDiameter = $calc.find('[name="gas-pipe-inner-diameter"]')
    const $heatTransferCoefficient = $calc.find('[name="heat-transfer-coefficient"]');

    const $gasThermalConductivity = $calc.find('[name="gas-thermal-conductivity"]');
    const $gasKinematicViscosity = $calc.find('[name="gas-kinematic-viscosity"]');

    const gasThermalConductivity = parseFloat($gasThermalConductivity.val().replace(/,/, '.'));
    const gasKinematicViscosity = parseFloat($gasKinematicViscosity.val().replace(/,/, '.'));
    const currentValue = parseFloat($(this).val().replace(/,/, '.'));

    const gasSpeed = parseFloat($gasSpeed.val().replace(/,/, '.'));
    const gasPipeInnerDiameter = parseFloat($gasPipeInnerDiameter.val().replace(/,/, '.'));
    const diameterIn = parseFloat($diameterIn.val().replace(/,/, '.'));

    const diameterInRes = $gasPipeType.val() === 'rectangular' ? gasPipeInnerDiameter : diameterIn;

    if ($coolantType.val() === 'other') {
      if(
        !isNaN(currentValue) && 
        !isNaN(gasThermalConductivity) && 
        !isNaN(gasKinematicViscosity) && 
        !isNaN(diameterInRes) && 
        !isNaN(gasSpeed)
        ) {
          $heatTransferCoefficient.val(AeroflexCalc.getAlphaBetaN(null, diameterInRes, gasSpeed, gasThermalConductivity, gasKinematicViscosity, currentValue).toFixed(4));
      } else {
        $heatTransferCoefficient.val('')
      }
    }
  });


  $('[name="gas-pipe-width"]').on('change', function () {
    const $calc = $('.calc');
    const $gasPipeHeight = $calc.find('[name="gas-pipe-height"]');
    const $gasPipeOuterDiameter = $calc.find('[name="gas-pipe-outer-diameter"]');

    if($(this).val() && $gasPipeHeight.val()) {
      const diameterOuter = AeroflexCalc.getRectangularPipeDiameter(parseFloat($(this).val().replace(/,/, '.')), parseFloat($gasPipeHeight.val().replace(/,/, '.')))
      $gasPipeOuterDiameter.val(diameterOuter.toFixed(3))
    } 

    if (!$(this).val()) {
      $gasPipeOuterDiameter.val('')
    }
  });

  $('[name="gas-pipe-height"]').on('change', function () {
    const $calc = $('.calc');
    const $gasPipeWidth = $calc.find('[name="gas-pipe-width"]');
    const $gasPipeOuterDiameter = $calc.find('[name="gas-pipe-outer-diameter"]');

    if($(this).val() && $gasPipeWidth.val()) {
      const diameterOuter = AeroflexCalc.getRectangularPipeDiameter(parseFloat($gasPipeWidth.val().replace(/,/, '.')), parseFloat($(this).val().replace(/,/, '.'))) * 1000
      $gasPipeOuterDiameter.val(diameterOuter.toFixed(0))
    } 

    if (!$(this).val()) {
      $gasPipeOuterDiameter.val('')
    }
  });

  $('[name="gas-pipe-depth"]').on('change', function () {
    const $calc = $('.calc');
    const $gasType = $calc.find('[name="gas-pipe-type"]:checked');

    if ($gasType.val() === 'rectangular') {
      const $gasPipeHeight = $calc.find('[name="gas-pipe-height"]');
      const $gasPipeWidth = $calc.find('[name="gas-pipe-width"]');
      const $innerDiameter = $calc.find('[name="gas-pipe-inner-diameter"]');
     
      if($(this).val() && $gasPipeHeight.val() && $gasPipeWidth.val()) {
        const diameterOuter = AeroflexCalc.getRectangularPipeDiameter(parseFloat($gasPipeWidth.val().replace(/,/, '.')), parseFloat($gasPipeHeight.val().replace(/,/, '.'))) * 1000
        const width = parseFloat($(this).val().replace(/,/, '.'));
        const diameterInner = diameterOuter.toFixed(0) - 2 * width;
        
        $innerDiameter.val(diameterInner)
      }
  
      if(!$(this).val()) {
        $innerDiameter.val('');
      }
    }
   });

  $('[name="gas-moving-humidity"]').on('change', function () {
    const $calc = $('.calc');
    const $temperatureOut = $calc.find('.temperature_out');
    const $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]');

    if ($(this).val() && $gasMovingTemperature.val()) {
      $calc.find('[name="dew-point-temperature"]').val(AeroflexCalc.getGasDewPointTemperature(+$gasMovingTemperature.val() , +$(this).val()))
    } else {
      $calc.find('[name="dew-point-temperature"]').val('');
    }
  });

  $(window).on('calc_changes', function () {
      let
          $calc = $('.calc_test'),
          $temperatureOut = $calc.find('.temperature_out');
          
      $calc.find('.calc__result').removeClass('active');
  });

  $('.calc_test ._result').on('click', function () {
      let
          $calc = $(this).closest('.calc_test'),          
          $material = $calc.find('[name="material"] option:selected'),
          $pipe = $calc.find('[name="pipe"] option:selected'),
          $result = $calc.find('.calc__result'),
          $approx = $calc.find('.approx'),
          $position = $calc.find('[name="position"]:checked'),
          $indoor = $calc.find('[name="indoor"]:checked'),
          $region = $calc.find('[name="region"] option:selected'),
          $diameterIn = $calc.find('[name="diameter_in"]'),
          $diameterOut = $calc.find('[name="diameter_out"]'),
          //газ 
          $gasPipeType = $calc.find('[name="gas-pipe-type"]:checked'), // вид газохода
          $gasPipeWidth = $calc.find('[name="gas-pipe-width"]'), // ширина газохода
          $gasPipeHeight = $calc.find('[name="gas-pipe-height"]'), // высота газохода
          $gasPipeLength = $calc.find('[name="gas-pipe-length"]'), // длина газохода
          $gasPipeOuterDiameter = $calc.find('[name="gas-pipe-outer-diameter"]'), // внешний (приведенный) диаметр газохода
          $gasPipeInnerDiameter = $calc.find('[name="gas-pipe-inner-diameter"]'), // внутренний (приведенный) диаметр газохода
          $gasPipeDepth = $calc.find('[name="gas-pipe-depth"]'), //толщина стенки газохода
          $coolantType = $calc.find('[name="coolant-type"]:checked'), // вид тпелоносителя
          $gasTemperature = $calc.find('[name="gas-temperature"]'), // темература газа(теплоносителя)
          $temperatureOut = $calc.find('.temperature_out'), // температруа окружающего воздуха
          $gasMovingHumidity = $calc.find('[name="gas-moving-humidity"]'), // влажность транспортируемого газа
          $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]'), // температура транспортируемого газа(теплоносителя)
          $dewPointTemperature = $calc.find('[name="dew-point-temperature"]'), // точка росы
          $gasSpeed = $calc.find('[name="gas-speed"]'), // скорость движения газа
          $gasThermalConductivity = $calc.find('[name="gas-thermal-conductivity"]'), // теплопроводность газа
          $gasKinematicViscosity = $calc.find('[name="gas-kinematic-viscosity"]'), // кинематическая вязкость газа(теплоносителя)
          $gasThermalDiffusivity = $calc.find('[name="gas-thermal-diffusivity"]') // Температуропроводность газа
          $heatTransferCoefficient = $calc.find('[name="heat-transfer-coefficient"]'), // Коэффициент теплоотдачи внутренней поверхности стенки изолируемого объекта
          $heat_coefficient = $calc.find('[name="heat_coefficient"]');

      $approx.closest('.calc__row').addClass('hidden');

      $heat_coefficient.attr('placeholder', '');

    
      // Main
      const
          material = parseInt($material.val(), 10),
          isIndoor = $indoor.val() === 'close',
          isVertical = $position.val() === 'vertical',
          diameterIn = parseFloat($diameterIn.val().replace(/,/, '.')),
          diameterOut = parseFloat($diameterOut.val().replace(/,/, '.')),
          temperatureOut = parseFloat($temperatureOut.val().replace(/,/, '.')),
          gasPipeHeight = parseFloat($gasPipeHeight.val().replace(/,/, '.')),
          gasPipeWidth = parseFloat($gasPipeWidth.val().replace(/,/, '.')),
          gasPipeDepth = parseFloat($gasPipeDepth.val().replace(/,/, '.')),

          gasMovingTemperature = parseFloat($gasMovingTemperature.val().replace(/,/, '.')),

          gasThermalConductivity = parseFloat($gasThermalConductivity.val().replace(/,/, '.')),
          gasKinematicViscosity = parseFloat($gasKinematicViscosity.val().replace(/,/, '.')),
          gasThermalDiffusivity = parseFloat($gasThermalDiffusivity .val().replace(/,/, '.')),

          dewPointTemperature = parseFloat($dewPointTemperature.val().replace(/,/, '.')),
          gasSpeed = parseFloat($gasSpeed.val().replace(/,/, '.')),
          gasMovingHumidity = parseFloat($gasMovingHumidity.val().replace(/,/, '.')),
          gasPipeOuterDiameter = parseFloat($gasPipeOuterDiameter.val().replace(/,/, '.')),
          gasPipeInnerDiameter = parseFloat($gasPipeInnerDiameter.val().replace(/,/, '.')),
          emission = parseInt($pipe.val(), 10);

      console.log({ 
        gasThermalConductivity,
        gasKinematicViscosity,
        gasThermalDiffusivity
       })

      if ($gasPipeType.val() === 'rectangular') {

        if (isNaN(gasPipeHeight)) {
          $gasPipeHeight.addClass('error');
        }

        if (isNaN(gasPipeWidth)) {
          $gasPipeWidth.addClass('error');
        }

        if (isNaN(gasPipeDepth)) {
          $gasPipeDepth.addClass('error');
        }
      }

      if ($gasPipeType.val() === 'circle') {

        if (isNaN(diameterIn)) {
          $diameterIn.addClass('error');
        }

        if (isNaN(diameterOut)) {
          $diameterOut.addClass('error');
        }
      }

      if (isNaN(gasMovingTemperature)) {
        $gasMovingTemperature.addClass('error');
      }

      if (isNaN(temperatureOut)) {
        $temperatureOut.addClass('error');
      } 

      if (isNaN(gasMovingHumidity)) {
        $gasMovingHumidity.addClass('error');
      }

      if(isNaN(gasSpeed)) {
        $gasSpeed.addClass('error');
      };

      const errorMessage = () => {
        if (gasMovingTemperature < temperatureOut) {
          return `Температура вещества ниже температуры окружающего воздуха. Выполнение расчёта невозможно.`
        }
      }

      if (errorMessage()) {
        $temperatureOut.addClass('error');
        $('.temperature_out_error').text(errorMessage());
      }

      AeroflexCalc.init();

      $heat_coefficient.attr('placeholder', AeroflexCalc.getThermalLossCoefficient(false, isVertical, isIndoor, emission));

      const diameterInRes = $gasPipeType.val() === 'rectangular' ? gasPipeInnerDiameter : diameterIn;
      
      $heatTransferCoefficient.val(AeroflexCalc.getAlphaBetaN(gasMovingTemperature, diameterInRes, gasSpeed, gasThermalConductivity, gasKinematicViscosity, gasThermalDiffusivity).toFixed(4));
     
      const heat_coefficient = parseFloat($heat_coefficient.val().replace(/,/, '.'));
 

      AeroflexCalc.init({
          heat_coefficient
      });


      if (!$calc.find('.error').length && typeof AeroflexCalc !== 'undefined') {

        const diameterInRes = $gasPipeType.val() === 'rectangular' ? gasPipeInnerDiameter : diameterIn;
        const diameterOutRes = $gasPipeType.val() === 'rectangular' ? gasPipeOuterDiameter : diameterOut;

        
        let depth = AeroflexCalc.getGasPipeInsulationWidth(
          gasMovingTemperature,
           gasMovingHumidity, 
           material,
          temperatureOut, 
          diameterInRes,
          diameterOutRes, 
          gasSpeed, 
          emission, 
          isVertical, 
          isIndoor, 
          gasThermalConductivity,
          gasKinematicViscosity,
          gasThermalDiffusivity
          );
          $result.addClass('active');
            
          $('.calc__result').addClass('active');
          $('.otvet').val(depth.toFixed(2));
      }
  });
});