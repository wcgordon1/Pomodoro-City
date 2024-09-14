let timer = null;
let remainingTime = 0;

self.onmessage = function(e) {
  if (e.data.action === 'start') {
    remainingTime = e.data.time;
    if (timer === null) {
      timer = setInterval(() => {
        remainingTime--;
        self.postMessage({ remainingTime });
        if (remainingTime <= 0) {
          clearInterval(timer);
          timer = null;
          self.postMessage({ timerEnded: true });
        }
      }, 1000);
    }
  } else if (e.data.action === 'pause') {
    clearInterval(timer);
    timer = null;
  } else if (e.data.action === 'reset') {
    clearInterval(timer);
    timer = null;
    remainingTime = e.data.time;
    self.postMessage({ remainingTime });
  }
};