document.getElementById('ringSizeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const gender = document.getElementById('gender').value;
    const biotype = document.getElementById('biotype').value;

    const { ringSize, message } = calculateRingSize(height, weight, gender, biotype);
    const probableRange = getProbableRange(weight, gender);

    document.getElementById('result').innerHTML = `
        <div>${message}</div>
        <div>O tamanho provável da sua aliança é: <span style="color: #007BFF;">${ringSize}</span></div>
        <div class="result-detail">Intervalo provável: <span style="color: #007BFF;">${probableRange[0]} - ${probableRange[1]}</span></div>
    `;
});

function calculateRingSize(height, weight, gender, biotype) {
    let baseSize;
    let message = '';

    if (weight < 35 || weight > 150) {
        message = "Não foi possível determinar o valor exato. ";
        baseSize = gender === 'male' ? 21 : 8; // Valor médio para homens e mulheres fora do intervalo
    } else {
        // Base ring size calculated from weight, adjusted with gender and biotype
        baseSize = (weight - 40) * 0.15;

        // Weighted adjustments based on gender
        const genderWeight = gender === 'male' ? 1.8 : 1.3; // Different weights for male/female
        baseSize += genderWeight;

        // Height adjustment with greater weight
        if (height > 180) baseSize += 1;
        else if (height < 160) baseSize -= 0.8;

        // Biotype adjustments with a more refined approach
        if (biotype === 'slim') {
            baseSize -= 1; // Slimmer biotypes have thinner fingers
        } else if (biotype === 'muscular') {
            baseSize += 1.5; // Muscular biotypes will typically have thicker fingers
        } else if (biotype === 'overweight') {
            baseSize += 1.8; // Overweight biotypes get a higher adjustment
        }
    }

    // Ensuring the ring size is within the probable range
    const probableRange = getProbableRange(weight, gender);
    if (baseSize < probableRange[0]) baseSize = probableRange[0];
    else if (baseSize > probableRange[1]) baseSize = probableRange[1];

    return { ringSize: Math.round(baseSize), message };
}

function getProbableRange(weight, gender) {
    const maleRange = [[7, 9], [10, 14], [12, 16], [13, 17], [15, 19], [16, 20], [20, 24]];
    const femaleRange = [[4, 6], [7, 9], [9, 13], [10, 14], [11, 15], [12, 17], [16, 20]];

    // More precise weight brackets
    if (weight < 35) return gender === 'male' ? maleRange[0] : femaleRange[0];
    else if (weight >= 35 && weight < 45) return gender === 'male' ? maleRange[1] : femaleRange[1];
    else if (weight >= 45 && weight < 55) return gender === 'male' ? maleRange[2] : femaleRange[2];
    else if (weight >= 55 && weight < 65) return gender === 'male' ? maleRange[3] : femaleRange[3];
    else if (weight >= 65 && weight < 75) return gender === 'male' ? maleRange[4] : femaleRange[4];
    else if (weight >= 75 && weight < 85) return gender === 'male' ? maleRange[5] : femaleRange[5];
    else if (weight >= 85 && weight < 150) return gender === 'male' ? maleRange[6] : femaleRange[6];
}
