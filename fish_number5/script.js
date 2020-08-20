"use strict";

let value = undefined;
let start = undefined;
let step = 0;
const options = {};

$(function(){
    let reset = function(){
        start = $('#start_value').val();
        step = 0;
        value = stringToValue(start);
        $('#lists').empty();
    };
    $('#reset').click(reset);

    $('#next').click(function(){
        if (start != $('#start_value').val()) reset();
        click_next();
        $('html, body').scrollTop($('#next').offset().top);
    });

    let getFormValue = function(elm){
        switch(elm.type){
            case 'select-one':
            case 'text':
            case 'radio':
                return $(elm).val();
            case 'checkbox':
                return elm.checked
        }
    };
    $('#options input, #options select').each(function(index, element){
        options[element.name] = getFormValue(element);
        $(element).change(function(){
            options[this.name] = getFormValue(this);
        })
    });

    $('#description_on').click(function(){
        $('#description_on').hide();
        $('#description_off').show();
        $('#description').show('normal');
    });
    $('#description_off').click(function(){
        $('#description_on').show();
        $('#description_off').hide();
        $('#description').hide('normal');
    });

    reset();
    $('#next').focus();
});

function stepString(step){
    return '<span class="step">step' + step + ': </span>';
}

function setStepValue(string, step){
    let innerHTML = stepString(step) + string;
    if ($('#step' + step).length){
        $('#step' + step).html(innerHTML)
    } else {
        $('#lists').append('<p id="step' + step + '">' + innerHTML + '</p>');
    }
    if (typeof MathJax != 'undefined') MathJax.typesetPromise([$('#step' + step).get(0)]);
}

function calculationEnd(){
    if (Array.isArray(value)) return value.length == 0;
    if (typeof value == 'string') return value.replace(/<[^>]+>/g, '').match(/^\d*$/);
    return false;
}

function click_next(){
    if (typeof value === 'undefined' || calculationEnd()) return;
    step++;
    let new_value = next_step();
    switch(typeof new_value){
        case 'string':
            break;
        case 'undefined':
            new_value = value;
        default:
            new_value = new_value.toString();
    }
    setStepValue(new_value, step);
}

function stringToValue(string){
    return string;
}

function stringToValueByJSON(string){
    try {
        return JSON.parse(string)
    } catch {
        return undefined;
    }
}
