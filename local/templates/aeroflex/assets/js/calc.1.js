$(function () {
    if (typeof $.fn.select2 !== "undefined") {
        $(".js-select-single").select2({
            theme: "classic",
            width: "100%",
            language: "ru",
        });

        $(".js-select-radio").select2({
            theme: "classic",
            width: "100%",
            language: "ru",
            minimumResultsForSearch: Infinity,
        });

        $("#diameter option").prop("disabled", true);
        $("#diameter optgroup").prop("disabled", true);
        $("#diameter_custom").prop("disabled", false);
        $("#diameter_custom option").prop("disabled", false);
    }
    let flat = 0;

    $(window).on("load", function () {
        $(window).trigger("calc_changes");
    });

    $(".calc_test input, .calc_test select").on("change", function () {
        $(this).removeClass("error");
        $(".calc__result").removeClass("active");
    });

    $(`[name="region"], [name="indoor"]`).on("change", function () {
        $(window).trigger("calc_changes");
    });

    $('[name="diameter_type"]').on("change", function () {
        $("#diameter option").prop("disabled", true);
        $("#diameter optgroup").prop("disabled", true);
        $("#" + $(this).val()).prop("disabled", false);
        $("#" + $(this).val() + " option").prop("disabled", false);
        $("#" + $(this).val() + " option")
            .eq(0)
            .prop("selected", true);
        $("#diameter").trigger("change");
    });

    $('[name="diameter"]').on("change", function () {
        const $calc = $(".calc");
        if ($(this).val()) {
            $calc.find('[name="diameter_in"]').val($(this).val());
            $calc
                .find('[name="diameter_out"]')
                .val($(this).find("option:selected").data("dh"));
            $calc
                .find('[name="diameter_in"], [name="diameter_out"]')
                .prop("readonly", true)
                .removeClass("error");
        } else {
            $calc
                .find('[name="diameter_in"], [name="diameter_out"]')
                .prop("readonly", false);
        }
    });

    $('[name="flat"]').on("change", function () {
        const $calc = $(".calc");
        if ($(this).val() === "1") {
            flat = 1;
            $('[name="diameter"]').trigger("change");
            $calc
                .find(
                    '[name="diameter"], [name="diameter_in"], [name="diameter_out"]'
                )
                .removeClass("error");
            $calc.find(".for-flat-hidden").css("display", "flex");
        }
        if ($(this).val() === "2") {
            flat = 2;
            $calc
                .find(
                    '[name="diameter"], [name="diameter_in"], [name="diameter_out"]'
                )
                .removeClass("error");
            $calc.find(".for-flat-hidden").css("display", "none");
            $('[name="diameter"]').trigger("change");
            // $calc
            //     .find('[name="diameter_in"]')
            //     .prop("readonly", true)
            //     .prop("disabled", true)
            //     .removeClass("error");
            // $calc
            //     .find('[name="diameter_out"]')
            //     .prop("readonly", true)
            //     .prop("disabled", true)
            //     .removeClass("error");
        }
        if ($(this).val() === "3") {
            flat = 3;
            $('[name="diameter"]').trigger("change");
            $calc
                .find(
                    '[name="diameter"], [name="diameter_in"], [name="diameter_out"]'
                )
                .removeClass("error");
            $calc.find(".for-flat-hidden").css("display", "flex");
        }
    });

    $(".temperature_in").on("change", function () {
        if ($(this).val() < -200) {
            $(this).addClass("error");
            $(".temperature_out_error").text(
                `Температура вещества ниже рабочего диапазона температур изделий Aeroflex`
            );
        } else if ($(this)) {
            $(this).removeClass("error");
            $(".temperature_out_error").text(``);
        }
    });

    $(window).on("calc_changes", function () {
        let $calc = $(".calc_test"),
            $region_select = $calc
                .find('[name="region"]')
                .closest(".calc__select"),
            $region = $calc.find('[name="region"] option:selected'),
            indoor = $calc.find('input[name="indoor"]:checked').val(),
            $temperatureOut = $calc.find(".temperature_out");

        if (isNaN(parseFloat($region.data("temperature")))) {
            $region_select.addClass("error");
        } else {
            $region_select.removeClass("error");
        }

        if (indoor === "open") {
            let numTemp = "" + $region.data("temperature");
            $temperatureOut
                .prop("readonly", true)
                .val(+numTemp.replace(/,/, "."));
        }
        if (indoor === "close") {
            $temperatureOut.val(20).prop("readonly", false);
        }
        if (indoor === "tunnel") {
            $temperatureOut.val(40).prop("readonly", false);
        }
    });

    $(".calc_test ._result").on("click", function () {
        let $calc = $(this).closest(".calc_test"),
            $region = $calc.find('[name="region"] option:selected'),
            $indoor = $calc.find('[name="indoor"]:checked'),
            $hours = $calc.find('[name="hours"]:checked'),
            $diameter_in = $calc.find('[name="diameter_in"]'),
            $diameter_out = $calc.find('[name="diameter_out"]'),
            $temperatureIn = $calc.find(".temperature_in"),
            $temperatureOut = $calc.find(".temperature_out"),
            $material = $calc.find('[name="material"] option:selected'),
            $pipe = $calc.find('[name="pipe"] option:selected'),
            $result = $calc.find(".calc__result"),
            $approx = $calc.find(".approx"),
            $heat_coefficient = $calc.find('[name="heat_coefficient"]'),
            $density = $calc.find('[name="density"]');

        $approx.closest(".calc__row").addClass("hidden");
        $heat_coefficient.attr("placeholder", "");
        $density.attr("placeholder", "");

        const material = parseInt($material.val(), 10),
            diameterIn = parseFloat($diameter_in.val().replace(/,/, ".")),
            diameterOut = parseFloat($diameter_out.val().replace(/,/, ".")),
            temperatureIn = +$temperatureIn.val(),
            temperatureOut = +$temperatureOut.val(),
            isIndoor = $indoor.val() === "close" || $indoor.val() === "tunnel",
            isFlat = flat === 2,
            emission = parseInt($pipe.val(), 10),
            hours =
                $hours.val() === "heat"
                    ? +$region.data("heat_days") * 24
                    : +$hours.val();

        AeroflexCalc.init();

        if ((isNaN(diameterIn) || diameterIn < 1) && !isFlat) {
            $diameter_in.addClass("error");
        }
        if ((isNaN(diameterOut) || diameterOut < 2) && !isFlat) {
            $diameter_out.addClass("error");
        }
        if (!$temperatureIn.val()) {
            $temperatureIn.addClass("error");
        }
        if (isNaN(temperatureOut)) {
            $temperatureOut.addClass("error");
        }
        if (
            !$calc.find(".error").length &&
            typeof AeroflexCalc !== "undefined"
        ) {
            $heat_coefficient.attr(
                "placeholder",
                AeroflexCalc.getThermalLossCoefficient_4(
                    temperatureIn,
                    isIndoor,
                    emission,
                    isFlat
                )
            );
            $density.attr(
                "placeholder",
                AeroflexCalc.getSurfaceHeatFlowDensity_2(
                    diameterIn,
                    temperatureIn,
                    isIndoor,
                    hours,
                    isFlat
                )
            );
            let depth = AeroflexCalc.getSurfaceHeatFlowDepth(
                material,
                diameterIn,
                diameterOut,
                temperatureIn,
                temperatureOut,
                isIndoor,
                isFlat,
                hours,
                emission
            );

            $result.addClass("active");

            $(".calc__result").addClass("active");
            $(".otvet").val(depth.toFixed(2));
        } else {
            $(".error").focus();
        }
    });
});
