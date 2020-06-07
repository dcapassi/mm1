function expRandom(reference) {
  let u = Math.random();
  return (-1 * Math.log(1 - u)) / reference;
}

queueMM1 = (lambda, mu) => {
  let entity = [];
  let arrivalTime = [];
  let timeBetweenArrival = [];
  let startingService = [];
  let serviceTime = [];
  let finishingTime = [];
  let waitingInQueue = [];
  let timeInSystem = [];
  let totalWaitingInQueue = 0;
  let totalTimeInSystem = 0;
  let waited = [];
  let totalCustomers = 0;

  let count = 0;
  let stop = 100000;

  for (count; count < stop; count++) {
    entity[count] = count;
    serviceTime[count] = expRandom(mu);
    timeBetweenArrival[count] = expRandom(lambda);

    if (count === 0) {
      arrivalTime[count] = 0;
      startingService[count] = arrivalTime[count];
    }

    if (count != 0) {
      arrivalTime[count] =
        arrivalTime[count - 1] + timeBetweenArrival[count - 1];
      arrivalTime[count] > finishingTime[count - 1]
        ? (startingService[count] = arrivalTime[count])
        : (startingService[count] = finishingTime[count - 1]);
    }

    finishingTime[count] = startingService[count] + serviceTime[count];
    waitingInQueue[count] = startingService[count] - arrivalTime[count];
    timeInSystem[count] = finishingTime[count] - arrivalTime[count];

    totalWaitingInQueue = totalWaitingInQueue + waitingInQueue[count];
    totalTimeInSystem = totalTimeInSystem + timeInSystem[count];

    if (startingService[count] > arrivalTime[count]) {
      waited[count] = true;
    } else {
      waited[count] = false;
    }
  }

  let countJobs = [];
  for (let i = 0; i < entity.length; i++) {
    let count = 1;
    for (let j = i; j < entity.length; j++) {
      if (finishingTime[i] > arrivalTime[j + 1]) {
        count = count + 1;
      }
    }
    countJobs.push(count);
    totalCustomers = totalCustomers + count;
    count = 1;
  }

  let avgWaitingInQueue = (totalWaitingInQueue / stop).toFixed(2);
  let avgTimeInSystem = (totalTimeInSystem / stop).toFixed(2);
  let avgCustomersInSystem = (totalCustomers / stop).toFixed(2);

  return {
    avgCustomersInSystem,
    calcAvgCustomersInSystem: (lambda / (mu - lambda)).toFixed(2),
    avgWaitingInQueue,
    calcWaitingInQueue: (lambda / (mu * (mu - lambda))).toFixed(2),
    avgTimeInSystem,
    calcTimeInSystem: (1 / (mu - lambda)).toFixed(2),
  };
};

//Run MM1
lambda = 0.09;
mu = 0.1;
console.log(queueMM1(lambda, mu));

//localStorage.setItem("arrayResultado", arrayRandom);
