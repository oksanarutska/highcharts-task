$(document).ready(async function () {
    const addZero = number => {
        return number > 9
            ? number
            : "0" + number
    }

    const yearsCount = 20;
    const result = {
        'Years': [],
        'USD': [],
        'EUR': []
    };

    for(let i = yearsCount; i >= 0 ; i--){
        const currentDate = new Date();
        const searchYear = currentDate.getFullYear() - i;
        currentDate.setDate(1);
        currentDate.setMonth(0);
        currentDate.setFullYear(searchYear);

        result.Years.push(searchYear);

        console.log("LOOKING FOR RATES: " + searchYear);

        const dateString = `${currentDate.getFullYear()}${addZero(currentDate.getDate())}${addZero(currentDate.getMonth() + 1)}`;

        await fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateString}&json`)
           .then(async function (response) {
               if (response.status !== 200) {
                   console.error(response);
                   return;
               }

               const data = await response.json()
               const usdRate = data.find(x => x.cc === 'USD');
               const eurRate = data.find(x => x.cc === 'EUR');


               console.log("FOUND USD Rate: " + usdRate.rate);
               console.log("FOUND EUR Rate: " + eurRate.rate);
               result.USD.push(usdRate.rate);
               result.EUR.push(eurRate.rate);
           })
    }

    Highcharts.chart('chart', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Chart of currency rates/UAH per year'
        },
        xAxis: {
            title: {
                text: 'Years'
            },
            categories: result.Years
        },
        yAxis: {
            title: {
                text: 'Currency rates'
            }
        },
        series: [{
            name: 'USD',
            color: 'red',
            data: result.USD
        }, {
            name: 'EUR',
            color: 'black',
            data: result.EUR
        }]
    });
});

