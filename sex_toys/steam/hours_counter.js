window.hrs_wasted = 0;
$('.hours_played').each(function(){
    if ( '' != $(this).text().split(' ')[0].trim() )
    {
        window.hrs_wasted += parseFloat($(this).text().split(' ')[0].trim().replace(',', ''))
        console.log(parseFloat($(this).text().split(' ')[0].trim().replace(',', '')))
    }

});

console.log(window.hrs_wasted)