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
    // variables
    let cityTemperature = [27, -37];
    let disposition = "indoor";
    let materialValue = 0;
    let innerDeameter = 0;
    let outerDeameter = 0;
    let length = 100;
    let supportType = "movable";
    let typeOfTransfer = "water";
    let temperatureInitial = null;
    let temperatureFinal = null;
    let density = 1000;
    let capacity = 4.187;
    let temperatureAmbient = 20;
    let volumeFlowRate = null;
    let isolationMaterialValue = 0.0354;
    let coverMaterialValue = 0;
    // onChange
    $("#region").on("change", function () {
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
        cityTemperature = [heatTemperature, coldTemperature];
        if (disposition === "open") {
            if (temperatureInitial > 0) {
                temperatureAmbient = cityTemperature[1];
                $("#temperatureAmbientElement")
                    .val(cityTemperature[1])
                    .prop("readonly", true);
            } else {
                temperatureAmbient = cityTemperature[0];
                $("#temperatureAmbientElement")
                    .val(cityTemperature[0])
                    .prop("readonly", true);
            }
        }
    });
    $("[name=disposition]").on("click", function () {
        disposition = $(this).val();
        if (disposition === "indoor") {
            temperatureAmbient = 20;
            $("#temperatureAmbientElement")
                .val(temperatureAmbient)
                .prop("readonly", false);
        }
        if (disposition === "tunnel") {
            temperatureAmbient = 40;
            $("#temperatureAmbientElement")
                .val(temperatureAmbient)
                .prop("readonly", false);
        }
        if (disposition === "open") {
            if (temperatureInitial > 0) {
                temperatureAmbient = cityTemperature[1];
                $("#temperatureAmbientElement")
                    .val(cityTemperature[1])
                    .prop("readonly", true);
            } else {
                temperatureAmbient = cityTemperature[0];
                $("#temperatureAmbientElement")
                    .val(cityTemperature[0])
                    .prop("readonly", true);
            }
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
    $(".materialValueId").on("click", function () {
        $(".materialValue-hidden").css("display", "none");
        materialValue = 0;
    });
    $(".materialValueId1").on("click", function () {
        $(".materialValue-hidden").css("display", "none");
        materialValue = 1;
    });
    $(".materialValueId2").on("click", function () {
        $(".materialValue-hidden").css("display", "block");
        $("#materialValue0").prop("checked", "checked");
        materialValue = 0;
    });
    $("[name=materialValue]").on("click", function () {
        materialValue = Number($(this).val());
    });
    $('[name="diameter"]').on("change", function () {
        if ($(this).val()) {
            $('[name="diameter_in"], [name="diameter_out"]').removeClass(
                "error"
            );
            innerDeameter = Number($(this).val() / 1000);
            outerDeameter = $(this).find("option:selected").data("dh") / 1000;
            $('[name="diameter_in"]').val($(this).val());
            $('[name="diameter_out"]').val(
                $(this).find("option:selected").data("dh")
            );
            $('[name="diameter_in"], [name="diameter_out"]').prop(
                "readonly",
                true
            );
        } else {
            innerDeameter = 0;
            outerDeameter = 0;
            $('[name="diameter_in"], [name="diameter_out"]')
                .prop("readonly", false)
                .val(0);
        }
    });
    $('[name="diameter_in"]').on("change", function () {
        let x = Math.abs($(this).val());
        if (x < 4) {
            return $(this)
                .prop("type", "text")
                .val(`Диаметр менее 4мм не допускается`)
                .addClass("error");
        }
        innerDeameter = x / 1000;
        $(this).val(x);
        if (
            outerDeameter > 0 &&
            (innerDeameter === 0 ||
                outerDeameter < innerDeameter ||
                outerDeameter === innerDeameter)
        ) {
            $(this).addClass("error");
            $('[name="diameter_out"]').addClass("error");
        } else {
            $(this).removeClass("error");
            $('[name="diameter_out"]').removeClass("error");
        }
    });
    $('[name="diameter_in"]').on("focus", function () {
        if ($(this).attr("type") === "text") {
            $(this).removeClass("error").prop("type", "number").val(0);
        }
    });
    $('[name="diameter_out"]').on("change", function () {
        let x = Math.abs($(this).val());
        outerDeameter = x / 1000;
        $(this).val(x);
        if (
            innerDeameter === 0 ||
            outerDeameter === 0 ||
            outerDeameter < innerDeameter ||
            outerDeameter === innerDeameter
        ) {
            $(this).addClass("error");
            $('[name="diameter_in"]').addClass("error");
        } else {
            $(this).removeClass("error");
            $('[name="diameter_in"]').removeClass("error");
        }
    });
    $('[name="pipe-length"]').on("change", function () {
        length = Math.abs($(this).val());
        $(this).val(length);
        if (length === 0) {
            $(this).addClass("error");
        }
    });
    $("[name=support-types]").on("click", function () {
        supportType = $(this).val();
    });
    $("[name=type-of-transfer]").on("click", function () {
        typeOfTransfer = $(this).val();
        if ($(this).val() === "water") {
            density = 1000;
            capacity = 4.187;
            $("#density")
                .val(density)
                .removeClass("error")
                .prop("readonly", true);
            $("#capacity").val(capacity).prop("readonly", true);
        } else {
            density = 0;
            capacity = 0;
            $("#density")
                .val(density)
                .addClass("error")
                .prop("readonly", false);
            $("#capacity").val(capacity).prop("readonly", false);
        }
    });
    $("#temperatureInitial").on("change", function () {
        temperatureInitial = Number($(this).val());
        if (disposition === "open") {
            if (temperatureInitial > 0) {
                temperatureAmbient = cityTemperature[1];
                $("#temperatureAmbientElement").val(cityTemperature[1]);
            } else {
                temperatureAmbient = cityTemperature[0];
                $("#temperatureAmbientElement").val(cityTemperature[0]);
            }
        }
    });
    $("#temperatureFinal").on("change", function () {
        temperatureFinal = Number($(this).val());
    });
    $("#density").on("change", function () {
        density = Math.abs($(this).val());
        $(this).val(density);
        if (density === 0) {
            $(this).addClass("error");
        }
    });
    $("#capacity").on("change", function () {
        capacity = Number($(this).val());
    });
    $("#temperatureAmbientElement").on("change", function () {
        temperatureAmbient = Number($(this).val());
    });
    $("#volumeFlowRate").on("change", function () {
        volumeFlowRate = Math.abs($(this).val());
        if (volumeFlowRate === 0) {
            $(this).addClass("error");
        }
    });
    $("#isolationMaterialValue").on("change", function () {
        isolationMaterialValue = Number(
            $("#isolationMaterialValue option:selected").val()
        );
    });
    $("#coverMaterialValue").on("change", function () {
        coverMaterialValue = Number(
            $("#coverMaterialValue option:selected").val()
        );
    });
    $("#calc-button").on("click", function () {
        if (innerDeameter === 0) {
            $('[name="diameter_in"]').addClass("error");
        }
        if (outerDeameter === 0) {
            $('[name="diameter_out"]').addClass("error");
        }
        if (temperatureInitial === null) {
            $("#temperatureInitial").addClass("error");
        }
        if (temperatureFinal === null) {
            $("#temperatureFinal").addClass("error");
        }
        if (volumeFlowRate === null) {
            $("#volumeFlowRate").addClass("error");
        }
        let errors = $(".error");
        if (errors.length > 0) {
            $(".error").focus();
        } else {
            let calculationMethod =
                (temperatureInitial - temperatureAmbient) /
                (temperatureFinal - temperatureAmbient);
            let coefficient = AeroflexCalc.getCoefficient(
                materialValue,
                supportType,
                innerDeameter
            );
            let massFlowRate = volumeFlowRate * density;
            let thermalConductivity = AeroflexCalc.getThermalConductivity(
                isolationMaterialValue,
                temperatureInitial,
                temperatureAmbient
            );
            let RHL = AeroflexCalc.RHLMethodDetermination(
                disposition,
                coverMaterialValue,
                temperatureInitial,
                innerDeameter
            );
            let C22 = AeroflexCalc.getC22(
                massFlowRate,
                capacity,
                temperatureInitial,
                temperatureFinal
            );
            let B22 = AeroflexCalc.getB22(
                temperatureInitial,
                temperatureFinal,
                temperatureAmbient
            );
            let C48 = AeroflexCalc.getC48(
                massFlowRate,
                capacity,
                temperatureInitial,
                temperatureFinal,
                temperatureAmbient
            );
            let R2L;
            if (calculationMethod < 2) {
                let first = true;
                R2L = AeroflexCalc.getR2L(
                    first,
                    coefficient,
                    length,
                    B22,
                    C22,
                    C48
                );
            } else {
                let first = false;
                R2L = AeroflexCalc.getR2L(
                    first,
                    coefficient,
                    length,
                    B22,
                    C22,
                    C48
                );
            }
            let result = AeroflexCalc.getResult(
                outerDeameter,
                thermalConductivity,
                R2L,
                RHL
            );
            $(".calc__result").addClass("active");
            $("#result").val(result).focus();
        }
    });
});
