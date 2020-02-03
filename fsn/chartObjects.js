var ctx = document.getElementById('SF1672').getContext('2d');

var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels:['A', 'B', 'C', 'D', 'E', 'F'],
        datasets: [{
            label: 'Betyg SF1672',
            data: [22, 21, 17, 15, 10, 54],
            backgroundColor: "rgba(66, 245, 90, 0.6)"
        }]
    },
    options: {
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        },
        title: {
            display: true,
            fontSize: 15,
            text: "Visualisering av betygsfördelning för linjär algebra - 2018 (datan kan var felaktig för tillfället)"
        }
    }
});