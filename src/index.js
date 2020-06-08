function expRandom(reference) {
  let u = Math.random();
  return (-1 * Math.log(1 - u)) / reference;
}

queueMM1 = (lambda, mu) => {
  let entry = []; // Entrada na fila
  let arrivalTime = []; //Tempo de Chegda
  let timeBetweenArrival = []; //Tempo aleatório entre chegadas
  let startingService = []; //Inicio do serviço
  let serviceTime = []; //Tempo de Serviço
  let finishingTime = []; //Finalização do Serviço
  let waitingInQueue = []; //Tempo de espera na fila
  let timeInSystem = []; //Tempo no sistema (Fila + Serviço)
  let totalWaitingInQueue = 0; //Soma de todos tempos na fila
  let totalTimeInSystem = 0; //Soma de todos tempos no sistema
  let waited = []; // Bool para indicar se houve espera
  let count = 0; // Contador para loop

  let stop = 10000; // Indica número de iterações

  for (count; count < stop; count++) {
    entry[count] = count;
    // Valor aleatório com distribuição exponencial para tempo de serviço e tempo entre chegadas
    serviceTime[count] = expRandom(mu);
    timeBetweenArrival[count] = expRandom(lambda);

    if (count === 0) {
      //Atribuição utilizada na primeira iteração
      arrivalTime[count] = 0;
      startingService[count] = arrivalTime[count]; //Inicio em 0
    }
    if (count != 0) {
      arrivalTime[count] =
        arrivalTime[count - 1] + timeBetweenArrival[count - 1];
      //Se o tempo de chegada é menor que o tempo de finalização da entrada anterior
      //Inicio do serviço apenas ocorre após a finalização da entrada anterior e haverá espera
      arrivalTime[count] > finishingTime[count - 1]
        ? (startingService[count] = arrivalTime[count])
        : (startingService[count] = finishingTime[count - 1]);
    }
    //Tempo de servico é o inicio mais a duração do serviço
    finishingTime[count] = startingService[count] + serviceTime[count];

    //Tempo na vila é o começo do serviço menos o tempo de chegada
    waitingInQueue[count] = startingService[count] - arrivalTime[count];

    //Tempo no sistema é o tempo de finalização menos a chegada
    timeInSystem[count] = finishingTime[count] - arrivalTime[count];

    totalWaitingInQueue = totalWaitingInQueue + waitingInQueue[count];
    totalTimeInSystem = totalTimeInSystem + timeInSystem[count];

    //Verificação se serviço aguardou ou não
    //Bloco separado para aumentar a clareza, poderia verificar utilizando a lógica da verificação anterior
    if (startingService[count] > arrivalTime[count]) {
      waited[count] = true;
    } else {
      waited[count] = false;
    }
  }

  let avgWaitingInQueue = (totalWaitingInQueue / stop).toFixed(2);
  let avgTimeInSystem = (totalTimeInSystem / stop).toFixed(2);

  return {
    avgWaitingInQueue: {
      simulated: avgWaitingInQueue,
      calculated: (lambda / (mu * (mu - lambda))).toFixed(2),
      precision: (
        avgWaitingInQueue / (lambda / (mu * (mu - lambda))) -
        1
      ).toFixed(2),
    },
    avgTimeInSystem: {
      simulated: avgTimeInSystem,
      calculated: (1 / (mu - lambda)).toFixed(2),
      precision: (avgTimeInSystem / (1 / (mu - lambda)) - 1).toFixed(2),
    },
  };
};

//
//Rodar m/m/1
//

//Loop para rodar a simulação multiplas vezes
let numberOfSimulations = 20;
lambda = 0.07;
mu = 0.1;

//Variaveis utilizadas para calculo do erro
let precisionTimeInQueue = 0;
let precisionTimeInTheSystem = 0;
let avgPrecisionTimeInQueue = 0;
let avgPrecisionTimeInTheSystem = 0;
let run = [];

for (let i = 0; i < numberOfSimulations; i++) {
  run[i] = queueMM1(lambda, mu);

  //Imprimir na console dados da execução
  console.log(`Execução[${i}]`);
  console.log(run[i]);

  precisionTimeInQueue =
    precisionTimeInQueue + parseFloat(run[i].avgWaitingInQueue.precision);

  precisionTimeInTheSystem =
    precisionTimeInTheSystem + parseFloat(run[i].avgTimeInSystem.precision);
}

try {
  avgPrecisionTimeInQueue = precisionTimeInQueue / numberOfSimulations;
  avgPrecisionTimeInTheSystem = precisionTimeInTheSystem / numberOfSimulations;
} catch (error) {
  console.log(error);
}
console.log(`------:`);

console.log(
  `Erro do Tempo de Espera na Fila:  ${avgPrecisionTimeInQueue.toFixed(5)}`
);
console.log(
  `Erro do Tempo de Espera no Sistema:  ${avgPrecisionTimeInTheSystem.toFixed(
    5
  )}`
);
