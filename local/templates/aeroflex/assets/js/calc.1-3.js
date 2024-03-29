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
        $(window).trigger("calc_changes");
    });

    $('[name="flat"]').on("change", function () {
        const $calc = $(".calc");
        const $flat = $calc.find('[name="flat"]:checked');
        const $diameter_in = $calc.find('[name="diameter_in"]');
        const $diameter_out = $calc.find('[name="diameter_out"]');

        if ($flat.val() === "flat") {
            $diameter_in.removeClass("error");
            $diameter_out.removeClass("error");
        }
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

    $('[name="humidity_out"]').on("change", function () {
        const $calc = $(".calc");
        const $temperatureOut = $calc.find(".temperature_out");

        if ($(this).val() && $temperatureOut.val()) {
            $calc
                .find('[name="dew-point-temperature"]')
                .val(
                    AeroflexCalc.getDewPoint(
                        +$(this).val(),
                        +$temperatureOut.val()
                    )
                );
        } else {
            $calc.find('[name="dew-point-temperature"]').val("");
        }
    });

    $(".temperature_out").on("change", function () {
        const $calc = $(".calc");
        const $humidityOut = $calc.find('[name="humidity_out"]');
        const $temperatureIn = $calc.find(".temperature_in");
        const $temperatureOut = $calc.find(".temperature_out");
        const temperatureIn = parseFloat(
            $temperatureIn.val().replace(/,/, ".")
        );
        const temperatureOut = parseFloat(
            $temperatureOut.val().replace(/,/, ".")
        );

        if ($(this).val() && $humidityOut.val()) {
            $calc
                .find('[name="dew-point-temperature"]')
                .val(
                    AeroflexCalc.getDewPoint(
                        +$humidityOut.val(),
                        +$(this).val()
                    )
                );
        } else {
            $calc.find('[name="dew-point-temperature"]').val("");
        }

        const errorMessage = () => {
            if (temperatureIn > temperatureOut) {
                return `Убедитесь что температура вещества не превышает температуру окружающей воздуха`;
            }
        };

        if (!errorMessage()) {
            $temperatureOut.removeClass("error");
            $(".temperature_out_error").text("");
        }
    });

    $(window).on("calc_changes", function () {
        let $calc = $(".calc_test"),
            $temperatureOut = $calc.find(".temperature_out");

        $calc.find(".calc__result").removeClass("active");
    });

    $(".calc_test ._result").on("click", function () {
        let $calc = $(this).closest(".calc_test"),
            $flat = $calc.find('[name="flat"]:checked'),
            $position = $calc.find('[name="position"]:checked');
        ($diameter_in = $calc.find('[name="diameter_in"]')),
            ($diameter_out = $calc.find('[name="diameter_out"]')),
            ($temperatureIn = $calc.find(".temperature_in")),
            ($temperatureOut = $calc.find(".temperature_out")),
            ($humidityOut = $calc.find('[name="humidity_out"]')),
            ($dewPointTemperature = $calc.find(
                '[name="dew-point-temperature"]'
            )),
            ($material = $calc.find('[name="material"] option:selected')),
            ($pipe = $calc.find('[name="pipe"] option:selected')),
            ($result = $calc.find(".calc__result")),
            ($approx = $calc.find(".approx")),
            ($heat_coefficient = $calc.find('[name="heat_coefficient"]'));

        $approx.closest(".calc__row").addClass("hidden");

        $heat_coefficient.attr("placeholder", "");

        // Main
        const material = parseInt($material.val(), 10),
            isFlat = $flat.val() === "flat",
            isVertical = $position.val() === "vertical",
            diameterIn = parseFloat($diameter_in.val().replace(/,/, ".")),
            diameterOut = parseFloat($diameter_out.val().replace(/,/, ".")),
            temperatureIn = parseFloat($temperatureIn.val().replace(/,/, ".")),
            temperatureOut = parseFloat(
                $temperatureOut.val().replace(/,/, ".")
            ),
            humidityOut = parseFloat($humidityOut.val().replace(/,/, ".")),
            dewPointTemperature = parseFloat(
                $dewPointTemperature.val().replace(/,/, ".")
            ),
            emission = Number($pipe.val());

        AeroflexCalc.init();

        if (temperatureIn || temperatureIn === 0) {
            $heat_coefficient.attr(
                "placeholder",
                AeroflexCalc.getThermalLossCoefficient_3(
                    temperatureIn,
                    isVertical,
                    isFlat,
                    emission
                )
            );
        }

        // Extended
        const heat_coefficient = parseFloat(
            $heat_coefficient.val().replace(/,/, ".")
        );

        AeroflexCalc.init({
            heat_coefficient,
        });

        if (!isFlat) {
            if (isNaN(diameterIn)) {
                $diameter_in.addClass("error");
            }

            if (isNaN(diameterOut)) {
                $diameter_out.addClass("error");
            }
        }

        if (isNaN(temperatureIn)) {
            $temperatureIn.addClass("error");
        }

        if (isNaN(temperatureOut)) {
            $temperatureOut.addClass("error");
        }

        if (isNaN(humidityOut)) {
            $humidityOut.addClass("error");
        }

        const errorMessage = () => {
            if (temperatureIn > temperatureOut) {
                return `Убедитесь что температура вещества не превышает температуру окружающей воздуха`;
            }
        };

        if (errorMessage()) {
            $temperatureOut.addClass("error");
            $(".temperature_out_error").text(errorMessage());
        }

        if (
            !$calc.find(".error").length &&
            typeof AeroflexCalc !== "undefined"
        ) {
            let depth = AeroflexCalc.getInsulationWidthForCondensate(
                material,
                dewPointTemperature,
                emission,
                temperatureIn,
                temperatureOut,
                diameterOut,
                isFlat,
                isVertical
            );
            $result.addClass("active");

            $(".calc__result").addClass("active");
            $(".otvet").val(
                errorMessage()
                    ? "По вопросам - calc@aeroflex-russia.ru"
                    : depth.toFixed(2)
            );
        } else {
            $(".error").focus();
        }
    });
});
