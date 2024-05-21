function addProgressCircle(key, value, color) {
    const circleContainer = document.createElement('div');
    circleContainer.classList.add('progress-circle');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');

    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.classList.add('progress-circle-bg');
    bgCircle.setAttribute('cx', '50');
    bgCircle.setAttribute('cy', '50');
    bgCircle.setAttribute('r', '30');

    const barCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    barCircle.classList.add('progress-circle-bar');
    barCircle.setAttribute('cx', '50');
    barCircle.setAttribute('cy', '50');
    barCircle.setAttribute('r', '30');
    barCircle.style.stroke = color;

    const progress = (2 * Math.PI * 30 * value) / 100;
    barCircle.style.strokeDashoffset = `calc(180 - ${progress})`;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '52%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '15');
    text.textContent = `${value}%`;

    svg.appendChild(bgCircle);
    svg.appendChild(barCircle);
    svg.appendChild(text);
    circleContainer.appendChild(svg);

    const type = document.createElement('div');
    type.classList.add('type');
    type.textContent = key;
    circleContainer.appendChild(type);

    const circChart = document.querySelector('.circ_chart');
    circChart.appendChild(circleContainer);
}

function results(jsonData) {
    
    const data = JSON.parse(jsonData);
    let hundredCount = 0;

    data.forEach(function (item) {
        Object.keys(item).forEach(function (key) {
            const value = item[key];
            if (value === 100) {
                hundredCount++;
            }
        });
    });

    const degerlendirmeSection = document.querySelector('#degerlendirme');
    const successCard = document.querySelector('.card.chart-container.p-3-1');
    const failureCard = document.querySelector('.card.chart-container.p-3-2');

    degerlendirmeSection.style.display = 'block';

    if (hundredCount >= 3) {
        successCard.style.display = 'none';
        failureCard.style.display = 'flex';
    } else {
        failureCard.style.display = 'none';
        successCard.style.display = 'flex';

        data.forEach(function (item) {
            Object.keys(item).forEach(function (key) {
                const value = item[key];
                switch (key) {
                    case 'spontan':
                    case 'planlı':
                        addProgressCircle(key, value, '#c1121f');
                        break;
                    case 'bağımsız':
                    case 'uyumlu':
                        addProgressCircle(key, value, '#335c67');
                        break;
                    case 'anlayışlı':
                    case 'disiplinli':
                        addProgressCircle(key, value, '#70e000');
                        break;
                    case 'geleneksel':
                    case 'modern':
                        addProgressCircle(key, value, '#9d4edd');
                        break;
                    case 'samimi':
                    case 'mesafeli':
                        addProgressCircle(key, value, 'dodgerblue');
                        break;
                    case 'iş öğretmeni':
                    case 'sınıf öğretmeni':
                        addProgressCircle(key, value, 'yellow');
                        break;
                    case 'yüksek özsaygılı':
                    case 'düşük özsaygılı':
                        addProgressCircle(key, value, 'pink');
                        break;
                    case 'otokratik':
                    case 'sosyal':
                        addProgressCircle(key, value, '#cbc0d3');
                        break;
                    case 'işbirliğine açık':
                    case 'bağımsız çalışan':
                        addProgressCircle(key, value, 'orange');
                        break;
                    case 'durağan':
                    case 'gelişime açık':
                        addProgressCircle(key, value, '#c27731');
                        break;
                    default:
                        addProgressCircle(key, value, 'black');
                }
            });
        });
    }
    document.querySelector('.button').style.display="none";
}
