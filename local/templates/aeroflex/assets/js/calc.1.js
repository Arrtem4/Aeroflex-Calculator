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

    $(".calc_test input, .calc_test select").on("change", function () {
        $(this).removeClass("error");
        // $(window).trigger("calc_changes");
        $(".calc__result").removeClass("active");
    });
    let indoorState = "close";

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

        if ($(this).val() === "flat") {
            $calc.find('[name="diameter"]').prop("disabled", true);
            $calc.find('[name="diameter_in"]').prop("readonly", true);
            $calc.find('[name="diameter_out"]').prop("readonly", true);
        } else {
            $calc.find('[name="diameter"]').prop("disabled", false);
            $('[name="diameter"]').trigger("change");
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

    $('[name="region"]').on("change", function () {
        if (indoorState === "open") {
            let $calc = $(".calc_test"),
                $region = $calc.find('[name="region"] option:selected'),
                hours = $calc.find('input[name="hours"]:checked').val();

            $(".temperature_out").val(
                parseFloat(
                    hours === "heat"
                        ? $region.data("heat").replace(/,/, ".")
                        : $region.data("temperature").replace(/,/, ".")
                )
            );
        }
    });

    $('input[name="hours"]').on("change", function () {
        if (indoorState === "open") {
            let $calc = $(".calc_test"),
                $region = $calc.find('[name="region"] option:selected'),
                hours = $calc.find('input[name="hours"]:checked').val();

            $(".temperature_out").val(
                parseFloat(
                    hours === "heat"
                        ? $region.data("heat").replace(/,/, ".")
                        : $region.data("temperature").replace(/,/, ".")
                )
            );
        }
    });

    $('[name="indoor"]').on("change", function () {
        if ($(this).val() === "open") {
            indoorState = "open";
            let $calc = $(".calc_test"),
                $region = $calc.find('[name="region"] option:selected'),
                hours = $calc.find('input[name="hours"]:checked').val();
            $(".temperature_out")
                .prop("readonly", true)
                .val(
                    parseFloat(
                        hours === "heat"
                            ? $region.data("heat").replace(/,/, ".")
                            : $region.data("temperature").replace(/,/, ".")
                    )
                );
        }
        if ($(this).val() === "close") {
            indoorState = "close";
            $(".temperature_out").prop("readonly", false).val(20);
        }
        if ($(this).val() === "tunnel") {
            indoorState = "tunnel";
            $(".temperature_out").prop("readonly", false).val(40);
        }
    });

    // $(window).on("calc_changes", function () {
    //     let $calc = $(".calc_test"),
    //         $region_select = $calc
    //             .find('[name="region"]')
    //             .closest(".calc__select"),
    //         $region = $calc.find('[name="region"] option:selected'),
    //         indoor = $calc.find('input[name="indoor"]:checked').val(),
    //         $temperatureOut = $calc.find(".temperature_out"),
    //         hours = $calc.find('input[name="hours"]:checked').val();

    //     $calc.find(".calc__result").removeClass("active");

    //     if (isNaN(parseFloat($region.data("temperature")))) {
    //         $region_select.addClass("error");
    //     } else {
    //         $region_select.removeClass("error");
    //     }

    //     $temperatureOut.prop("readonly", true);
    //     let rty = parseFloat(
    //         hours === "heat"
    //             ? $region.data("heat").replace(/,/, ".")
    //             : $region.data("temperature").replace(/,/, ".")
    //     );

    //     console.log(rty);
    //     // $temperatureOut.val(
    //     //     hours === "heat"
    //     //         ? $region.data("heat")
    //     //         : $region.data("temperature")
    //     // );
    //     if (indoor === "close") {
    //         $temperatureOut.val(20);
    //         // $temperatureOut.prop("readonly", false);
    //     }
    // });

    $(".calc_test ._result").on("click", function () {
        let $calc = $(this).closest(".calc_test"),
            $region = $calc.find('[name="region"] option:selected'),
            $position = $calc.find('[name="position"]:checked'),
            $indoor = $calc.find('[name="indoor"]:checked'),
            $hours = $calc.find('[name="hours"]:checked'),
            $flat = $calc.find('[name="flat"]:checked'),
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

        // if (isNaN(parseFloat($region.data("heat")))) {
        //     $region.closest(".calc__select").addClass("error");
        //     return;
        // }

        // Main
        const material = parseInt($material.val(), 10),
            diameterIn = parseFloat($diameter_in.val().replace(/,/, ".")),
            diameterOut = parseFloat($diameter_out.val().replace(/,/, ".")),
            temperatureIn = +$temperatureIn.val(),
            // temperatureOut = parseFloat(
            //     $temperatureOut.val().replace(/,/, ".")
            // ),
            temperatureOut = +$temperatureOut.val(),
            isIndoor = $indoor.val() === "close" || $indoor.val() === "tunnel",
            isFlat = $flat.val() === "flat",
            isVertical = $position.val() === "vertical",
            hours =
                $hours.val() === "heat"
                    ? parseFloat($region.data("heat_days")) * 24
                    : parseFloat($hours.val()),
            emission = parseInt($pipe.val(), 10);
        console.log(
            temperatureOut,
            isIndoor,
            emission,
            isFlat,
            isVertical,
            hours,
            diameterIn,
            diameterOut
        );

        AeroflexCalc.init();

        if ($temperatureIn.val() && diameterIn) {
            $heat_coefficient.attr(
                "placeholder",
                AeroflexCalc.getThermalLossCoefficient_4(
                    temperatureIn,
                    isVertical,
                    isIndoor,
                    emission
                )
            );
        }

        // Extended
        const heat_coefficient = parseFloat(
                $heat_coefficient.val().replace(/,/, ".")
            ),
            density = parseFloat($density.val().replace(/,/, "."));

        AeroflexCalc.init({
            heat_coefficient,
            density,
        });
        if ($temperatureIn.val() && diameterIn) {
            $density.attr(
                "placeholder",
                AeroflexCalc.getSurfaceHeatFlowDensity_2(
                    diameterIn,
                    temperatureIn,
                    isIndoor,
                    hours,
                    isFlat
                ).toFixed(4)
            );
        }

        if (isNaN(diameterIn) || diameterIn < 1) {
            $diameter_in.addClass("error");
        }

        if (isNaN(diameterOut) || diameterOut < 2) {
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
            let depth = AeroflexCalc.getSurfaceHeatFlowDepth(
                material,
                diameterIn,
                diameterOut,
                temperatureIn,
                temperatureOut,
                isIndoor,
                isFlat,
                isVertical,
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
