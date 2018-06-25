let ddDataFrom = [{
    text: "RSD",
    value: 0,
    selected: false,
    imageSrc: 'flags/rsd.svg',
    kurs: 1
}];
let ddDataTo = [{
    text: "RSD",
    value: 0,
    selected: true,
    imageSrc: 'flags/rsd.svg',
    kurs: 1
}];


$.ajax({
    url: 'https://api.kursna-lista.info/e3922989d524b9064586385c0ab35933/kursna_lista/json',
    dataType: 'jsonp'})
  .done(function (data) {
    for (const key in data.result) {
        if (key !== "date") {
            ddDataFrom.push({
                text: key.toLocaleUpperCase(),
                value: ddDataFrom.length,
                selected: key === "eur" ? true : false,
                imageSrc: `flags/${key}.svg`,
                kurs: parseFloat(data.result[key].sre, 2)
            })
            ddDataTo.push({
                text: key.toLocaleUpperCase(),
                value: ddDataTo.length,
                selected: false,
                imageSrc: `flags/${key}.svg`,
                kurs: parseFloat(data.result[key].sre)
            })   
        }
    }
    convertorStart()
  })

function markSelectedTo(data) {
   ddDataTo = ddDataTo.map(data => $.extend(data, {selected:false}))
   data.selectedData.selected = true
}

function markSelectedFrom(data) {
    ddDataFrom = ddDataFrom.map(data => $.extend(data, {selected:false}))
    data.selectedData.selected = true
 }


function convertorStart() {
    //init for the "from currency" selectpicker with icons
    $('#currencyFrom').ddslick({
        data: ddDataFrom,
        imagePosition: "left",
        onSelected: data => markSelectedFrom(data)
    });
    
    //init for the "to currency" selectpicker with icons
    $('#currencyTo').ddslick({
        data: ddDataTo,
        imagePosition: "left",
        onSelected: data => markSelectedTo(data)
    });

    //switch handler currencies go "from -> to & to -> from"
    $('#switch').on('click', function() {
        $('#enterFrom').val('');
        $('#result').val('');
        let fromId = ddDataFrom.filter(data => data.selected)[0].value;
        let toId = ddDataTo.filter(data => data.selected)[0].value
        $('#currencyFrom').ddslick('select', {index : toId});
        $('#currencyTo').ddslick('select', {index : fromId});
    })

    //handler which is calculating the currency exchange
    $('#calculate').on('click', function() {
        if ($('#enterFrom').val() && $('#enterFrom').val() != 0) {
            let fromKurs = ddDataFrom.filter(data => data.selected)[0].kurs;
            let toKurs = ddDataTo.filter(data => data.selected)[0].kurs;
            const result = (fromKurs/toKurs) * $('#enterFrom').val();
            $('#result').val(result.toFixed(2));
        }
    })
}