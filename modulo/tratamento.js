const tratarDataFRONT = function (data) {

    const dataSemTempo = data.split('T')[0]

    const [ano, mes, dia] = dataSemTempo.split('-')

    const nomeMes = obterNomeMes(mes)

    const dataFormatada = `${dia} de ${nomeMes} de ${ano}`

    return dataFormatada
}

const tratarDataBACK = function (data) {

    const dataSemTempo = `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, '0')}-${String(data.getUTCDate()).padStart(2, '0')}`

    const dataFormatada = `${dataSemTempo}`

    return dataFormatada
}

const obterNomeMes = function (numeroMes) {
    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]

    const nomeMes = meses[parseInt(numeroMes) - 1]

    return nomeMes
}

const tratarHoraFRONT = function (tempo) {
    // Remover tudo 'T' e depois do último caractere 'Z'
    const tempoSemData = tempo.split('T')[1].split('.')[0]

    // Separar as horas e os minutos
    const [horas, minutos] = tempoSemData.split(':')

    // Verificar se o número de horas é maior que 1
    if (parseInt(horas) > 1) {
        const horaFormatada = `${horas} horas e ${minutos} minutos`
        return horaFormatada
    } else {
        const horaFormatada = `${horas} hora e ${minutos} minutos`
        return horaFormatada
    }
}

 const tratarHoraBACK = function (tempo) {
    const tempoSemData = `${tempo.getHours()}:${tempo.getMinutes()}`

    const horaFormatada = `${tempoSemData}`
    return horaFormatada
}

const tratarValorUnitarioFRONT = function (valorUnitario) {
    const strValorUnitario = valorUnitario.toString()

    const digito0 = strValorUnitario.split("")[0];
    const digito1 = strValorUnitario.split("")[1];
    const digito2 = strValorUnitario.split("")[2];
    const digito3 = strValorUnitario.split("")[3];
    const digito4 = strValorUnitario.split("")[4];

    const valorUnitarioCurto = `${digito0}${digito1}${digito2}${digito3}${digito4}`

    const valorUnitarioFormatado = `${valorUnitarioCurto}`

    return valorUnitarioFormatado
}

module.exports = {
    tratarDataBACK,
    tratarDataFRONT,
    tratarHoraBACK,
    tratarHoraFRONT,
    tratarValorUnitarioFRONT
}